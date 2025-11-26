"use client"

import { useState, useEffect } from "react"
import { 
  Calendar, 
  MapPin, 
  Video, 
  CheckCircle2, 
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Types matching the API response
interface StudentWorkshop {
  id: number;
  session_name: string;
  type: "online" | "physical";
  workshop_date: string;
  location: string;
  is_registered: 0 | 1;
}

export default function StudentWorkshopsPage() {
  const [workshops, setWorkshops] = useState<StudentWorkshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState<number | null>(null);

  // MOCK USER ID - Replace with real auth hook
  const CURRENT_USER_ID = 5; 

  const fetchWorkshops = async () => {
    try {
      const res = await fetch(`/api/student/workshops?userId=${CURRENT_USER_ID}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setWorkshops(data);
      }
    } catch (error) {
      console.error("Failed to load workshops", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const handleApply = async (workshopId: number) => {
    setRegisteringId(workshopId);
    
    try {
      const res = await fetch('/api/workshops/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          workshop_id: workshopId, 
          user_id: CURRENT_USER_ID 
        })
      });

      const data = await res.json();

      if (res.ok) {
        setWorkshops(prev => prev.map(w => 
          w.id === workshopId ? { ...w, is_registered: 1 } : w
        ));
      } else {
        alert(data.error || "Application failed");
      }
    } catch (error) {
      console.error("Application error", error);
      alert("Something went wrong");
    } finally {
      setRegisteringId(null);
    }
  };

  // Date formatter
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen bg-white">
      <h1 className="text-2xl font-bold mb-6 text-slate-900">Available Workshops</h1>

      {loading ? (
        <div className="flex items-center gap-2 text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading sessions...</span>
        </div>
      ) : workshops.length === 0 ? (
        <div className="text-slate-500">
          No open workshops available at the moment.
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="w-[30%]">Session Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workshops.map((workshop) => (
                <TableRow key={workshop.id}>
                  <TableCell className="font-medium text-slate-900">
                    {workshop.session_name}
                  </TableCell>
                  <TableCell>
                    {workshop.type === 'online' ? (
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                        <Video className="h-3 w-3 mr-1" /> Online
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-orange-50 text-orange-700 hover:bg-orange-50">
                        <MapPin className="h-3 w-3 mr-1" /> Physical
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      {formatDate(workshop.workshop_date)}
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600 max-w-[200px] truncate">
                    {workshop.location}
                  </TableCell>
                  <TableCell className="text-right">
                    {workshop.is_registered === 1 ? (
                      <Button disabled variant="ghost" className="text-green-600 font-medium">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Registered
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handleApply(workshop.id)}
                        disabled={registeringId === workshop.id}
                        size="sm"
                        className="bg-slate-900 hover:bg-slate-800"
                      >
                        {registeringId === workshop.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Apply"
                        )}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}