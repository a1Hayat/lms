'use client'

import React, { useState } from "react"
import { useFormContext } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"
import { CourseFormValues, Lesson } from "@/app/dashboard/admin/courses/add/page"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Step2Lessons() {
  const { getValues, setValue } = useFormContext<CourseFormValues>()
  const values = getValues()
  const [name, setName] = useState("")
  const [duration, setDuration] = useState("")
  const [file, setFile] = useState<File | null>(null)

  const addLesson = () => {
    if (!name.trim()) return alert("Provide a lesson name")
    const newLesson: Lesson = { id: uuidv4(), name: name.trim(), duration: duration.trim(), file }
    const next = [...values.lessons, newLesson]
    setValue("lessons", next)
    setName(""); setDuration(""); setFile(null)
  }

  const removeLesson = (id: string) => {
    setValue("lessons", values.lessons.filter(l => l.id !== id))
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null)
  }

  return (
    <div>
      <h2 className="text-lg font-medium mb-3">Lessons</h2>

      <div className="grid gap-3">
        <Input placeholder="Lesson name" value={name} onChange={e => setName(e.target.value)} className="border p-2 " />
        <Input placeholder="Duration (e.g. 10:30)" value={duration} onChange={e => setDuration(e.target.value)} className="border p-2" />
        <Input type="file" accept="video/mp4" onChange={onFileChange} />
        <div className="flex gap-2">
          <Button type="button" onClick={addLesson} className="px-3 py-1 font-semibold bg-blue-100 dark:bg-[#00062b] text-blue-500 hover:bg-blue-200 ">Add Lesson</Button>
        </div>

        <div>
          <h3 className="font-semibold mt-4">Added lessons</h3>
          <ul className="mt-2 space-y-2">
            {values.lessons.map(l => (
              <li key={l.id} className="p-2 border rounded-md flex justify-between items-center">
                <div>
                  <div className="font-medium">{l.name}</div>
                  <div className="text-sm text-gray-500">{l.duration} {l.uploadedUrl ? `(uploaded)` : l.file ? `(file selected)` : ``}</div>
                </div>
                <div>
                  <Button onClick={() => removeLesson(l.id)} className="text-sm bg-red-100 dark:bg-[#290300] text-red-600 hover:bg-red-200">Remove</Button>
                </div>
              </li>
            ))}
            {values.lessons.length === 0 && <li className="text-sm text-gray-500">No lessons yet</li>}
          </ul>
        </div>
      </div>
    </div>
  )
}
