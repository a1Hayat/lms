"use client"

import { useState, useEffect } from "react"
import { 
  Users, 
  Calendar, 
  Search, 
  Mail, 
  Phone, 
  School,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// --- Types ---
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
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string>("");
  const [registrations, setRegistrations] = useState<RegistrationEntry[]>([]);
  const [loadingWorkshops, setLoadingWorkshops] = useState(true);
  const [loadingEntries, setLoadingEntries] = useState(false);

  useEffect(() => {
    async function loadWorkshops() {
      try {
        const res = await fetch('/api/workshops/list_create');
        const data = await res.json();
        setWorkshops(data);
      } catch (error) {
        console.error("Failed to load workshops", error);
      } finally {
        setLoadingWorkshops(false);
      }
    }
    loadWorkshops();
  }, []);

  useEffect(() => {
    if (!selectedWorkshopId) return;

    async function loadRegistrations() {
      setLoadingEntries(true);
      try {
        const res = await fetch(`/api/workshops/registrations/${selectedWorkshopId}`);
        const data = await res.json();
        setRegistrations(data);
      } catch (error) {
        console.error("Failed to load entries", error);
      } finally {
        setLoadingEntries(false);
      }
    }
    loadRegistrations();
  }, [selectedWorkshopId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const selectedWorkshop = workshops.find(w => w.id.toString() === selectedWorkshopId);

  return (
    <div className="p-8 min-h-screen space-y-10">

      {/* Header */}
      <div className="w-full mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
            Workshop Registrations
          </h1>
          <p className="mt-2  text-sm">
            Select a workshop to view all participant registration details.
          </p>
        </div>

        <div className="max-3xl md:w-[320px]">
          <Select onValueChange={setSelectedWorkshopId} value={selectedWorkshopId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose Workshop..." />
            </SelectTrigger>
            <SelectContent>
              {loadingWorkshops ? (
                <div className="p-2 text-sm">Loading...</div>
              ) : (
                workshops.map((ws) => (
                  <SelectItem key={ws.id} value={ws.id.toString()}>
                    {ws.session_name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">

        {/* Empty State */}
        {!selectedWorkshopId ? (
          <div className="border-2 border-dashed border-gray-200 dark:border-[#1f1f1f] rounded-xl text-center bg-white dark:bg-[#0f0f0f]">
            <Search className="mx-auto h-14 w-14 mt-4 text-gray-300" />
            <h3 className="mt-4 text-lg font-semibold ">No Workshop Selected</h3>
            <p className="mt-1 text-gray-500 text-sm mb-4">
              Select a workshop from the dropdown to view registration entries.
            </p>
          </div>
        ) : (
          <>

            {/* Summary */}
            <Card className="shadow-sm">
              <CardHeader className="bg-slate-50 border-b pb-5">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl">
                      {selectedWorkshop?.session_name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <Calendar className="h-4 w-4" />
                      {selectedWorkshop ? formatDate(selectedWorkshop.workshop_date) : ""}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold">
                      {registrations.length}
                    </div>
                    <div className="text-xs  uppercase tracking-wide">
                      Total Registrations
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Table */}
            <Card className="shadow-sm overflow-hidden">
              <CardContent className="p-0">
                {loadingEntries ? (
                  <div className="p-12 text-center text-slate-500 text-sm">
                    Loading registrations...
                  </div>
                ) : registrations.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 text-sm">
                    No registrations found for this workshop.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-gray-100 text-gray-700 uppercase text-xs border-b">
                        <tr>
                          <th className="px-6 py-3 font-semibold">Student</th>
                          <th className="px-6 py-3 font-semibold">Contact</th>
                          <th className="px-6 py-3 font-semibold">Institution</th>
                          <th className="px-6 py-3 font-semibold">Registered At</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-100">
                        {registrations.map((entry) => (
                          <tr key={entry.id} className="bg-white hover:bg-gray-50 transition">
                            <td className="px-6 py-4">
                              <div className="font-medium text-slate-900">{entry.name}</div>
                              <div className="text-xs text-slate-400">ID: #{entry.id}</div>
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex flex-col gap-1 text-slate-700">
                                <div className="flex items-center gap-2">
                                  <Mail className="h-3 w-3" /> {entry.email}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="h-3 w-3" /> {entry.phone || "N/A"}
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2 text-slate-700">
                                <School className="h-4 w-4 text-slate-400" />
                                {entry.institution || (
                                  <span className="text-gray-400 italic">Not Provided</span>
                                )}
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <Badge variant="outline" className="bg-slate-50 font-normal">
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
