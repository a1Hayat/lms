'use client'

import Image from "next/image";
import { useEffect, useState } from "react";
import Loader from "@/components/loader";
import { usePathname, useRouter } from "next/navigation";
import { LoadingSkeletonTable } from "@/components/loadingSkeleton";
import { Button } from "@/components/ui/button";
import { IconCircleDashedPlus } from "@tabler/icons-react";
import { users } from "../../../../../../types/users";
import { StudentDataTable } from "./data-table";
import { students } from "./columns";
import Add_Student from "./add_student";


export default function Students () {

const [isLoading, setIsLoading] = useState(false)
const [AddStudent, setAddStudent] = useState(false)
const [UserDetails, setUserDetails] = useState<users[]>([])
const router = useRouter()
const userRole = "student"

const fetchUsers = async (role: string) => {
    
      setIsLoading(true)
      
      try {
        const res = await fetch('/api/users/fetch-all', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify( {
            user_role: userRole,
          })
        });

        const data = await res.json();
        if (data.users) {
          return(data.users);
        }
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
      
      
      setIsLoading(false)
    
}


useEffect(() => {
    const fetchData = async () => {
      if (!userRole) return // no unit selected yet
      setIsLoading(true)
      try {
        const UserData = await fetchUsers(userRole) // ✅ use UnitId

        setUserDetails(UserData)
        
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
            <Add_Student
              isOpen={AddStudent}
              onClose={()=>setAddStudent(false)}
              user_role={userRole}
            />
            <div className="flex items-center justify-between mt-5 mb-5">
                {/* Left Side */}
                <p className="text-xl font-semibold text-black dark:text-white">
                Students
                </p>

                {/* Right Side */}
                 <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAddStudent(true)}
                  >
                    <IconCircleDashedPlus /> Add
                  </Button>
            </div>
            

          {isLoading ? (
                  <LoadingSkeletonTable />
                ) : UserDetails.length > 0 ? (
                  <div>
            <StudentDataTable columns={students} data={UserDetails} />

            
           </div>   

                  
                ) : (
                  <p className="text-gray-500 dark:text-gray-400"></p>
                )}
    

        </div>



    )
} 