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
import { useSession } from "next-auth/react"


export type Lesson = {
  id: string
  name: string
  duration: string
  file?: File | null
  uploadedUrl?: string | null
}

export type CourseFormValues = {
  title: string
  description: string
  price: number | ""
  level: "o-level" | "as-level" | "a-level"
  thumbnail?: File | null
  lessons: Lesson[]
}

/** ✅ Zod validation schema */
const lessonSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Lesson name is required"),
  duration: z.string().min(1, "Duration is required"),
  uploadedUrl: z.string().nullable().optional(),
})

const courseSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Description is required"),
  price: z.union([z.number().min(0), z.literal("")]),
  level: z.enum(["o-level", "as-level", "a-level"]),
  lessons: z.array(lessonSchema).min(1, "Add at least one lesson"),
})

const DRAFT_KEY = "course_creation_draft_v1"

const defaultValues: CourseFormValues = {
  title: "",
  description: "",
  price: "",
  level: "o-level",
  thumbnail: null,
  lessons: [],
}

export default function AddCourseForm() {

  const { data: session } = useSession()

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

  /** Restore draft from localStorage */
  useEffect(() => {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        reset(parsed)
      } catch (e) {
        console.error("Failed to parse draft", e)
      }
    }
  }, [reset])

  /** Autosave to localStorage */
  useEffect(() => {
    const handler = setTimeout(() => {
      const values = getValues()
      const serializable = {
        ...values,
        thumbnail: null,
        lessons: values.lessons.map(l => ({ ...l, file: undefined })),
      }
      localStorage.setItem(DRAFT_KEY, JSON.stringify(serializable))
    }, 400)
    return () => clearTimeout(handler)
  }, [formState, getValues])

  const next = async () => {
    // Only validate fields from the current step
    const stepFields = {
      1: ["title", "description", "price", "level"],
      2: ["lessons"],
    } as const

    // FIX: Check if step corresponds to keys in stepFields to narrow type
    if (step === 1 || step === 2) {
      const fieldsToValidate = stepFields[step]
      const isStepValid = await methods.trigger(fieldsToValidate)

      console.log("Step valid?", isStepValid, methods.formState.errors)

      if (!isStepValid) return
    }
    
    setStep((s) => Math.min(3, s + 1))
  }

  const prev = () => setStep(s => Math.max(1, s - 1))

  /** ✅ Save draft to server (MySQL JSON) */
  const handleSaveDraftToServer = async () => {
    try {
      const values = getValues()

      // Upload thumbnail if needed
      let thumbnailUrl: string | null = null
      if (values.thumbnail instanceof File) {
        const fd = new FormData()
        fd.append("file", values.thumbnail)
        const res = await fetch("/api/uploads", { method: "POST", body: fd })
        const json = await res.json()
        thumbnailUrl = json.url
      }

      // Upload lesson files if any
      const lessonsWithUrls = await Promise.all(
        values.lessons.map(async l => {
          if (l.file instanceof File) {
            const fd = new FormData()
            fd.append("file", l.file)
            const res = await fetch("/api/uploads", { method: "POST", body: fd })
            const json = await res.json()
            return { ...l, uploadedUrl: json.url }
          }
          return l
        })
      )

      // Payload for MySQL (drafts)
      const draftPayload = {
        title: values.title,
        description: values.description,
        price: Number(values.price) || 0,
        level: values.level,
        thumbnailUrl,
        lessons: lessonsWithUrls,
        savedAt: new Date().toISOString(),
        user_id: session?.user?.id,
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
        description: `Draft saved successfully (ID: ${body.draftId}).`,
      })
    } catch (err) {
      console.error(err)
      setAlert({
        show: true,
        type: "error",
        title: "Save Failed",
        description: "Could not save your draft. Please try again.",
      })
    }
  }

  /** ✅ Submit full course (MySQL JSON) */
  const handleSubmit = async () => {
    try {
      const values = getValues()

      // Upload thumbnail if needed
      let thumbnailUrl: string | null = null
      if (values.thumbnail instanceof File) {
        const fd = new FormData()
        fd.append("file", values.thumbnail)
        const res = await fetch("/api/uploads/thumbnails", { method: "POST", body: fd })
        const json = await res.json()
        thumbnailUrl = json.url
      }

      // Upload lesson files if any
      const lessonsWithUrls = await Promise.all(
        values.lessons.map(async l => {
          if (l.file instanceof File) {
            const fd = new FormData()
            fd.append("file", l.file)
            const res = await fetch("/api/uploads/lessons", { method: "POST", body: fd })
            const json = await res.json()
            return { ...l, uploadedUrl: json.url }
          }
          return l
        })
      )

      // Payload for MySQL backend
      const payload = {
        title: values.title,
        description: values.description,
        price: Number(values.price) || 0,
        level: values.level,
        thumbnailUrl,
        lessons: lessonsWithUrls,
      }

      const res = await fetch("/api/courses/add-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Failed to create course")

      localStorage.removeItem(DRAFT_KEY)
      setAlert({
        show: true,
        type: "success",
        title: "Course Created",
        description: "Your course has been successfully published.",
      })
      window.location.href=('/dashboard/admin/courses')
    } catch (err) {
      console.error(err)
      setAlert({
        show: true,
        type: "error",
        title: "Submission Failed",
        description: "We couldn’t create your course. Please try again.",
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
            <Button onClick={handleSaveDraftToServer} variant="outline" size="sm">
              Save Draft to Server
            </Button>
            <Button
              onClick={() => {
                localStorage.removeItem(DRAFT_KEY)
                reset(defaultValues)
                setAlert({
                  show: true,
                  type: "info",
                  title: "Draft Cleared",
                  description: "Your local draft has been cleared.",
                })
              }}
              variant="ghost"
              size="sm"
            >
              Clear Draft
            </Button>
          </div>
        </div>

        <div className="mb-6">
         <Progress value={(step / 3) * 100} className="w-full h-2" />

          <div className="flex justify-between text-sm mt-2">
            <span>Step 1 — Details</span>
            <span>Step 2 — Lessons</span>
            <span>Step 3 — Review</span>
          </div>
        </div>

        {step === 1 && <Step1CourseDetails />}
        {step === 2 && <Step2Lessons />}
        {step === 3 && <Step3Review onEditStep={s => setStep(s)} />}

        <div className="mt-6 flex justify-between">
          {step > 1 && <Button variant="outline" onClick={prev}>Back</Button>}
          <div className="flex gap-2">
            {step < 3 && <Button onClick={next}>Next</Button>}
            {step === 3 && <Button onClick={handleSubmit}>Submit Course</Button>}
          </div>
        </div>
      </form>
    </FormProvider>
  )
}