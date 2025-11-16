"use client";

import { useEffect, useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions, PDFDocumentProxy, PDFPageProxy, version } from "pdfjs-dist";
import { Button } from "@/components/ui/button"; // Adjust path to your UI components
import { Input } from "@/components/ui/input";   // Adjust path to your UI components

// --- CRITICAL POLYFILL FOR PDF.JS v5 ---
// Without this, the app will crash with "Promise.withResolvers is not a function"
if (typeof Promise.withResolvers === "undefined") {
  if (typeof window !== "undefined") {
    // @ts-expect-error This is a manual polyfill for older environments
    window.Promise.withResolvers = function () {
      let resolve, reject;
      const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
      });
      return { promise, resolve, reject };
    };
  }
}

// Set the worker source dynamically to match the installed version
// Point to the file we just copied to the public folder
GlobalWorkerOptions.workerSrc = "/pdf-worker/pdf.worker.min.mjs";

interface SecurePDFViewerProps {
  fileUrl: string;
}

export default function SecurePDFViewer({ fileUrl }: SecurePDFViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Load the Document
  useEffect(() => {
    const loadPDF = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Load the document
        const loadingTask = getDocument(fileUrl);
        const pdf = await loadingTask.promise;
        
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        setIsLoading(false);
      } catch (err: any) {
        console.error("Error loading PDF:", err);
        setError("Failed to load PDF. Please try again.");
        setIsLoading(false);
      }
    };

    if (fileUrl) loadPDF();
  }, [fileUrl]);

  // 2. Render the Page
  const renderPage = async (pageNum: number) => {
    if (!containerRef.current || !pdfDoc) return;

    // Fetch page
    const page: PDFPageProxy = await pdfDoc.getPage(pageNum);
    
    // Determine scale (Responsive: fits width of container)
    const containerWidth = containerRef.current.clientWidth || 600;
    const unscaledViewport = page.getViewport({ scale: 1 });
    const scale = containerWidth / unscaledViewport.width;
    const viewport = page.getViewport({ scale: scale > 1.5 ? 1.5 : scale }); // Cap scale at 1.5x

    // Prepare Canvas
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    canvas.className = "rounded-md shadow-sm block mx-auto"; // Styling

    // Clear previous content and append new canvas
    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(canvas);

    // Render
    const context = canvas.getContext("2d");
    if (context) {
     // v5 requires the 'canvas' property to be present. 
// Since we have the element, we pass it here.
await page.render({ canvasContext: context, viewport, canvas }).promise;
    }
  };

  // Trigger render on page change
  useEffect(() => {
    renderPage(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pdfDoc]);
  // Disable right-click inside the viewer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const disableContext = (e: MouseEvent) => e.preventDefault();
    container.addEventListener("contextmenu", disableContext);

    return () => {
      container.removeEventListener("contextmenu", disableContext);
    };
  }, []);

  return (
    <div className="flex flex-col items-center w-full space-y-4 text-gray-900 dark:text-gray-100">
      
      {/* Error State */}
      {error && <div className="text-red-500 font-semibold">{error}</div>}

      {/* Loading State */}
      {isLoading && !error && <div>Loading PDF...</div>}

      {/* Controls - Only show if PDF is loaded */}
      {!isLoading && !error && numPages > 0 && (
        <div className="flex items-center gap-3 bg-secondary/20 p-2 rounded-lg">
          <Button 
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} 
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={1}
              max={numPages}
              value={currentPage}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val >= 1 && val <= numPages) setCurrentPage(val);
              }}
              className="w-16 text-center h-8"
            />
            <span className="text-sm text-muted-foreground">/ {numPages}</span>
          </div>

          <Button 
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))} 
            disabled={currentPage === numPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* PDF Container */}
      <div
        ref={containerRef}
        className="w-full max-w-4xl  rounded-xl bg-transparent p-4 min-h-[500px] flex justify-center items-start overflow-auto"
      />
    </div>
  );
}