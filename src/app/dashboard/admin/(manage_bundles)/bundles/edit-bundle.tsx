"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet"
import { FieldLabel } from "@/components/ui/field"
import { AppAlert } from "@/components/alerts"
import Loader from "@/components/loader"
import MultiSelect from "@/components/multi-select" // ✅ correct file path

interface BundleProps {
  isOpen: boolean
  onClose: () => void
  bundle_id: number
}

const Edit_Bundle: React.FC<BundleProps> = ({ isOpen, onClose, bundle_id }) => {
  const [courses, setCourses] = useState<any[]>([])
  const [resources, setResources] = useState<any[]>([])

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    selectedCourses: [] as any[],
    selectedResources: [] as any[],
    price: 0,
    discount_price: 0,
  })

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [alert, setAlert] = useState({
    show: false,
    type: "info" as "success" | "error" | "warning" | "info",
    title: "",
    description: "",
  })

  // ✅ fetch bundle + course & resource list
  useEffect(() => {
    if (!isOpen || !bundle_id) return

    const fetchData = async () => {
      setFetching(true)
      try {
        const bundleRes = await fetch("/api/bundles/fetch-one", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bundle_id }),
        })
        const bundleData = await bundleRes.json()

        const courseRes = await fetch("/api/courses/fetch-all")
        const resourceRes = await fetch("/api/resources/fetch-all")

        const courseData = await courseRes.json()
        const resourceData = await resourceRes.json()

        const b = bundleData.bundle

        setCourses(courseData.courses)
        setResources(resourceData.resources)

        setFormData({
          title: b.title,
          description: b.description,
          selectedCourses: courseData.courses.filter((c: any) => b.courses.includes(c.id)),
          selectedResources: resourceData.resources.filter((r: any) => b.resources.includes(r.id)),
          price: b.price,
          discount_price: b.discount_price,
        })

      } catch (error) {
        setAlert({
          show: true,
          type: "error",
          title: "Error",
          description: "Failed to load data"
        })
      }
      setFetching(false)
    }

    fetchData()
  }, [isOpen, bundle_id])

  // ✅ auto calculate price
  useEffect(() => {
    const total =
      formData.selectedCourses.reduce((s, c: any) => s + Number(c.price), 0) +
      formData.selectedResources.reduce((s, r: any) => s + Number(r.price), 0)

    setFormData(prev => ({ ...prev, price: total }))
  }, [formData.selectedCourses, formData.selectedResources])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/bundles/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bundle_id,
          title: formData.title,
          description: formData.description,
          courses: formData.selectedCourses.map((c: any) => c.id),
          resources: formData.selectedResources.map((r: any) => r.id),
          price: formData.price,
          discount_price: formData.discount_price,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setAlert({
        show: true,
        type: "success",
        title: "Bundle Updated",
        description: "Changes saved successfully"
      })

      setTimeout(() => onClose(), 1200)

    } catch {
      setAlert({
        show: true,
        type: "error",
        title: "Error",
        description: "Update failed"
      })
    }

    setLoading(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <form onSubmit={handleSubmit}>
          <SheetHeader>
            <SheetTitle>Edit Bundle</SheetTitle>
            <SheetDescription>Edit bundle details and save.</SheetDescription>
          </SheetHeader>

          <AppAlert
            type={alert.type}
            title={alert.title}
            description={alert.description}
            open={alert.show}
            onClose={() => setAlert({ ...alert, show: false })}
          />

          {fetching ? (
            <Loader isLoading={true} className="" />
          ) : (
            <div className="grid gap-4 mt-4 px-2">
              <div>
                <FieldLabel>Title</FieldLabel>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <FieldLabel>Description</FieldLabel>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <MultiSelect
                label="Courses"
                items={courses}
                selected={formData.selectedCourses}
                setSelected={(v) => setFormData({ ...formData, selectedCourses: v })}
              />

              <MultiSelect
                label="Resources"
                items={resources}
                selected={formData.selectedResources}
                setSelected={(v) => setFormData({ ...formData, selectedResources: v })}
              />

              <FieldLabel>Total Original Price</FieldLabel>
              <Input disabled value={formData.price} />

              <FieldLabel>Discounted Price</FieldLabel>
              <Input
                type="number"
                value={formData.discount_price}
                onChange={(e) => setFormData({ ...formData, discount_price: Number(e.target.value) })}
              />
            </div>
          )}

          <SheetFooter>
            <Button type="submit" disabled={loading || fetching}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>

            <SheetClose asChild>
              <Button variant="outline" disabled={loading}>Close</Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

export default Edit_Bundle
