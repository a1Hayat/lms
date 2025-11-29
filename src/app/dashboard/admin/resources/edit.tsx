import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { AppAlert } from "@/components/alerts"

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  resource_id: number
}

const Edit_Resource: React.FC<EditModalProps> = ({ isOpen, onClose, resource_id }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    level: ""
  })

  const [isLoadingData, setIsLoadingData] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  const [alert, setAlert] = useState({
    show: false,
    type: "info" as "success" | "error" | "warning" | "info",
    title: "",
    description: "",
  })

  // Fetch current agent details when modal opens
  useEffect(() => {
    if (isOpen && resource_id) {
      const fetchAgentDetails = async () => {
        setIsLoadingData(true)
        setAlert({ show: false, type: "info", title: "", description: "" })
        try {
          const res = await fetch("/api/resources/fetch-resource", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ resource_id }),
          })
          const data = await res.json()

          if (res.ok && data.resource) {
            setFormData({
              title: data.resource.title || "",
              description: data.resource.description || "",
              price: data.resource.price || 0,
              level: data.resource.level || "",
            })
          } else {
             throw new Error(data.error || "Failed to fetch details")
          }
        } catch (error) {
          console.error(error)
          setAlert({
            show: true,
            type: "error",
            title: "Error",
            description: "Could not load agent details.",
          })
        } finally {
          setIsLoadingData(false)
        }
      }

      fetchAgentDetails()
    }
  }, [isOpen, resource_id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, level: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setAlert({ show: false, type: "info", title: "", description: "" })

    try {
      const res = await fetch("/api/resources/edit-resource", {
        method: "PUT", // Using POST for update as defined in API
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id:resource_id,
          ...formData
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Update failed")
      }

      setAlert({
        show: true,
        type: "success",
        title: "Success",
        description: "Resource updated successfully. Reloading...",
      })

      setTimeout(() => {
        window.location.reload()
      }, 1000)

    } catch (error: any) {
      setAlert({
        show: true,
        type: "error",
        title: "Error",
        description: error.message || "Failed to save changes.",
      })
      setIsSaving(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="overflow-y-auto w-full sm:max-w-lg px-4">
        <form onSubmit={handleSubmit}>
          <SheetHeader>
            <SheetTitle>Edit Agent</SheetTitle>
            <SheetDescription>
              Update the agent's basic information.
            </SheetDescription>
          </SheetHeader>

          {/* Alert Area */}
          <AppAlert
            type={alert.type}
            title={alert.title}
            description={alert.description}
            open={alert.show}
            onClose={() => setAlert({ ...alert, show: false })}
          />

          {isLoadingData ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading details...</p>
            </div>
          ) : (
            <div className="grid gap-6 py-4">
              
              {/* Agent Name */}
              <div className="grid gap-2">
                <Label htmlFor="agent_name">Resource Title</Label>
                <Input
                  id="resource_title"
                  name="resource_title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="grid gap-2">
                <Label htmlFor="Description">Description</Label>
                <Input
                  id="Description"
                  name="Description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

               <div className="grid gap-2">
                <Label htmlFor="status">Level</Label>
                <Select 
                  onValueChange={handleStatusChange} 
                  value={formData.level}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="o-level">O Level | IGCSE</SelectItem>
                    <SelectItem value="as-level">AS Level</SelectItem>
                    <SelectItem value="a-level">A Level</SelectItem>

                  </SelectContent>
                </Select>
              </div>

              {/* Price */}
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
             

            </div>
          )}

          <SheetFooter>
            <Button type="submit" disabled={isSaving || isLoadingData}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
            <SheetClose asChild>
              <Button variant="outline" type="button">Cancel</Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

export default Edit_Resource