'use client'

import React from "react"
import { useFormContext } from "react-hook-form"
import { CourseFormValues } from "@/app/dashboard/admin/courses/add/page"

export default function Step3Review({ onEditStep }: { onEditStep?: (s: number) => void }) {
  const { getValues } = useFormContext<CourseFormValues>()
  const v = getValues()

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
          <div>{v.price}</div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Lessons</div>
            {onEditStep && <button onClick={() => onEditStep(2)} className="text-sm text-blue-600">Edit lessons</button>}
          </div>
          <ul className="mt-2 space-y-1">
            {v.lessons.map(l => (
              <li key={l.id} className="p-2 border rounded-md">
                <div className="font-medium">{l.name}</div>
                <div className="text-sm text-gray-500">{l.duration}</div>
                <div className="text-xs text-gray-400">{l.uploadedUrl ? `Uploaded` : l.file ? `File selected (not uploaded)` : `No file`}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
