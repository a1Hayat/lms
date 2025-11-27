'use client'

import React, { ChangeEvent } from "react"
import { useFormContext, Controller } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { ResourceFormValues } from "@/app/dashboard/admin/resources/add/page"

export default function Step1ResourceDetails() {
  const { register, control, formState: { errors }, setValue, getValues } = useFormContext<ResourceFormValues>()

  const onThumbChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setValue("thumbnail", file)
  }

  const values = getValues()

  return (
    <div>
      <h2 className="text-lg font-medium mb-3">Resource Details</h2>

      <div className="space-y-4">

        <div>
          <label className="block text-sm font-medium">Title</label>
          <Input {...register("title", { required: true })} />
          {errors.title && <p className="text-sm text-red-600">Title is required</p>}
        </div>

        <div>
          <label className="block text-xs">Select Level</label>
          <Controller
            control={control}
            name="level"
            defaultValue="o-level" // important
            render={({ field }) => (
              <Select
                {...field}
                onValueChange={(val: "o-level" | "as-level" | "a-level") => field.onChange(val)}
                value={field.value}
              >
                <SelectTrigger className="w-full text-xs">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="o-level" className="text-xs">O Level | IGCSE</SelectItem>
                  <SelectItem value="as-level" className="text-xs">AS Level | A-1</SelectItem>
                  <SelectItem value="a-level" className="text-xs">A Level | A-2</SelectItem>
                </SelectContent>
              </Select>
            )}
          />

          {/* Fix: Removed unnecessary 'as any' casting */}
          {errors.level && <p className="text-sm text-red-600">{errors.level.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Description (optional)</label>
          <Textarea {...register("description")} rows={3} />
        </div>

        <div>
          <label className="block text-sm font-medium">Price (optional)</label>
          <Input type="number" {...register("price", { valueAsNumber: true })} />
        </div>

        <div>
          <label className="block text-sm font-medium">Thumbnail (optional)</label>
          <Input type="file" accept="image/*" onChange={onThumbChange} />
          {values.thumbnail instanceof File && <p className="text-sm">Selected: {values.thumbnail.name}</p>}
        </div>

      </div>
    </div>
  )
}