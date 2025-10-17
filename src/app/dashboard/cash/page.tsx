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
    <ProtectedRoute allowedRoles={["cash"]}>
      <div className="p-6">
        <h1 className="text-2xl font-bold">💵 Cash User Dashboard</h1>
        <p>Update and confirm offline payments here.</p>
        <Button onClick={handleLogout} variant={'outline'} >Logout</Button>
      </div>
    </ProtectedRoute>
  );
}
