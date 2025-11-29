import { ChangeEvent, useEffect, useState } from "react"
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
import { Loader2 } from "lucide-react"
import { AppAlert } from "@/components/alerts"
import Image from "next/image"

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  resource_id: number
}

interface ResourceFormData {
  title: string
  description: string
  price: string | number
  level: string
  thumbnail: string | File | null
  file_path: string | File | null
}

const Edit_Resource: React.FC<EditModalProps> = ({ isOpen, onClose, resource_id }) => {
  const [formData, setFormData] = useState<ResourceFormData>({
    title: "",
    description: "",
    price: 0,
    level: "",
    thumbnail: null,
    file_path: null
  })

  // Preview URLs for newly selected files or existing URL
  const [thumbPreview, setThumbPreview] = useState<string | null>(null)

  const [isLoadingData, setIsLoadingData] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  const [alert, setAlert] = useState({
    show: false,
    type: "info" as "success" | "error" | "warning" | "info",
    title: "",
    description: "",
  })

  // Fetch current details
  useEffect(() => {
    if (isOpen && resource_id) {
      const fetchResourceDetails = async () => {
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
              thumbnail: data.resource.thumbnail || null, // URL string
              file_path: data.resource.file_path || null, // URL string
            })
            // Set initial preview if it's a string URL
            if (typeof data.resource.thumbnail === 'string') {
                setThumbPreview(data.resource.thumbnail);
            }
          } else {
             throw new Error(data.error || "Failed to fetch details")
          }
        } catch (error) {
          console.error(error)
          setAlert({
            show: true,
            type: "error",
            title: "Error",
            description: "Could not load resource details.",
          })
        } finally {
          setIsLoadingData(false)
        }
      }

      fetchResourceDetails()
    }
  }, [isOpen, resource_id])

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (thumbPreview && !thumbPreview.startsWith('/') && !thumbPreview.startsWith('http')) {
        URL.revokeObjectURL(thumbPreview)
      }
    }
  }, [thumbPreview])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, level: value }))
  }

  const onThumbChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
        setFormData(prev => ({ ...prev, thumbnail: file }))
        setThumbPreview(URL.createObjectURL(file))
    }
  }

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file && file.type !== "application/pdf") {
      setAlert({
          show: true,
          type: "error",
          title: "Invalid File",
          description: "Only PDF files are allowed.",
      })
      return
    }
    setFormData(prev => ({ ...prev, file_path: file }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setAlert({ show: false, type: "info", title: "", description: "" })

    try {
      // Use FormData to handle files + text
      const data = new FormData();
      data.append("id", resource_id.toString());
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("price", formData.price.toString());
      data.append("level", formData.level);

      // Only append files if they are actually File objects (newly uploaded)
      if (formData.thumbnail instanceof File) {
        data.append("thumbnail", formData.thumbnail);
      }
      
      if (formData.file_path instanceof File) {
        data.append("file_path", formData.file_path);
      }

      const res = await fetch("/api/resources/edit-resource", {
        method: "PUT",
          ...formData,
        body: data, 
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || "Update failed")
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
            <SheetTitle>Edit Resource</SheetTitle>
            <SheetDescription>
              Update the resource information.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-4">
            <AppAlert
                type={alert.type}
                title={alert.title}
                description={alert.description}
                open={alert.show}
                onClose={() => setAlert({ ...alert, show: false })}
            />
          </div>

          {isLoadingData ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading details...</p>
            </div>
          ) : (
            <div className="grid gap-6 py-4">
              
              {/* Thumbnail Preview */}
              <div className="grid gap-2">
                <Label>Thumbnail Preview</Label>
                <div className="border rounded-md p-2 bg-slate-50 dark:bg-slate-900 flex justify-center">
                    {thumbPreview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={thumbPreview}
                            alt="thumbnail"
                            className="rounded-md object-cover h-32 w-auto"
                        />
                    ) : (
                        <div className="h-24 w-full flex items-center justify-center text-muted-foreground text-xs">
                            No thumbnail
                        </div>
                    )}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="title">Resource Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="thumbnail-upload">Change Thumbnail</Label>
                <div className="flex items-center gap-2">
                     <Input 
                        id="thumbnail-upload" 
                        type="file" 
                        accept="image/*" 
                        onChange={onThumbChange} 
                        className="cursor-pointer"
                    />
                </div>
              </div>

              <div className="grid gap-2">
                 <Label htmlFor="file-upload">Resource File (PDF)</Label>
                 <Input 
                    id="file-upload" 
                    type="file" 
                    accept="application/pdf" 
                    onChange={onFileChange} 
                    className="cursor-pointer"
                 />
                 {/* Show current file status */}
                 {formData.file_path && typeof formData.file_path === 'string' && (
                     <p className="text-xs text-muted-foreground">
                        Current file: <span className="font-medium truncate">{formData.file_path.split('/').pop()}</span>
                     </p>
                 )}
                 {formData.file_path && formData.file_path instanceof File && (
                     <p className="text-xs text-green-600 font-medium">
                        Selected: {formData.file_path.name}
                     </p>
                 )}
              </div>

               <div className="grid gap-2">
                <Label htmlFor="level">Level</Label>
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

              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>
          )}

          <SheetFooter className="mt-4">
            <SheetClose asChild>
              <Button variant="outline" type="button" disabled={isSaving}>Cancel</Button>
            </SheetClose>
            <Button type="submit" disabled={isSaving || isLoadingData}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

export default Edit_Resource