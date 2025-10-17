"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "@/components/loader";

type Props = {
  children: React.ReactNode;
  allowedRoles?: string[];
};

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    // If user not logged in
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }

    // Get user role
    const role = session?.user?.role || "student";

    // Redirect to correct dashboard if role not allowed
    if (allowedRoles && !allowedRoles.includes(role)) {
      if (role === "admin") router.replace("/dashboard/admin");
      else if (role === "cash") router.replace("/dashboard/cash");
      else router.replace("/dashboard");
      return;
    }

    setLoading(false);
  }, [status, session, allowedRoles, router, pathname]);

  if (loading || status === "loading") {
    return <Loader isLoading={true} className="h-screen" />;
  }

  return <>{children}</>;
}
