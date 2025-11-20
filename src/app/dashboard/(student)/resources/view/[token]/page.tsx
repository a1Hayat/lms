"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SecurePDFViewer from "@/components/pdfViewer";
import { PdfSkeletonView } from "@/components/loadingSkeleton";

export default function ResourceViewerPage() {
  const { token } = useParams();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchPDF = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/resources/view", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!res.ok) throw new Error("Failed to load PDF");

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (err) {
        console.error(err);
        setPdfUrl(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPDF();
  }, [token]);

  if (loading) return <div className="w-full"><PdfSkeletonView /></div>;
  if (!pdfUrl) return <p className="text-center mt-10">Resource not found or access denied.</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 w-full">
      <SecurePDFViewer fileUrl={pdfUrl} />
    </div>
  );
}
