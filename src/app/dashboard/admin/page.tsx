"use client";

import { useEffect, useState } from "react";
import Loader from "@/components/loader";
import { AppAlert } from "@/components/alerts";
import { StatCards } from "@/components/statCards";
import {
  columns,
  TodayOrder,
} from "@/components/dashboardOrders/columns";
import { TodayOrdersDataTable } from "@/components/dashboardOrders/data-table";
import { contact_submission } from "../../../../types/contact-submissions";
import { TodayContactDataTable } from "@/components/contact-subm/data-table";
import { Contactcolumns } from "@/components/contact-subm/columns";

// Define types
type Stats = {
  total_courses: number;
  total_resources: number;
  total_students: number;
  total_bundles: number;
};

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [todayOrders, setTodayOrders] = useState<TodayOrder[]>([]);
  const [todaySubmissions, setTodaySubmissions] = useState<contact_submission[]>([])
  const [alert, setAlert] = useState({
    show: false,
    type: "error" as "success" | "error" | "warning" | "info",
    title: "",
    description: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin-dashboard/home");
        const data = await res.json();

        if (!data.success) throw new Error(data.message || "Failed to fetch data");

        setStats(data.stats);
        setTodayOrders(data.todayOrders);
        setTodaySubmissions(data.todaySubmissions)

      } catch (err) {
        // Fix: Safely handle error type instead of using 'any'
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
        setAlert({
          show: true,
          type: "error",
          title: "Error",
          description: errorMessage,
        });
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader isLoading={true} className=""/>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen p-6 space-y-8">
      <AppAlert
        {...alert}
        open={alert.show}
        onClose={() => setAlert({ ...alert, show: false })}
      />

      {/* Stat Cards */}
      {stats && <StatCards stats={stats} />}

      {/* Today's Orders Table */}
      
        <h2 className="font-semibold mb-4 text-black dark:text-white">
          {/* Fix: Escaped apostrophe */}
          Today&apos;s Contact Submissions
        </h2>
        <TodayContactDataTable columns={Contactcolumns} data={todaySubmissions} />

        <h2 className="font-semibold mb-4 text-black dark:text-white">
          {/* Fix: Escaped apostrophe */}
          Today&apos;s Orders
        </h2>
        <TodayOrdersDataTable columns={columns} data={todayOrders} />
   
    </div>
  );
}