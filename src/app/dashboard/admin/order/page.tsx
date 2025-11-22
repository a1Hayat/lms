"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Loader from "../../../../components/loader"
import { AppAlert } from "../../../../components/alerts"
import { columns, Order } from "./columns"
import { DataTable } from "./data-table"

export default function AllOrdersPage() {
  const { data: session, status } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const [alert, setAlert] = useState({
    show: false,
    type: "error" as "success" | "error" | "warning" | "info",
    title: "",
    description: "",
  })

  useEffect(() => {
    if (status !== "authenticated") return

    const fetchOrders = async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/admin-dashboard/orders", {
          method: "POST", // Using POST as per API route
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: session?.user?.id }),
        })
        const data = await res.json()

        if (data.success) {
          setOrders(data.orders)
        } else {
          setAlert({ show: true, type: "error", title: "Error", description: data.message })
        }
      } catch (err) {
        setAlert({ show: true, type: "error", title: "Server Error", description: "Could not fetch orders." })
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [status, session])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader isLoading={true} className=""/>
      </div>
    )
  }

  return (
    <>
      <AppAlert
        {...alert}
        open={alert.show}
        onClose={() => setAlert({ ...alert, show: false })}
      />
      {/* This layout fills the screen and provides padding */}
      <div className="flex h-screen flex-col p-6 gap-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          All Orders Record
        </h1>
        {/* This container grows to fill remaining space and allows the table to scroll internally */}
        <div className="w-full">
          <DataTable columns={columns} data={orders} />
        </div>
      </div>
    </>
  )
}