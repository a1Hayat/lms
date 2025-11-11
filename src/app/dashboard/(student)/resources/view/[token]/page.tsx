"use client";

import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import Loader from "@/components/loader";

// Use CDN-hosted worker (version matches your pdfjs)
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function ResourceViewerPage({ params }: { params: { token: string } }) {
  const { token } = params;
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
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
        setPdfUrl(URL.createObjectURL(blob));
      } catch (err) {
        console.error(err);
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-neutral-900">
      <Document
        file={pdfUrl}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        options={{ cMapUrl: "/cmaps/", cMapPacked: true }}
      >
        {Array.from(new Array(numPages), (el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        ))}
      </Document>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Page 1 of {numPages}
      </p>
    </div>
  );
}
