'use client';

import { useState } from "react";
import Image from "next/image";
import logo from "@/components/icons/logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CustomPhoneInput from "@/components/phoneInput";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { AppAlert } from "@/components/alerts";

export default function RegisterForm() {
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

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle phone change separately
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
          role: "student",
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
    <div className="flex flex-col-reverse md:flex-row w-full min-h-screen">
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
      {/* Left Column - Form */}
      <div className="md:w-3/5 w-full flex justify-center items-center p-4">
        <form onSubmit={handleSubmit} className="w-full max-w-4xl p-10">
          <FieldGroup>
            {/* Header */}
            <div className="flex flex-col items-center gap-3 text-center mb-8">
              <h1 className="text-3xl font-bold">Sign up, it’s free!</h1>
              <FieldDescription>
                Already have an account?{" "}
                <a href="/login" className="text-blue-500 hover:underline">
                  Sign in
                </a>
              </FieldDescription>
            </div>

            {/* Alerts */}
             <AppAlert
              type={alert.type}
              title={alert.title}
              description={alert.description}
              open={alert.show}
              onClose={() => setAlert({ ...alert, show: false })}
            />

            {/* Two-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-6">
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

              <div>
                <FieldLabel>Institution</FieldLabel>
                <Input
                  name="institution"
                  placeholder="Your Institution"
                  required
                  value={formData.institution}
                  onChange={handleChange}
                />
              </div>

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

            {/* Submit Button */}
            <div className="mt-8 text-center">
              <Button
                type="submit"
                className="w-full md:w-auto"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Sign Up"}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </div>

      {/* Right Column - Logo + Welcome */}
      <div className="md:w-2/5 w-full flex flex-col justify-center items-center p-8 text-center">
        <Image
          src={logo}
          alt="logo"
          width={340}
          height={340}
          className="mb-6 mx-auto drop-shadow-lg w-40 h-40 md:w-[340px] md:h-[340px]"
        />
      </div>
    </div>
  );
}
