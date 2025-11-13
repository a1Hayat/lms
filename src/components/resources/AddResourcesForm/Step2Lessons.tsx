'use client'

import React from "react"
import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { CourseFormValues } from "@/app/dashboard/admin/resources/add/page"

export default function Step2UploadPDF() {
  const { setValue, watch } = useFormContext<CourseFormValues>()
  const file = watch("file_path")

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null
    if (f && f.type !== "application/pdf") {
      alert("Only PDF files allowed.")
      return
    }
    setValue("file_path", f)
  }

  return (
    <div>
      <h2 className="text-lg font-medium mb-3">Upload PDF</h2>

      <Input type="file" accept="application/pdf" onChange={onFileChange} />
      {file && <p className="text-sm mt-1">Selected: {file.name}</p>}
    </div>
  )
}
