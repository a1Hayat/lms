// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import SecurePDFViewer from "@/components/pdfViewer";
// import { PdfSkeletonView } from "@/components/loadingSkeleton";

// export default function ResourceViewerPage() {
//   const { token } = useParams();
//   const [pdfUrl, setPdfUrl] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!token) return;

//     const fetchPDF = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch("/api/resources/view", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ token }),
//         });

//         if (!res.ok) throw new Error("Failed to load PDF");

//         const blob = await res.blob();
//         const url = URL.createObjectURL(blob);
//         setPdfUrl(url);
//       } catch (err) {
//         console.error(err);
//         setPdfUrl(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPDF();

//   }, [token]);

//     // alert(pdfUrl)

//   // if (loading) return <div className="w-full"><PdfSkeletonView /></div>;
//   if (!pdfUrl) return <p className="text-center mt-10">Resource not found or access denied.</p>;

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center p-4 w-full">
//       {pdfUrl}
//       <SecurePDFViewer fileUrl={pdfUrl} />
//     </div>
//   );
// }
"use client";

import { useParams } from "next/navigation";
import SecurePDFViewer from "@/components/pdfViewer";

export default function ResourceViewerPage() {
  const { token } = useParams();

  if (!token) return <p className="text-center mt-10">Access denied.</p>;

  // 1. Instead of fetching the blob here, we build the URL.
  // We pass the token as a query parameter so the API can read it via GET.
  const pdfDirectUrl = `/api/resources/view?token=${token}`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 w-full">
      {/* 2. Pass the API URL string directly. PDF.js will handle the rest. */}
      <SecurePDFViewer fileUrl={pdfDirectUrl} />
    </div>
  );
}