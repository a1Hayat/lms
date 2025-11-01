'use client'

import React, { ChangeEvent, useState } from "react"
import { useFormContext, Controller } from "react-hook-form"
import { CourseFormValues } from "@/app/dashboard/admin/courses/add/page"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AppAlert } from "@/components/alerts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Step1CourseDetails() {
  const { register, control, formState: { errors }, setValue, getValues } = useFormContext<CourseFormValues>()

  const onThumbChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setValue("thumbnail", file)
  }

  const values = getValues()

  return (
    <div>
      <h2 className="text-lg font-medium mb-3">Course Details</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <Input {...register("title")} className="w-full border p-2" />
          {errors.title && <p className="text-sm text-red-600">{(errors.title as any).message}</p>}
        </div>

        <div>
          <label className="block text-xs">Select Level</label>
          <Select
            required
            // onValueChange={(val) => {
            //   updateDelegate(index, "gender", val);
            //   updateDelegate(index, "category", []); // reset sports when gender changes
            // }}
            // value={delegate.gender}
          >
            <SelectTrigger className="w-full text-xs">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="o-level" className="text-xs">
                O Level | IGCSE
              </SelectItem>
              <SelectItem value="as-level" className="text-xs">
                AS Level | A-1
              </SelectItem>
              <SelectItem value="a-level" className="text-xs">
                A Level | A-2
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.level && <p className="text-sm text-red-600">{(errors.level as any).message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <Textarea {...register("description")} rows={4} className="w-full border p-2 " />
          {errors.description && <p className="text-sm text-red-600">{(errors.description as any).message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Price</label>
          <Input type="number" {...register("price", { valueAsNumber: true })} className="w-full border p-2" />
          {errors.price && <p className="text-sm text-red-600">{(errors.price as any).message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Thumbnail (optional)</label>
          <Input type="file" accept="image/*" onChange={onThumbChange} />
          {values.thumbnail && !(values.thumbnail instanceof File) && <p className="text-sm text-muted">Thumbnail already uploaded / restored.</p>}
          {values.thumbnail instanceof File && <p className="text-sm">Selected: {(values.thumbnail as File).name}</p>}
        </div>
      </div>
    </div>
  )
}
