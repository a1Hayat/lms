'use client'

import Image from "next/image";
import { useEffect, useState } from "react";
import Loader from "@/components/loader";
import { usePathname, useRouter } from "next/navigation";
import { LoadingSkeletonTable } from "@/components/loadingSkeleton";
import { Button } from "@/components/ui/button";
import { IconCircleDashedPlus } from "@tabler/icons-react";
import { courses } from "../../../../../types/courses";
import { CoursesDataTable } from "./data-table";
import { Courses } from "./columns";
import nothing from '@/components/images/empty.png'

export default function Students () {

const [isLoading, setIsLoading] = useState(false)
const [AddUser, setAddUser] = useState(false)
const [CourseDetails, setCourseDetails] = useState<courses[]>([])

const fetchCourse = async () => {
    
      setIsLoading(true)
      
      try {
        const res = await fetch('/api/courses/fetch-all', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await res.json();
        if (data.courses) {
          return(data.courses);
        }
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      }
      
      
      setIsLoading(false)
    
}


useEffect(() => {
    const fetchData = async () => {
      
      setIsLoading(true)
      try {
        const CourseData = await fetchCourse() // ✅ use UnitId

        setCourseDetails(CourseData)
        
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, []) // ✅ refetch when unit changes

    return (
        

        <div className="px-10 w-[100%]">
            {/* <Add_admin
              isOpen={AddUser}
              onClose={()=>setAddUser(false)}
              user_role={userRole}
            /> */}
            <div className="flex items-center justify-between mt-5 mb-5">
                {/* Left Side */}
                <p className="text-xl font-semibold text-black dark:text-white">
                Courses
                </p>

                {/* Right Side */}
                 <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.href=('/dashboard/admin/courses/add')}
                  >
                    <IconCircleDashedPlus /> Add
                  </Button>
            </div>
            

          {isLoading ? (
              <LoadingSkeletonTable />
            ) : CourseDetails && CourseDetails.length > 0 ? (
              <div>
                <CoursesDataTable columns={Courses} data={CourseDetails} />
              </div>   
            ) : (
              <div className="flex flex-col items-center justify-center py-10">
                <Image
                  src="/images/empty.png"
                  alt="nothing_found"
                  height={120}
                  width={120}
                />
                <p className="mt-4 text-gray-500">No courses found</p>
              </div>
            )}

    

        </div>



    )
} 