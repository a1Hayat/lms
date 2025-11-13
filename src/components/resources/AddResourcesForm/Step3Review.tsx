'use client'

import React from "react"
import { useFormContext } from "react-hook-form"
import { CourseFormValues } from "@/app/dashboard/admin/resources/add/page"

export default function Step3Review() {
  const v = useFormContext<CourseFormValues>().getValues()

  return (
    <div>
      <h2 className="text-lg font-medium mb-3">Review</h2>

      <div className="space-y-3">
        <div>
          <div className="text-sm text-gray-500">Title</div>
          <div className="font-medium">{v.title}</div>
        </div>

        <div>
          <div className="text-sm text-gray-500">Description</div>
          <div>{v.description}</div>
        </div>

        <div>
          <div className="text-sm text-gray-500">Price</div>
          <div>{v.price || "Free"}</div>
        </div>

        <div>
          <div className="text-sm text-gray-500">PDF File</div>
          <div>{v.file_path instanceof File ? v.file_path.name : "Not uploaded"}</div>
        </div>
      </div>
    </div>
  )
}
