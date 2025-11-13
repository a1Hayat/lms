"use client";

import { useEffect, useState } from "react";
import Loader from "@/components/loader";
import { AppAlert } from "@/components/alerts";
import { StatCards } from "@/components/statCards";
import { OrdersChart } from "@/components/ordersChart";
import {
  columns,
  TodayOrder,
} from "@/components/dashboardOrders/columns";
import { TodayOrdersDataTable } from "@/components/dashboardOrders/data-table";

// Define types
type Stats = {
  total_courses: number;
  total_resources: number;
  total_students: number;
  total_bundles: number;
};
type ChartData = {
  name: string;
  count: number;
};

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [todayOrders, setTodayOrders] = useState<TodayOrder[]>([]);
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
        setChartData(data.chartData);
        setTodayOrders(data.todayOrders);
      } catch (err: any) {
        setAlert({
          show: true,
          type: "error",
          title: "Error",
          description: err.message,
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

      {/* Orders Chart */}
      {/* <OrdersChart data={chartData} /> */}

      {/* Today's Orders Table */}
      
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Today's Orders
        </h2>
        <TodayOrdersDataTable columns={columns} data={todayOrders} />
   
    </div>
  );
}