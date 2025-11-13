'use client'

import React, { useEffect, useState } from "react"
import Step1ResourceDetails from "@/components/resources/AddResourcesForm/Step1CourseDetails"
import Step2UploadPDF from "@/components/resources/AddResourcesForm/Step2Lessons"
import Step3Review from "@/components/resources/AddResourcesForm/Step3Review"
import { z } from "zod"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AppAlert } from "@/components/alerts"

// -------------------
// Types
// -------------------
export type ResourceFormValues = {
  title: string
  description?: string
  price?: number | ""
  level: "o-level" | "as-level" | "a-level"
  thumbnail?: File | null
  file_path?: File | null
}

// -------------------
// Zod Schema
// -------------------
const resourceSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().optional(),
  price: z.union([z.number().min(0), z.literal("")]).optional(),
  level: z.enum(["o-level", "as-level", "a-level"]),
  file_path: z.instanceof(File, "PDF file is required"),
  thumbnail: z.any().optional(),
})

const DRAFT_KEY = "resource_creation_draft_v1"

const defaultValues: ResourceFormValues = {
  title: "",
  description: "",
  price: "",
  level: "o-level",
  thumbnail: null,
  file_path: null,
}

// -------------------
// Main Page
// -------------------
export default function AddResourceForm() {
  const [alert, setAlert] = useState({
    show: false,
    type: "info" as "success" | "error" | "warning" | "info",
    title: "",
    description: "",
  })

  const [loading, setLoading] = useState(false)

  const methods = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceSchema),
    defaultValues,
    mode: "onBlur",
  })

  const { watch, reset, getValues, trigger } = methods
  const [step, setStep] = useState<number>(1)
  const formState = watch()

  // -------------------
  // Restore draft
  // -------------------
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

  // -------------------
  // Autosave draft
  // -------------------
  useEffect(() => {
    const handler = setTimeout(() => {
      const values = getValues()
      const serializable = { ...values, thumbnail: null, file_path: null }
      localStorage.setItem(DRAFT_KEY, JSON.stringify(serializable))
    }, 500)
    return () => clearTimeout(handler)
  }, [formState, getValues])

  // -------------------
  // Navigation
  // -------------------
  const next = async () => {
    const stepFields = {
      1: ["title", "description", "price", "level", "thumbnail"],
      2: ["file_path"],
    } as const

    const fieldsToValidate = stepFields[step]
    const isStepValid = await trigger(fieldsToValidate)
    if (!isStepValid) return
    setStep((s) => Math.min(3, s + 1))
  }

  const prev = () => setStep(s => Math.max(1, s - 1))

  // -------------------
  // Clear draft
  // -------------------
  const handleClearDraft = () => {
    localStorage.removeItem(DRAFT_KEY)
    reset(defaultValues)
    setAlert({
      show: true,
      type: "info",
      title: "Draft Cleared",
      description: "Your local draft has been cleared.",
    })
  }

  // -------------------
  // Submit resource
  // -------------------
  const handleSubmit = async () => {
    setLoading(true)
    try {
      const values = getValues()

      if (!(values.file_path instanceof File)) {
        setAlert({
          show: true,
          type: "error",
          title: "PDF Required",
          description: "Please upload a PDF file before submitting.",
        })
        setStep(2)
        setLoading(false)
        return
      }

      const fd = new FormData()
      fd.append("title", values.title)
      fd.append("description", values.description || "")
      fd.append("price", values.price?.toString() || "0")
      fd.append("level", values.level)
      fd.append("file_path", values.file_path)
      if (values.thumbnail instanceof File) fd.append("thumbnail", values.thumbnail)

      const res = await fetch("/api/resources/add-resource", {
        method: "POST",
        body: fd,
      })

      if (!res.ok) throw new Error("Failed to upload resource")

      localStorage.removeItem(DRAFT_KEY)
      setAlert({
        show: true,
        type: "success",
        title: "Resource Created",
        description: "Your resource has been successfully uploaded.",
      })

      // Redirect
      window.location.href = "/dashboard/admin/resources"
    } catch (err) {
      console.error(err)
      setAlert({
        show: true,
        type: "error",
        title: "Submission Failed",
        description: "We couldn’t upload your resource. Please try again.",
      })
    } finally {
      setLoading(false)
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
          <h1 className="text-xl font-bold">Add Resource</h1>
          <Button onClick={handleClearDraft} variant="ghost" size="sm">
            Clear Draft
          </Button>
        </div>

        <div className="mb-6">
          <Progress value={(step / 3) * 100} className="w-full h-2" />
          <div className="flex justify-between text-sm mt-2">
            <span>Step 1 — Details</span>
            <span>Step 2 — PDF Upload</span>
            <span>Step 3 — Review</span>
          </div>
        </div>

        {step === 1 && <Step1ResourceDetails />}
        {step === 2 && <Step2UploadPDF />}
        {step === 3 && <Step3Review />}

        <div className="mt-6 flex justify-between">
          {step > 1 && <Button variant="outline" onClick={prev}>Back</Button>}
          <div className="flex gap-2">
            {step < 3 && <Button onClick={next}>Next</Button>}
            {step === 3 && <Button onClick={handleSubmit}>{loading ? "Please wait..." : "Submit Resource"}</Button>}
          </div>
        </div>
      </form>
    </FormProvider>
  )
}
