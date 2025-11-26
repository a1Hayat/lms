"use client"

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { DataTable } from "./dataTable"
import { createColumns, Workshop } from "./columns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import Loader from "@/components/loader"
import {AppAlert} from "@/components/alerts"

export default function AdminWorkshopsPage() {
  const [data, setData] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)
  
  // Loader for submit actions  
  const [submitting, setSubmitting] = useState(false)

  // Alerts
  const [alert, setAlert] = useState({
    show: false,
    type: "info" as "success" | "error" | "warning" | "info",
    title: "",
    description: "",
  })

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  
  // Form data
  const [formData, setFormData] = useState({
    session_name: "",
    type: "online",
    workshop_date: "",
    location: "",
    status: "opened",
  })

  // Fetch Workshops
  const fetchWorkshops = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/workshops/list_create")
      const json = await res.json()
      if (Array.isArray(json)) {
        setData(json)
      }
    } catch (err) {
      console.error("Failed to fetch", err)
      setAlert({
        show: true,
        type: "error",
        title: "Fetch Error",
        description: "Failed to load workshops.",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWorkshops()
  }, [])

  // Delete Workshop
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure? This cannot be undone.")) return
    
    try {
      setSubmitting(true)
      const res = await fetch(`/api/workshops/single_item/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setAlert({
          show: true,
          type: "success",
          title: "Deleted",
          description: "Workshop deleted successfully.",
        })
        fetchWorkshops()
      } else {
        throw new Error()
      }

    } catch (err) {
      setAlert({
        show: true,
        type: "error",
        title: "Delete Failed",
        description: "Could not delete workshop.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Edit Workshop
  const handleEdit = (workshop: Workshop) => {
    setEditingId(workshop.id)

    // Format date for datetime-local input
    const dateObj = new Date(workshop.workshop_date)
    const tzOffset = dateObj.getTimezoneOffset() * 60000
    const localISOTime = new Date(dateObj.getTime() - tzOffset)
      .toISOString()
      .slice(0, 16)

    setFormData({
      session_name: workshop.session_name,
      type: workshop.type,
      workshop_date: localISOTime,
      location: workshop.location,
      status: workshop.status,
    })
    setIsModalOpen(true)
  }

  // Create button clicked
  const handleCreateOpen = () => {
    setEditingId(null)
    setFormData({
      session_name: "",
      type: "online",
      workshop_date: "",
      location: "",
      status: "opened",
    })
    setIsModalOpen(true)
  }

  // Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const url = editingId
      ? `/api/workshops/single_item/${editingId}`
      : "/api/workshops/list_create"

    const method = editingId ? "PUT" : "POST"

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error()

      setIsModalOpen(false)
      fetchWorkshops()

      setAlert({
        show: true,
        type: "success",
        title: editingId ? "Workshop Updated" : "Workshop Created",
        description: editingId
          ? "Changes saved successfully."
          : "New workshop created successfully.",
      })

    } catch (err) {
      setAlert({
        show: true,
        type: "error",
        title: "Operation Failed",
        description: "Something went wrong while saving.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const columns = createColumns(handleEdit, handleDelete)

  return (
    <div className="p-8 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ALERT */}
        <AppAlert
          type={alert.type}
          title={alert.title}
          description={alert.description}
          open={alert.show}
          onClose={() => setAlert({ ...alert, show: false })}
        />

        {/* LOADER */}
        <Loader isLoading={loading || submitting} className="" />

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Workshops
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Manage your physical and online learning sessions.
            </p>
          </div>

          <Button onClick={handleCreateOpen} variant="outline">
            <Plus className="h-4 w-4 mr-2" /> Add Workshop
          </Button>
        </div>

        {/* Table */}
        {!loading && <DataTable columns={columns} data={data} />}

        {/* Dialog Form */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Workshop" : "Create New Workshop"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="grid gap-4 py-4">

              <div className="grid gap-2">
                <Label>Session Name</Label>
                <Input
                  value={formData.session_name}
                  onChange={(e) =>
                    setFormData({ ...formData, session_name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(val) =>
                      setFormData({ ...formData, type: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="physical">Physical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(val) =>
                      setFormData({ ...formData, status: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="opened">Opened</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Date & Time</Label>
                <Input
                  type="datetime-local"
                  value={formData.workshop_date}
                  onChange={(e) =>
                    setFormData({ ...formData, workshop_date: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>
                  {formData.type === "online" ? "Meeting URL" : "Physical Address"}
                </Label>
                <Input
                  placeholder={
                    formData.type === "online"
                      ? "https://..."
                      : "Room 101, Building..."
                  }
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  required
                />
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingId ? "Save Changes" : "Create Workshop"}
                </Button>
              </div>

            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
