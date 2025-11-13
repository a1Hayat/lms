'use client'

import Image from "next/image";
import { useEffect, useState } from "react";
import Loader from "@/components/loader";
import { usePathname, useRouter } from "next/navigation";
import { LoadingSkeletonTable } from "@/components/loadingSkeleton";
import { Button } from "@/components/ui/button";
import { IconCircleDashedPlus } from "@tabler/icons-react";
import { resources } from "../../../../../types/resources" // make sure you have this type
import { ResourcesDataTable } from "./data-table";
import { ResourcesColumns } from "./columns";
import nothing from '@/components/images/empty.png'
import { AppAlert } from "@/components/alerts";

export default function ResourcesPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [AddResource, setAddResource] = useState(false)
  const [ResourceDetails, setResourceDetails] = useState<resources[]>([])
  const [alert, setAlert] = useState({
      show: false,
      type: "info" as "success" | "error" | "warning" | "info",
      title: "",
      description: "",
  })

  const fetchResources = async () => {
    try {
      setIsLoading(true);

      const res = await fetch("/api/resources/fetch-all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!res.ok) {
        setAlert({
          show: true,
          type: "error",
          title: "Fetch Failed!",
          description: "Server error, please try again later.",
        })
        return [];
      }

      const data = await res.json();
      return data.resources || [];
    } catch (err) {
      console.error("Failed to fetch resources:", err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const ResourceData = await fetchResources();
        if (isMounted && ResourceData.length > 0) {
          setResourceDetails(ResourceData);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();

    return () => { isMounted = false; };
  }, []);

  return (
    <div className="px-10 w-full">
      <AppAlert
        type={alert.type}
        title={alert.title}
        description={alert.description}
        open={alert.show}
        onClose={() => setAlert({ ...alert, show: false })}
      />

      <div className="flex items-center justify-between mt-5 mb-5">
        <p className="text-xl font-semibold text-black dark:text-white">
          Resources
        </p>

        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.href = "/dashboard/admin/resources/add"}
        >
          <IconCircleDashedPlus /> Add
        </Button>
      </div>

      {isLoading ? (
        <LoadingSkeletonTable />
      ) : ResourceDetails.length > 0 ? (
        <ResourcesDataTable columns={ResourcesColumns} data={ResourceDetails} />
      ) : (
        <div className="flex flex-col items-center justify-center py-10">
          <Image
            src={nothing}
            alt="nothing_found"
            height={120}
            width={120}
          />
          <p className="mt-4 text-gray-500">No resources found</p>
        </div>
      )}
    </div>
  )
}
