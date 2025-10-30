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
  SheetTitle,
} from "@/components/ui/sheet"
import { FieldLabel } from "@/components/ui/field"
import CustomPhoneInput from "@/components/phoneInput"
import { AppAlert } from "@/components/alerts"
import Loader from "@/components/loader"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  user_role: string
  user_id: number
}

const Edit_cash_user: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  user_role,
  user_id,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    institution: "",
    password: "",
    confirmPassword: "",
  })

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [alert, setAlert] = useState({
    show: false,
    type: "info" as "success" | "error" | "warning" | "info",
    title: "",
    description: "",
  })

  // ✅ Fetch existing student data
  useEffect(() => {
    const fetchUser = async () => {
      if (!isOpen || !user_id) return
      setFetching(true)
      try {
        const res = await fetch("/api/users/fetch-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id }),
        })

        const data = await res.json()

        if (!res.ok) {
          setAlert({
            show: true,
            type: "error",
            title: "Error fetching data",
            description: data.error || "Unable to load user details.",
          })
          return
        }

        if (Array.isArray(data.user_info) && data.user_info.length > 0) {
          const user = data.user_info[0]
          setFormData({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            institution: user.institution || "",
            password: "",
            confirmPassword: "",
          })
        } else {
          setAlert({
            show: true,
            type: "warning",
            title: "User Not Found",
            description: "No user found for the provided ID.",
          })
        }
      } catch (err) {
        console.error(err)
        setAlert({
          show: true,
          type: "error",
          title: "Server Error!",
          description: "Unable to fetch user data.",
        })
      } finally {
        setFetching(false)
      }
    }

    fetchUser()
  }, [isOpen, user_id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhoneChange = (value?: string) => {
    setFormData((prev) => ({ ...prev, phone: value || "" }))
  }

  // ✅ Submit updated data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Password validation (only if user entered one)
    if (formData.password && formData.password !== formData.confirmPassword) {
      setAlert({
        show: true,
        type: "warning",
        title: "Password Mismatch",
        description: "Password and confirm password must match.",
      })
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/users/edit-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id,
          name: formData.name,
          email: formData.email,
          password: formData.password || undefined, // only send if provided
          phone: formData.phone,
          role: user_role,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setAlert({
          show: true,
          type: "error",
          title: "Update Failed",
          description: data.error || "Could not update user details.",
        })
        return
      }

      // ✅ Success message
      setAlert({
        show: true,
        type: "success",
        title: "Updated!",
        description: "Student information updated successfully.",
      })

      // Optionally close modal after short delay
      setTimeout(() => onClose(), 1500)
    } catch (err) {
      console.error(err)
      setAlert({
        show: true,
        type: "error",
        title: "Server Error!",
        description: "Unable to connect to the server.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <form onSubmit={handleSubmit}>
          <SheetHeader>
            <SheetTitle>Edit Admin</SheetTitle>
            <SheetDescription>
              Update admin details and click save when done.
            </SheetDescription>
          </SheetHeader>

          <AppAlert
            type={alert.type}
            title={alert.title}
            description={alert.description}
            open={alert.show}
            onClose={() => setAlert({ ...alert, show: false })}
          />

          <div className="grid flex-1 auto-rows-min gap-6 px-4 mt-4">
            {fetching ? (
              <p className="text-center text-sm text-muted-foreground">
                <Loader isLoading={fetching} className="" />
              </p>
            ) : (
              <>
                <div>
                  <FieldLabel>Full Name</FieldLabel>
                  <Input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <FieldLabel>Email Address</FieldLabel>
                  <Input
                    type="email"
                    name="email"
                    placeholder="m@example.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <FieldLabel>Phone Number</FieldLabel>
                  <CustomPhoneInput
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className="mb-[-10px]"
                  />
                </div>

                {/* Optional password fields for updating */}
                <div>
                  <FieldLabel htmlFor="password">New Password (optional)</FieldLabel>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
          </div>

          <SheetFooter>
            <Button type="submit" className="mt-3" disabled={loading || fetching}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
            <SheetClose asChild>
              <Button variant="outline" disabled={loading}>
                Close
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

export default Edit_cash_user
