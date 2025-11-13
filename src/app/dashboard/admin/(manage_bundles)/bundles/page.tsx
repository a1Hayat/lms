'use client'

import Image from "next/image";
import { useEffect, useState } from "react";
import Loader from "@/components/loader";
import { usePathname, useRouter } from "next/navigation";
import { LoadingSkeletonTable } from "@/components/loadingSkeleton";
import { Button } from "@/components/ui/button";
import { IconCircleDashedPlus } from "@tabler/icons-react";
import { users } from "../../../../../../types/users";
import { bundles_cols } from "./columns";
import { BundlesDataTable } from "./data-table";
import { Bundle } from "../../../../../../types/bundles";


export default function Students () {

const [isLoading, setIsLoading] = useState(false)
const [AddUser, setAddUser] = useState(false)
const [UserDetails, setUserDetails] = useState<Bundle[]>([])
const router = useRouter()
const userRole = "admin"

const fetchBundles = async () => {
  setIsLoading(true);

  try {
    const res = await fetch("/api/bundles/fetch");
    const data = await res.json();
    return data.bundles;
  } catch (err) {
    console.error("Failed to fetch bundles:", err);
  }

  setIsLoading(false);
};


useEffect(() => {
  const loadData = async () => {
    setIsLoading(true);
    const bundleData = await fetchBundles();
    setUserDetails(bundleData || []);
    setIsLoading(false);
  };

  loadData();
}, []);
// ✅ refetch when unit changes

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
                Bundles
                </p>

                {/* Right Side */}
                 <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.href="/dashboard/admin/add_bundle"}
                  >
                    <IconCircleDashedPlus /> Add
                  </Button>
            </div>
            

          {isLoading ? (
                  <LoadingSkeletonTable />
                ) : UserDetails.length > 0 ? (
                  <div>
            <BundlesDataTable columns={bundles_cols} data={UserDetails} />

            
           </div>   

                  
                ) : (
                  <p className="text-gray-500 dark:text-gray-400"></p>
                )}
    

        </div>



    )
} 