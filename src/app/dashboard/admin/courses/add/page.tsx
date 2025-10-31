'use client'

import React, { useEffect, useState } from "react"
import Step1CourseDetails from "@/components/courses/AddCourseForm/Step1CourseDetails"
import Step2Lessons from "@/components/courses/AddCourseForm/Step2Lessons"
import Step3Review from "@/components/courses/AddCourseForm/Step3Review"
import { z } from "zod"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AppAlert } from "@/components/alerts"

export type Lesson = {
  id: string
  name: string
  duration: string
  // file is only on client; server will return uploaded file URL or id
  file?: File | null
  uploadedUrl?: string | null
}

export type CourseFormValues = {
  title: string
  description: string
  price: number | ""
  thumbnail?: File | null
  lessons: Lesson[]
}

/** zod schema (for validation) */
const lessonSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Lesson name is required"),
  duration: z.string().min(1, "Duration is required"),
  // file is optional in validation (we allow uploading later)
  uploadedUrl: z.string().nullable().optional(),
})

const courseSchema = z.object({
  title: z.string().min(3, "Title required"),
  description: z.string().min(10, "Description required"),
  price: z.union([z.number().min(0), z.string()]).optional(),
  lessons: z.array(lessonSchema).min(1, "Add at least one lesson"),
})

const DRAFT_KEY = "course_creation_draft_v1"

const defaultValues: CourseFormValues = {
  title: "",
  description: "",
  price: "",
  thumbnail: null,
  lessons: [],
}

export default function AddCourseForm() {

  const [alert, setAlert] = useState({
    show: false,
    type: "info" as "success" | "error" | "warning" | "info",
    title: "",
    description: "",
  })


  const methods = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues,
    mode: "onBlur",
  })
  const { watch, reset, getValues } = methods

  const [step, setStep] = useState<number>(1)
  const formState = watch()

  // Restore draft from localStorage on mount
  useEffect(() => {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        // Note: files cannot be serialized; thumbnail/lesson.file will be null on restore
        reset(parsed)
      } catch (e) {
        console.error("Failed to parse draft", e)
      }
    }
  }, [reset])

  // Autosave to localStorage whenever form changes (debounce lightly)
  useEffect(() => {
    const handler = setTimeout(() => {
      const values = getValues()
      // We must remove File objects before saving (can't store them)
      const serializable = {
        ...values,
        thumbnail: null,
        lessons: values.lessons.map(l => ({
          ...l,
          file: undefined,
        })),
      }
      localStorage.setItem(DRAFT_KEY, JSON.stringify(serializable))
    }, 400)

    return () => clearTimeout(handler)
  }, [formState, getValues])

  const next = async () => {
    // Validate current form (zod applies)
    const isStepValid = await methods.trigger()
    if (!isStepValid) return
    setStep(s => Math.min(3, s + 1))
  }
  const prev = () => setStep(s => Math.max(1, s - 1))

  const handleSaveDraftToServer = async () => {
    // Strategy:
    // 1) Upload thumbnail (if exists) -> get url/id
    // 2) Upload lesson files (if exists) -> get urls
    // 3) Send JSON draft to /api/drafts (with returned file urls)
    try {
      const values = getValues()

      // 1) Upload thumbnail if present
      let thumbnailUrl: string | null = null
      if ((values.thumbnail as any) instanceof File) {
        const fd = new FormData()
        fd.append("file", values.thumbnail as File)
        const res = await fetch("/api/uploads", { method: "POST", body: fd })
        const json = await res.json()
        thumbnailUrl = json.url
      }

      // 2) Upload lesson files that are File objects and don't already have uploadedUrl
      const lessonsWithUrls = await Promise.all(
        values.lessons.map(async l => {
          if ((l.file as any) instanceof File) {
            const fd = new FormData()
            fd.append("file", l.file as File)
            const res = await fetch("/api/uploads", { method: "POST", body: fd })
            const json = await res.json()
            return { ...l, uploadedUrl: json.url }
          }
          return l
        })
      )

      // 3) Save draft metadata to server
      const draftPayload = {
        title: values.title,
        description: values.description,
        price: values.price,
        thumbnailUrl,
        lessons: lessonsWithUrls.map(l => ({
          id: l.id,
          name: l.name,
          duration: l.duration,
          uploadedUrl: l.uploadedUrl || null,
        })),
        savedAt: new Date().toISOString(),
      }

      const res = await fetch("/api/courses/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draftPayload),
      })
      if (!res.ok) throw new Error("Failed to save draft")
      const body = await res.json()
      setAlert({
        show: true,
        type: "success",
        title: "Draft Saved",
        description: `Your draft was saved successfully (ID: ${body.draftId}).`,
      })

    } catch (err) {
      console.error(err)
      setAlert({
        show: true,
        type: "error",
        title: "Save Failed",
        description: "Could not save your draft to the server. Please try again.",
      })


    }
  }

  const handleSubmit = async () => {
    try {
      // we need server-side strategy to accept files; here we upload files first like Save Draft
      const values = getValues()

      // Upload thumbnail if any
      let thumbnailUrl: string | null = null
      if ((values.thumbnail as any) instanceof File) {
        const fd = new FormData()
        fd.append("file", values.thumbnail as File)
        const res = await fetch("/api/uploads", { method: "POST", body: fd })
        const json = await res.json()
        thumbnailUrl = json.url
      }

      // Upload lesson files
      const lessonsWithUrls = await Promise.all(
        values.lessons.map(async l => {
          if ((l.file as any) instanceof File) {
            const fd = new FormData()
            fd.append("file", l.file as File)
            const res = await fetch("/api/uploads", { method: "POST", body: fd })
            const json = await res.json()
            return { id: l.id, name: l.name, duration: l.duration, url: json.url }
          }
          // already uploaded
          return { id: l.id, name: l.name, duration: l.duration, url: l.uploadedUrl || null }
        })
      )

      const payload = {
        title: values.title,
        description: values.description,
        price: values.price,
        thumbnailUrl,
        lessons: lessonsWithUrls,
      }

      const res = await fetch("/api/courses/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("Create failed")
      localStorage.removeItem(DRAFT_KEY)
      setAlert({
        show: true,
        type: "success",
        title: "Course Created",
        description: "Your course has been successfully published.",
      })

      // optionally redirect
    } catch (err) {
      console.error(err)
      setAlert({
        show: true,
        type: "error",
        title: "Submission Failed",
        description: "We couldn’t create your course. Check your input and try again.",
      })

    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={e => e.preventDefault()} className="w-full mx-auto p-6 bg-transparent rounded-md">
        <AppAlert
          type={alert.type}
          title={alert.title}
          description={alert.description}
          open={alert.show}
          onClose={() => setAlert({ ...alert, show: false })}
        />

        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Create Course</h1>
          <div className="space-x-2">
            <Button onClick={handleSaveDraftToServer} variant="outline" size="sm">Save Draft to Server</Button>
            <Button onClick={() => { localStorage.removeItem(DRAFT_KEY); reset(defaultValues); 
              setAlert({
                show: true,
                type: "info",
                title: "Draft Cleared",
                description: "Your locally saved draft has been removed.",
              })
             }} variant="ghost" size="sm">Clear Draft</Button>
          </div>
        </div>

        <div className="mb-6">
          <Progress value={step} max={3} className=" h-2 " />
          <div className="flex justify-between text-sm mt-2">
            <span>Step 1 — Details</span>
            <span>Step 2 — Lessons</span>
            <span>Step 3 — Review</span>
          </div>
        </div>

        {step === 1 && <Step1CourseDetails />}
        {step === 2 && <Step2Lessons />}
        {step === 3 && <Step3Review onEditStep={(s) => setStep(s)} />}

        <div className="mt-6 flex justify-between">
          <div>
            {step > 1 && <Button variant="outline" onClick={prev}>Back</Button>}
          </div>

          <div className="flex gap-2">
            {step < 3 && <Button onClick={next}>Next</Button>}
            {step === 3 && <Button onClick={handleSubmit}>Submit Course</Button>}
          </div>
        </div>
      </form>
    </FormProvider>
  )
}
