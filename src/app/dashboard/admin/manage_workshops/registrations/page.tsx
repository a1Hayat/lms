"use client"

import { useState, useEffect } from "react"
import { 
  Calendar, 
  Search, 
  Mail, 
  Phone, 
  School,
  Download,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Workshop {
  id: number;
  session_name: string;
  workshop_date: string;
}

interface RegistrationEntry {
  id: number;
  name: string;
  email: string;
  phone: string;
  institution: string;
  registered_at: string;
}

export default function WorkshopRegistrationsPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string>("")
  const [registrations, setRegistrations] = useState<RegistrationEntry[]>([])
  const [loadingWorkshops, setLoadingWorkshops] = useState(true)
  const [loadingEntries, setLoadingEntries] = useState(false)

  useEffect(() => {
    async function loadWorkshops() {
      try {
        const res = await fetch('/api/workshops/list_create')
        if (res.ok) setWorkshops(await res.json())
      } finally {
        setLoadingWorkshops(false)
      }
    }
    loadWorkshops()
  }, [])

  useEffect(() => {
    if (!selectedWorkshopId) return;

    async function loadRegistrations() {
      setLoadingEntries(true)
      try {
        const res = await fetch(`/api/workshops/admin-fetch-submissions/${selectedWorkshopId}`)
        setRegistrations(res.ok ? await res.json() : [])
      } finally {
        setLoadingEntries(false)
      }
    }
    loadRegistrations()
  }, [selectedWorkshopId])

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    })

  const selectedWorkshop = workshops.find(w => w.id.toString() === selectedWorkshopId)

  const handleExportCSV = () => {
    if (!registrations.length) return;

    const headers = ["ID", "Name", "Email", "Phone", "Institution", "Registered At"]
    const esc = (s: string) => `"${(s || "").replace(/"/g, '""')}"`
    const rows = registrations.map(r =>
      [r.id, esc(r.name), esc(r.email), esc(r.phone), esc(r.institution), esc(formatDate(r.registered_at))].join(",")
    )

    const blob = new Blob([[headers.join(","), ...rows].join("\n")], {
      type: "text/csv;charset=utf-8;"
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${selectedWorkshop?.session_name.replace(/\s+/g, "_")}_registrations.csv`
    link.click()
  }

  return (
    <div className="p-8 min-h-screen space-y-10 ">

      {/* Header */}
      <div className="w-full mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-[#1f1f1f] dark:text-white">
            Workshop Registrations
          </h1>
          <p className="mt-2 text-sm text-[#444] dark:text-[#b3b3b3]">
            Select a workshop to view all participant registration details.
          </p>
        </div>

        <div className="w-full md:w-[320px]">
          <Select onValueChange={setSelectedWorkshopId} value={selectedWorkshopId}>
            <SelectTrigger className="w-full bg-white dark:bg-[#1f1f1f] border border-[#e5e5e5] dark:border-[#262626]">
              <SelectValue placeholder="Choose Workshop..." />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-[#1f1f1f] border border-[#e5e5e5] dark:border-[#262626]">
              {loadingWorkshops ? (
                <div className="p-2 text-sm text-center text-[#1f1f1f] dark:text-white">Loading...</div>
              ) : workshops.length === 0 ? (
                 <div className="p-2 text-sm text-center text-[#1f1f1f] dark:text-white">No workshops found</div>
              ) : (
                workshops.map((ws) => (
                  <SelectItem 
                    key={ws.id} 
                    value={ws.id.toString()}
                    className="hover:bg-[#f2f2f2] dark:hover:bg-[#262626]"
                  >
                    {ws.session_name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">

        {!selectedWorkshopId ? (
          <div className="border-2 border-dashed border-[#e5e5e5] dark:border-[#262626] rounded-xl text-center bg-white dark:bg-[#1f1f1f] py-12">
            <Search className="mx-auto h-14 w-14 text-[#d1d1d1]" />
            <h3 className="mt-4 text-lg font-semibold text-[#1f1f1f] dark:text-white">No Workshop Selected</h3>
            <p className="mt-1 text-[#555] dark:text-[#b3b3b3] text-sm">
              Select a workshop from the dropdown to view registration entries.
            </p>
          </div>
        ) : (
          <>
            {/* Summary Card */}
            <Card className="shadow-sm bg-white dark:bg-[#1f1f1f] border border-[#e5e5e5] dark:border-[#262626]">
              <CardHeader className="bg-[#f2f2f2] dark:bg-[#262626] border-b border-[#e5e5e5] dark:border-[#333] pb-5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <CardTitle className="text-2xl text-[#1f1f1f] dark:text-white">
                      {selectedWorkshop?.session_name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2 text-[#444] dark:text-[#ccc]">
                      <Calendar className="h-4 w-4" />
                      {selectedWorkshop && formatDate(selectedWorkshop.workshop_date)}
                    </CardDescription>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <Button 
                      variant="outline" 
                      onClick={handleExportCSV}
                      disabled={registrations.length === 0}
                      className="bg-white dark:bg-[#1f1f1f] border border-[#d4d4d4] dark:border-[#333]"
                    >
                      <Download className="mr-2 h-4 w-4" /> Export CSV
                    </Button>

                    <div className="text-right">
                      <div className="text-4xl font-bold text-[#1f1f1f] dark:text-white">
                        {registrations.length}
                      </div>
                      <div className="text-xs text-[#555] dark:text-[#aaa] uppercase tracking-wide">
                        Total Registrations
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Registrations Table */}
            <Card className="shadow-sm bg-white dark:bg-[#1f1f1f] border border-[#e5e5e5] dark:border-[#262626]">
              <CardContent className="p-0">

                {loadingEntries ? (
                  <div className="p-12 text-center text-[#555] dark:text-[#b3b3b3] text-sm">
                    Loading registrations...
                  </div>
                ) : registrations.length === 0 ? (
                  <div className="p-12 text-center text-[#555] dark:text-[#b3b3b3] text-sm">
                    No registrations found for this workshop.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-[#f2f2f2] dark:bg-[#262626] text-[#1f1f1f] dark:text-[#d1d1d1] uppercase text-xs border-b border-[#e5e5e5] dark:border-[#333]">
                        <tr>
                          <th className="px-6 py-3 font-semibold">Student</th>
                          <th className="px-6 py-3 font-semibold">Contact</th>
                          <th className="px-6 py-3 font-semibold">Institution</th>
                          <th className="px-6 py-3 font-semibold">Registered At</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-[#e5e5e5] dark:divide-[#333]">
                        {registrations.map(entry => (
                          <tr 
                            key={entry.id} 
                            className="bg-white dark:bg-[#1f1f1f] hover:bg-[#f7f7f7] dark:hover:bg-[#2a2a2a] transition"
                          >
                            <td className="px-6 py-4">
                              <div className="font-medium text-[#1f1f1f] dark:text-white">{entry.name}</div>
                              <div className="text-xs text-[#777] dark:text-[#aaa]">ID: #{entry.id}</div>
                            </td>

                            <td className="px-6 py-4 text-[#1f1f1f] dark:text-[#d1d1d1]">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                  <Mail className="h-3 w-3" /> {entry.email}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="h-3 w-3" /> {entry.phone || "N/A"}
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4 text-[#1f1f1f] dark:text-[#d1d1d1]">
                              <div className="flex items-center gap-2">
                                <School className="h-4 w-4 text-[#777]" />
                                {entry.institution || (
                                  <span className="text-[#999] italic">Not Provided</span>
                                )}
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <Badge 
                                variant="outline" 
                                className="bg-[#f2f2f2] dark:bg-[#262626] border border-[#d4d4d4] dark:border-[#333] text-[#1f1f1f] dark:text-[#eaeaea] font-normal"
                              >
                                {formatDate(entry.registered_at)}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
