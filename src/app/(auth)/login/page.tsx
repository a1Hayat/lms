"use client";

import Loader from "@/components/loader";
import { LoginForm } from "@/components/login-form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect authenticated users
  useEffect(() => {
    if (status === "authenticated") {
      const role = session?.user?.role || "student";
      if (role === "admin") router.replace("/dashboard/admin");
      else if (role === "cash") router.replace("/dashboard/cash");
      else router.replace("/dashboard");
    }
  }, [status, session, router]);

  // Always show loader while checking auth or redirecting
  if (status === "loading" || status === "authenticated") {
    return <Loader isLoading={true} className="h-screen" />;
  }

  // Only render login form when unauthenticated
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
