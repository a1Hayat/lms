
"use client";

import ProtectedRoute from "@/components/auth/protectedRoute";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useState } from "react";

export default function CashDashboard() {

    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
    setLoading(true);
    await signOut({ callbackUrl: "/login" });
    };
    if (loading) return <Loader isLoading={true} className="h-screen" />;

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <div className="p-6">
        <h1 className="text-2xl font-bold">🎓 Student Dashboard</h1>
        <Button onClick={handleLogout} variant={'outline'} >Logout</Button>
      </div>
    </ProtectedRoute>
  );
}
