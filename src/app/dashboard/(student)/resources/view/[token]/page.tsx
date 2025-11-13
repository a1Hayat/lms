"use client";

import { useEffect, useState } from "react";
import Loader from "@/components/loader";
import SecurePDFViewer from "@/components/pdfViewer";

export default function ResourceViewerPage({ params }: { params: { token: string } }) {
  const { token } = params;
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPDF = async () => {
      try {
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
        console.error("Error fetching PDF:", err);
        setPdfUrl(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPDF();
  }, [token]);

  if (loading) return <Loader isLoading={true} className="h-screen" />;
  if (!pdfUrl) return <p className="text-center mt-10">Resource not found or access denied.</p>;
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* <iframe
        src={pdfUrl}
        width="100%"
        height="800px"
        style={{ border: "none" }}
        title="PDF Viewer"
      /> */}
      <p></p>
      <SecurePDFViewer fileUrl={pdfUrl} />
    </div>
  );
}
