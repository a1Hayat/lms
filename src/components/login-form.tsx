"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AppAlert } from "@/components/alerts";
import Image from "next/image";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";

import google from "@/components/icons/google.png";
import logo from "@/components/icons/logo.png";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // 🔔 Alert state
  const [alert, setAlert] = useState({
    show: false,
    type: "info" as "success" | "error" | "warning" | "info",
    title: "",
    description: "",
  });

  // 🔑 Handle Credentials Login
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setAlert({ ...alert, show: false });

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (res?.error) {
      setAlert({
        show: true,
        type: "error",
        title: "Login Failed",
        description: res.error || "Invalid email or password.",
      });
      return;
    }

    if (res?.ok) {
      setAlert({
        show: true,
        type: "success",
        title: "Welcome Back!",
        description: "Redirecting you to your dashboard...",
      });

      const session = await fetch("/api/auth/session").then((r) => r.json());
      const role = session?.user?.role || "student";

      setTimeout(() => {
        if (role === "admin") router.push("/dashboard/admin");
        else if (role === "cash") router.push("/dashboard/cash");
        else router.push("/dashboard");
      }, 1200);

    }
  }

  // 🔹 Handle Google Login
  async function handleGoogleLogin() {
    try {
      setGoogleLoading(true);
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch {
      setAlert({
        show: true,
        type: "error",
        title: "Google Sign-In Failed",
        description: "Unable to sign in with Google right now. Try again later.",
      });
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {/* 🔔 Floating Alert */}
      <div
        className={cn(
          "fixed top-4 right-4 z-50 w-[300px] transition-all duration-300 ease-in-out",
          alert.show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        )}
      >
        <AppAlert
          type={alert.type}
          title={alert.title}
          description={alert.description}
          open={alert.show}
          onClose={() => setAlert({ ...alert, show: false })}
        />
      </div>

      {/* 🔐 Login Form */}
      
        <form onSubmit={handleSubmit}>
          <FieldGroup className="space-y-6">
            {/* --- Header Section --- */}
            <div className="flex flex-col items-center gap-4 text-center">
              <Image
                src={logo}
                alt="CS With Bari Logo"
                width={80}
                height={80}
                className="drop-shadow-md object-contain"
                priority
              />
              <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">
                  Welcome to CS With Bari
                </h1>
                <FieldDescription className="text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <a
                    href="/register"
                    className="font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors"
                  >
                    Sign up
                  </a>
                </FieldDescription>
              </div>
            </div>

            {/* --- Input Fields --- */}
            <div className="space-y-4">
              <Field>
                <FieldLabel htmlFor="email" className="font-medium">
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="student@example.com"
                />
              </Field>

              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password" className="font-medium">
                    Password
                  </FieldLabel>
                  
                </div>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  required 
                />
              </Field>
            </div>

            {/* --- Actions --- */}
            <div className="space-y-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full font-bold shadow-sm"
                size="lg"
              >
                {loading ? "Logging in..." : "Login"}
              </Button>

              {/* <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div> */}

              {/* <Button
                variant="outline"
                type="button"
                disabled={googleLoading}
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-2 shadow-sm"
                size="lg"
              >
                {googleLoading ? (
                  "Connecting..."
                ) : (
                  <>
                    <Image src={google} alt="Google" width={18} height={18} />
                    Google
                  </>
                )}
              </Button> */}
            </div>
          </FieldGroup>
        </form>


      <FieldDescription className="px-6 text-center text-sm">
        By clicking continue, you agree to our{" "}
        <a href="#" className="text-blue-400 hover:underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="text-blue-400 hover:underline">
          Privacy Policy
        </a>
        .
      </FieldDescription>
    </div>
  );
}
