"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Loader from "@/components/loader";
import Image from "next/image";
import { resources } from "../../../../../../types/resources";

export default function ResourcePage() {
  const { token } = useParams(); // token for page URL
  const { data: session } = useSession();
  const router = useRouter();

  const [resource, setResource] = useState<resources | null>(null);
  const [loading, setLoading] = useState(false);
  const [decodedId, setDecodedId] = useState<number | null>(null);
  const [purchased, setPurchased] = useState(false);
  const [resourceFileUrl, setResourceFileUrl] = useState<string | null>(null);

  // ✅ Decode page token to get resource ID
  useEffect(() => {
    if (!token) return;
    (async () => {
      const res = await fetch("/api/courses/decode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (data.success) setDecodedId(data.courseId);
      else router.push("/dashboard/resources"); // redirect if invalid
    })();
  }, [token]);

  // ✅ Fetch resource details
  useEffect(() => {
    if (!decodedId) return;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/resources/fetch-resource", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resource_id: decodedId }),
        });
        const data = await res.json();
        if (data.success) setResource(data.resource);
      } finally {
        setLoading(false);
      }
    })();
  }, [decodedId]);

  // ✅ Check enrollment / purchase
  useEffect(() => {
    if (!session?.user?.id || !decodedId) return;
    (async () => {
      const res = await fetch("/api/check-enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: session.user.id, resource_id: decodedId }),
      });
      const data = await res.json();
      if (data.purchased) setPurchased(true);
    })();
  }, [session, decodedId]);

  // ✅ Generate secure file token & get signed URL
  const handleViewResource = async () => {
  if (!decodedId || !session?.user?.id) return;

  try {
    // Generate resource token
    const tokenRes = await fetch("/api/resources/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: session.user.id,
        resource_id: decodedId,
      }),
    });
    const tokenData = await tokenRes.json();

    if (!tokenData.success || !tokenData.token) {
      alert("Failed to generate resource token.");
      return;
    }

    // ✅ Navigate to viewer page with the token
    router.push(`/dashboard/resources/view/${tokenData.token}`);
  } catch (err) {
    console.error("Failed to view resource:", err);
  }
};

  if (!resource || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader isLoading={true} className=""/>
      </div>
    );
  }

  const formattedLevel =
    resource.level === "o-level"
      ? "O Level | IGCSE"
      : resource.level === "as-level"
      ? "AS Level | A-1"
      : resource.level === "a-level"
      ? "A Level | A-2"
      : resource.level;

  return (
    <div className="w-[90%] sm:w-[85%] lg:w-[80%] mx-auto p-4 sm:p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-3 gap-8 text-gray-900 dark:text-gray-100">

      <div className="lg:col-span-2">
        <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-gray-200 dark:border-[#1f1f1f] shadow-sm">
          <Image src={resource.thumbnail || 'resource_thumbnail'} alt={resource.title} fill className="object-cover object-center" />
        </div>

        <div className="mt-6 border-b border-gray-200 dark:border-[#1f1f1f] pb-3">
          <h2 className="text-xl font-semibold mb-3">Description</h2>
          <p className="text-gray-700 dark:text-gray-300">{resource.description}</p>
        </div>

        {/* ✅ PDF Viewer */}
        {resourceFileUrl && (
          <iframe
            src={resourceFileUrl}
            className="w-full h-[600px] mt-5 border rounded-lg"
            title={resource.title}
          />
        )}
      </div>

      {/* Sidebar */}
      <aside className="border dark:border-[#1f1f1f] rounded-xl p-6 shadow-sm h-fit sticky top-10">
        <h1 className="text-2xl font-semibold">{resource.title}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">{formattedLevel}</p>

        <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mt-3">
          Rs. {resource.price}
        </p>

        {purchased ? (
          <Button
            onClick={handleViewResource}
            className="mt-5 w-full bg-green-600 hover:bg-green-700 text-white py-3"
          >
            Open Resource
          </Button>
        ) : (
          <Button
            onClick={() => router.push(`/dashboard/resources/${token}/checkout`)}
            className="mt-5 w-full bg-blue-500 hover:bg-blue-600 text-white py-3"
          >
            Buy Now
          </Button>
        )}

        <div className="mt-4 text-center">
          <a href="/help" className="text-blue-500 dark:text-blue-400 text-sm hover:underline">
            Need Help?
          </a>
        </div>
      </aside>
    </div>
  );
}
