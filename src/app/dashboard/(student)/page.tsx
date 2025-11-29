"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import ProtectedRoute from "@/components/auth/protectedRoute";
import Loader from "@/components/loader";
import RoundProgress from "@/components/roundProgress";
import { CourseCardSkeletonRow } from "@/components/loadingSkeleton";
import { AiAgentAlert } from "@/components/ai-agent-alert";
import { resources } from "../../../../types/resources";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { AppAlert } from "@/components/alerts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, MapPin, Video, UserCheck, RefreshCw } from "lucide-react";
import { format } from "date-fns";

// 1. Define Interfaces
interface DashboardItem {
  id: number;
  title: string;
  thumbnail: string | null | undefined;
  price: number;
}

interface Workshop {
  id: number;
  session_name: string;
  type: 'online' | 'physical' | 'hybrid';
  workshop_date: string;
  location: string;
  status: 'opened' | 'closed';
  is_registered: number | boolean;
}

// --------------------------------------------
// Reusable List Component
// --------------------------------------------
function ItemList({
  title,
  items,
  loading,
  onClick,
  viewMoreLink,
}: {
  title: string;
  items: DashboardItem[];
  loading: boolean;
  onClick: (item: DashboardItem) => void;
  viewMoreLink: string;
}) {
  const MAX_ITEMS = 3;
  const visibleItems = items.slice(0, MAX_ITEMS);

  return (
    <div className="rounded-lg p-5 min-h-[300px]">
      <p className="font-bold mb-5">{title}</p>

      {loading ? (
        <CourseCardSkeletonRow />
      ) : items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-3">
            {visibleItems.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-neutral-900 rounded-lg shadow hover:shadow-lg transition p-3 flex flex-col gap-2 min-h-[210px] cursor-pointer"
                onClick={() => onClick(item)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.thumbnail || "/placeholder.jpg"}
                  alt={item.title}
                  className="rounded-md h-32 w-full object-cover"
                />

                <h3 className="font-semibold text-sm line-clamp-2">
                  {item.title}
                </h3>

                <p className="text-xs text-gray-500">Rs {new Intl.NumberFormat('en-PK').format(item.price)}</p>

                <button className="bg-green-600 text-white text-xs py-1.5 rounded hover:bg-green-700 w-full mt-auto">
                  Start
                </button>
              </div>
            ))}
          </div>

          {items.length > MAX_ITEMS && (
            <a
              href={viewMoreLink}
              className="block mt-4 text-center text-sm text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              View More →
            </a>
          )}
        </>
      ) : (
        <p className="text-center text-gray-500 mt-16">No data found.</p>
      )}
    </div>
  );
}

// --------------------------------------------
// Workshop Widget Component (New Table)
// --------------------------------------------
function WorkshopsWidget({
  workshops,
  loading,
  onRegister,
}: {
  workshops: Workshop[];
  loading: boolean;
  onRegister: (workshopId: number) => Promise<void>;
}) {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-lg p-5 shadow-md flex flex-col h-auto">
      <div className="flex justify-between items-center mb-5">
        <p className="font-bold">Workshops / Sessions</p>
      </div>

      {loading ? (
         <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
         </div>
      ) : workshops.length > 0 ? (
        <div className="overflow-auto -mx-2 px-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px]">Workshop</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workshops.map((workshop) => {
                const isApplied = Boolean(workshop.is_registered);
                return (
                  <TableRow
                    key={workshop.id}
                    className={`
                      ${isApplied 
                        ? 'bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30' 
                        : ''}
                    `}
                  >
                    <TableCell className="font-medium align-top py-3">
                      <div className="flex flex-col gap-1">
                        <span className="line-clamp-2 text-xs font-semibold">{workshop.session_name}</span>
                        {isApplied && (
                           <div className="flex items-center text-[10px] text-green-600 font-bold">
                             <UserCheck className="mr-1 h-3 w-3" /> Registered
                           </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="align-top py-3">
                      {workshop.status === 'opened' ? (
                        <Badge variant="outline" className="border-green-500 text-green-600 text-[10px] h-5 px-1.5">
                          Open
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-[10px] h-5 px-1.5">Closed</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right align-top py-3">
                      <WorkshopActionDialog 
                        workshop={workshop} 
                        isApplied={isApplied} 
                        onRegister={onRegister} 
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-2 min-h-[200px]">
           <Calendar className="h-8 w-8 opacity-20" />
           <p className="text-sm">No workshops available.</p>
        </div>
      )}
    </div>
  );
}

function WorkshopActionDialog({ 
  workshop, 
  isApplied, 
  onRegister 
}: { 
  workshop: Workshop; 
  isApplied: boolean; 
  onRegister: (id: number) => Promise<void>; 
}) {
  const [open, setOpen] = useState(false);
  const [registering, setRegistering] = useState(false);

  const handleRegisterClick = async () => {
    setRegistering(true);
    await onRegister(workshop.id);
    // Note: Parent handles reload, but we stop spinner if component unmounts/reloads happens fast
    // setRegistering(false); // Component might unmount on reload
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={isApplied ? "ghost" : "secondary"} 
          size="sm" 
          className={`h-7 text-xs px-2 ${isApplied ? 'text-green-700 hover:text-green-800 hover:bg-green-100' : ''}`}
        >
          {isApplied ? 'View' : 'Register'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{workshop.session_name}</DialogTitle>
          <DialogDescription>
            Workshop Details
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> Date
                    </span>
                    <span className="text-sm font-medium">
                        {/* Safe date parsing */}
                        {(() => {
                            try {
                                return format(new Date(workshop.workshop_date), 'MMM d, p');
                            } catch {
                                return workshop.workshop_date;
                            }
                        })()}
                    </span>
                </div>
                
                <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                        {workshop.type === 'online' ? <Video className="h-3 w-3"/> : <MapPin className="h-3 w-3"/>}
                        Location
                    </span>
                    <span className="text-sm font-medium">{workshop.location}</span>
                </div>
            </div>

            {isApplied ? (
                <div className="bg-green-100 p-3 rounded-md text-green-800 text-center text-sm font-medium border border-green-200 flex items-center justify-center gap-2">
                    <UserCheck className="h-4 w-4" /> You are registered.
                </div>
            ) : (
                <div className="text-sm text-gray-500">
                    Click register below to book your seat.
                </div>
            )}
        </div>

        <DialogFooter>
          {!isApplied && workshop.status === 'opened' && (
             <Button onClick={handleRegisterClick} disabled={registering} className="w-full">
               {registering && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
               Confirm Registration
             </Button>
          )}
           {isApplied && (
             <Button variant="outline" disabled className="w-full text-green-700 border-green-200 bg-green-50">
               Registered
             </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


// --------------------------------------------
// Main Component
// --------------------------------------------
export default function StudentDashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [isLoadingResources, setIsLoadingResources] = useState(false);
  const [isLoadingWorkshops, setIsLoadingWorkshops] = useState(false);

  const [courses, setCourses] = useState<DashboardItem[]>([]);
  const [resourcesList, setResourcesList] = useState<resources[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);

  const loading = isLoadingCourses || isLoadingResources;

  const [alert, setAlert] = useState({
    show: false,
    type: "info" as "success" | "error" | "warning" | "info",
    title: "",
    description: "",
  });

  // --------------------------------------------
  // Fetch Courses
  // --------------------------------------------
  const fetchCourses = useCallback(async () => {
    try {
      setIsLoadingCourses(true);

      const res = await fetch("/api/courses/enrolled", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ user_id: session?.user?.id }),
      });

      const data = await res.json();
      if (!data.success) throw new Error("Courses fetch failed");

      return data.courses;
    } catch {
      setAlert({
        show: true,
        type: "error",
        title: "Error",
        description: "Failed to load your courses",
      });
      return [];
    } finally {
      setIsLoadingCourses(false);
    }
  }, [session?.user?.id]);

  // --------------------------------------------
  // Fetch Resources
  // --------------------------------------------
  const fetchResources = useCallback(async () => {
    try {
      setIsLoadingResources(true);

      const res = await fetch("/api/resources/enrolled", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ user_id: session?.user?.id }),
      });

      const data = await res.json();
      if (!data.success) throw new Error("Resources fetch failed");

      return data.resources;
    } catch {
      setAlert({
        show: true,
        type: "error",
        title: "Error",
        description: "Failed to load your resources",
      });
      return [];
    } finally {
      setIsLoadingResources(false);
    }
  }, [session?.user?.id]);

  // --------------------------------------------
  // Fetch Workshops
  // --------------------------------------------
  const fetchWorkshops = useCallback(async () => {
    try {
      setIsLoadingWorkshops(true);
      if (!session?.user?.id) return [];

      const res = await fetch(`/api/workshops/registrations?userId=${session.user.id}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (e) {
       console.error(e);
       return [];
    } finally {
      setIsLoadingWorkshops(false);
    }
  }, [session?.user?.id]);


  // --------------------------------------------
  // Load Dashboard Data
  // --------------------------------------------
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      if (!session?.user?.id) return;

      const [courseData, resourceData, workshopData] = await Promise.all([
        fetchCourses(),
        fetchResources(),
        fetchWorkshops(),
      ]);

      if (mounted) {
        setCourses(courseData);
        setResourcesList(resourceData);
        setWorkshops(workshopData);
      }
    };

    loadData();
    return () => {
      mounted = false;
    };
  }, [session?.user?.id, fetchCourses, fetchResources, fetchWorkshops]);

  // --------------------------------------------
  // Handlers
  // --------------------------------------------
  const handleViewCourse = async (course_id: number) => {
      try {
        const res = await fetch("/api/courses/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId: course_id }),
        });
        const data = await res.json();
        if (data.token) router.push(`/dashboard/courses/${data.token}`);
        return;
      } catch {}
  };

  const handleViewResource = async (resource_id: number) => {
    try {
        const res = await fetch("/api/courses/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId: resource_id }),
        });
        const data = await res.json();
        if (data.token) router.push(`/dashboard/resources/${data.token}`);
        return;
      } catch {}
  };

  const handleRegisterWorkshop = async (workshopId: number) => {
    if(!session?.user?.id) return;

    // Find the workshop being registered for
    const targetWorkshop = workshops.find(w => w.id === workshopId);

    try {
      const res = await fetch('/api/workshops/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workshopId, userId: session.user.id }),
      });

      if (res.ok) { 
        // Send email if workshop details found
        if (targetWorkshop) {
            try {
                await fetch("/api/send-mail", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        to: session?.user.email,
                        subject: "Workshop Registration Confirmed - CSWithBari",
                        type: "workshopRegistrationEmail", // Matches the template key
                        payload: {
                            name: session?.user.name,
                            workshopName: targetWorkshop.session_name,
                            date: format(new Date(targetWorkshop.workshop_date), 'PPP p'),
                            type: targetWorkshop.type,
                            details: targetWorkshop.location
                        }
                    })
                });
            } catch (mailError) {
                console.error("Failed to send email:", mailError);
            }
        }
        
        // Reload page to reflect changes
        window.location.reload();
      } else {
         setAlert({
            show: true,
            type: 'error',
            title: 'Registration Failed',
            description: 'Could not register for this workshop.'
         });
      }
    } catch (error) {
       console.error(error);
    }
  };


  // --------------------------------------------
  // Render
  // --------------------------------------------
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <AppAlert 
        {...alert} 
        open={alert.show} 
        onClose={() => setAlert({ ...alert, show: false })} 
      />

      {loading && <Loader isLoading className="h-screen" />}

      <div className="min-h-screen grid grid-cols-1 md:grid-cols-12 gap-6 text-gray-900 dark:text-white transition-colors">

        {/* LEFT SIDEBAR */}
        <div className="md:col-span-3 flex flex-col gap-4">

          {/* Greeting */}
          <div className="bg-linear-to-br from-transparent to-blue-200 dark:from-[#0f0f0f] dark:to-blue-950 rounded-md px-4 py-7 text-center shadow-md">
            <p>
              Hello,&nbsp;
              <span className="text-blue-700 dark:text-blue-500 font-semibold">
                {session?.user.name}
              </span>{" "}
              👋
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Good Afternoon
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-col gap-4">
            {/* Courses */}
            <StatBox
              title="Enrolled Courses"
              subtitle={`You’ve joined ${courses.length} active courses`}
              progress={courses.length * 10}
              color="text-green-500"
            />

            {/* Resources */}
            <StatBox
              title="Enrolled Resources"
              subtitle={`You’ve joined ${resourcesList.length} active resources`}
              progress={resourcesList.length * 10}
              color="text-blue-500"
            />

            {/* Total */}
            <StatBox
              title="Total Completion"
              subtitle={`You’ve purchased ${
                courses.length + resourcesList.length
              } items`}
              progress={(courses.length + resourcesList.length) * 10}
              color="text-yellow-500"
            />
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="md:col-span-9 flex flex-col gap-6">

          <AiAgentAlert />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <ItemList
              title="My Courses"
              items={courses}
              loading={isLoadingCourses}
              onClick={(item) => handleViewCourse(item.id)}
              viewMoreLink="/dashboard/my-courses" 
            />

            <ItemList
              title="My Resources"
              items={resourcesList as unknown as DashboardItem[]}
              loading={isLoadingResources}
              onClick={(item) => handleViewResource(item.id)}
              viewMoreLink="/dashboard/my-resources"  
            />

            {/* WORKSHOPS TABLE WIDGET */}
            <WorkshopsWidget 
              workshops={workshops}
              loading={isLoadingWorkshops}
              onRegister={handleRegisterWorkshop}
            />

          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

// --------------------------------------------
// Small Reusable Stat Box Component
// --------------------------------------------
function StatBox({
  title,
  subtitle,
  progress,
  color,
}: {
  title: string;
  subtitle: string;
  progress: number;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between bg-white dark:bg-neutral-900 rounded-lg p-7 shadow-md">
      <div>
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
      </div>
      <RoundProgress
        progress={Math.min(progress, 100)}
        color={color}
        size={70}
      />
    </div>
  );
}