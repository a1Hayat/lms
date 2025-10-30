import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { FieldLabel } from "@/components/ui/field"
import CustomPhoneInput from "@/components/phoneInput"
import { AppAlert } from "@/components/alerts"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  user_role: string
}

const Add_cash_user: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  user_role
}) => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    institution: "",
    password: "",
    confirmPassword: "",
  });

  const [showError, setShowError] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const [loading, setLoading] = useState(false);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const handlePhoneChange = (value?: string) => {
    setFormData(prev => ({ ...prev, phone: value || "" }));
  };




  // Handle form submission
    const [alert, setAlert] = useState({
    show: false,
    type: "info" as "success" | "error" | "warning" | "info",
    title: "",
    description: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword){
      return setAlert({
          show: true,
          type: "warning",
          title: "Warning",
          description:"Password doesn't match"
        })
        return
    } 

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          institution: formData.institution,
          role: user_role,
        }),
      })

      const data = await res.json()

      // Handle different statuses
      if (res.status === 400) {
        setAlert({
          show: true,
          type: "error",
          title: "Missing Fields!",
          description: data.error || "Please fill out all required fields.",
        })
        return
      }

      if (res.status === 401) {
        setAlert({
          show: true,
          type: "warning",
          title: "Warning",
          description:
            data.error,
        })
        return
      }

      if (!res.ok) {
        setAlert({
          show: true,
          type: "error",
          title: "Error!",
          description: data.error || "Something went wrong. Please try again later.",
        })
        return
      }

      // ✅ Success
      setAlert({
        show: true,
        type: "success",
        title: "Success!",
        description: data.message || "User registered successfully.",
      })
      window.location.href=('/login')
    } catch (err) {
      console.error(err)
      setAlert({
        show: true,
        type: "error",
        title: "Server Error!",
        description: "Unable to connect to the server. Please try again later.",
      })
    }
  }
  
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent >
        <form onSubmit={handleSubmit}>
        <SheetHeader>
          <SheetTitle>Add Cash User</SheetTitle>
          <SheetDescription>
            Create cash user here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
         <AppAlert
            type="success"
            title="Success!"
            description="Account created. Redirecting..."
            open={showSuccess}
            onClose={() => setShowSuccess(false)}/>
        <AppAlert
            type="error"
            title="Error!"
            description="Failed to create account."
            open={showError}
            onClose={() => setShowError(false)}/>
        <AppAlert
              type={alert.type}
              title={alert.title}
              description={alert.description}
              open={alert.show}
              onClose={() => setAlert({ ...alert, show: false })}
            />
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
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
                  className=""
                />
              </div>

             
          <div className="grid gap-3">

              <div>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
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
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
          </div>
        </div>
        <SheetFooter>
          <Button type="submit" className="mt-3">{loading ? 'Please wait...':'Save Changes'}</Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}


export default Add_cash_user