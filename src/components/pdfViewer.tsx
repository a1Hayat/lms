"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { getDocument, GlobalWorkerOptions, PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";
// Import specific types for better type safety
import type { PDFDocumentLoadingTask, RenderTask } from "pdfjs-dist";
import { Button } from "@/components/ui/button";
import { PdfSkeletonView } from "./loadingSkeleton";
import { Input } from "./ui/input";

// 1. Point to the .mjs file in your public folder
GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

// Polyfill for PDF.js v5+
if (typeof Promise.withResolvers === "undefined" && typeof window !== "undefined") {
  // @ts-expect-error: Promise.withResolvers is a newer standard not yet in all TS lib definitions
  window.Promise.withResolvers = function () {
    let resolve: (value?: unknown) => void = () => {};
    // Fix: Use unknown instead of any to satisfy linter
    let reject: (reason?: unknown) => void = () => {};
    const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
    return { promise, resolve, reject };
  };
}

interface SecurePDFViewerProps {
  fileUrl: string;
}

export default function SecurePDFViewer({ fileUrl }: SecurePDFViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [numPages, setNumPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Fix: Type the refs properly
  const renderTaskRef = useRef<RenderTask | null>(null);
  const pageProxyRef = useRef<PDFPageProxy | null>(null);
  const touchStartX = useRef(0);

  useEffect(() => {
    // Fix: Type loadingTask
    let loadingTask: PDFDocumentLoadingTask | null = null;
    let isCancelled = false; 

    const loadPDF = async () => {
      if (!fileUrl) return;
      setIsLoading(true);
      setProgress(0);
      setError(null);

      try {
        loadingTask = getDocument({
          url: fileUrl,
          disableAutoFetch: true, 
          disableStream: true,    
          rangeChunkSize: 65536,
        });
        
        loadingTask.onProgress = (p: { loaded: number; total: number }) => {
          if (p.total > 0) {
            setProgress(Math.round((p.loaded / p.total) * 100));
          }
        };

        const pdf = await loadingTask.promise;
        
        // If the component unmounted (user left page), kill the process
        if (isCancelled) {
            pdf.destroy();
            return;
        }

        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        setCurrentPage(1);
      } catch (err: unknown) {
        // Fix: Cast unknown error to Error type for property access
        const errorObj = err as Error;

        // 2. CRITICAL FIX: Ignore "Worker was destroyed" errors
        // These happen because React loads the component twice in dev mode.
        if (errorObj.message && errorObj.message.includes("Worker was destroyed")) {
            return;
        }
        if (errorObj.name === "AbortException") {
            return;
        }

        console.error("PDF Load Error:", err);
        if (!isCancelled) {
             setError(errorObj.message || "Failed to load PDF.");
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    loadPDF();

    return () => {
      isCancelled = true;
      if (loadingTask) {
          loadingTask.destroy().catch(() => {});
      }
      if (pdfDoc) {
          pdfDoc.destroy().catch(() => {});
      }
    };
  }, [fileUrl]);

  // Fix: Wrap renderPage in useCallback to stabilize it as a dependency
  const renderPage = useCallback(async (pageNum: number) => {
    if (!pdfDoc || !containerRef.current) return;
    
    if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
    }
    
    if (pageProxyRef.current) {
      pageProxyRef.current.cleanup();
      pageProxyRef.current = null;
    }

    try {
      const page = await pdfDoc.getPage(pageNum);
      pageProxyRef.current = page;

      const style = window.getComputedStyle(containerRef.current);
      const usableWidth = containerRef.current.clientWidth - (parseFloat(style.paddingLeft) + parseFloat(style.paddingRight));
      
      const dpi = window.devicePixelRatio || 1;
      const unscaledViewport = page.getViewport({ scale: 1 });
      const scale = Math.min(1.5, usableWidth / unscaledViewport.width); 
      const viewport = page.getViewport({ scale: scale * dpi });

      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.width = `${viewport.width / dpi}px`;
      canvas.style.height = `${viewport.height / dpi}px`;
      canvas.className = "rounded-md shadow-sm mx-auto block";

      const context = canvas.getContext("2d", { alpha: false });
      if (!context) return;

      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(canvas);
      
      const renderContext = { 
        canvasContext: context, 
        viewport,
        canvas, // Include canvas if needed by specific pdfjs versions
      };
      
      const renderTask = page.render(renderContext);
      renderTaskRef.current = renderTask;
      await renderTask.promise;
    } catch (error: unknown) {
      const err = error as Error;
      if (err.name !== "RenderingCancelledException") {
          console.error("Render error:", error);
      }
    }
  }, [pdfDoc]);

  // Fix: Added renderPage to dependency array
  useEffect(() => {
    if (!pdfDoc) return;
    const rAF = requestAnimationFrame(() => renderPage(currentPage));
    return () => cancelAnimationFrame(rAF);
  }, [currentPage, pdfDoc, renderPage]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleTouchStart = (e: TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
    const handleTouchEnd = (e: TouchEvent) => {
      const diff = e.changedTouches[0].clientX - touchStartX.current;
      if (diff > 50) setCurrentPage((p) => Math.max(1, p - 1));
      else if (diff < -50) setCurrentPage((p) => Math.min(numPages, p + 1));
    };
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => { container.removeEventListener("touchstart", handleTouchStart); container.removeEventListener("touchend", handleTouchEnd); };
  }, [numPages]);

  return (
    <div className="flex flex-col items-center w-full space-y-4 text-gray-900 dark:text-gray-100 relative">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center">
          <p className="font-bold">Error loading document</p>
          <span className="block text-sm">Reload or check your connection</span>
        </div>
      )}
      
      {isLoading && !error && (
        <div className="w-full relative flex flex-col items-center justify-center min-h-[50vh]">
            <PdfSkeletonView />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 dark:bg-[#0f0f0f] p-6 rounded-xl shadow-2xl z-20 w-[80%] max-w-[280px]">
                <div className="flex justify-between text-xs font-semibold mb-2">
                    <span>Loading...</span><span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
            </div>
        </div>
      )}

      {/* CONTROLS */}
      {!isLoading && !error && numPages > 0 && (
        <div className="flex items-center gap-2 bg-white/50 dark:bg-[#1f1f1f] p-2 rounded-full border shadow-sm backdrop-blur-md sticky top-4 z-30 transition-all">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full"
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            ←
          </Button>

          <div className="flex items-center gap-1">
            <Input
              type="number"
              min={1}
              max={numPages}
              value={currentPage}
              onChange={(e) => {
                // Parse integer
                const val = parseInt(e.target.value);
                // Only update if it is a valid number inside the range
                // This allows typing "12" without crashing on "1"
                if (!isNaN(val) && val >= 1 && val <= numPages) {
                  setCurrentPage(val);
                }
              }}
              // Tailwind classes explanation:
              // w-12: fixed width for the number
              // text-center: center the number
              // border-none & focus-visible:ring-0: removes the box look
              // [appearance:textfield]... : Hides the ugly browser up/down arrows
              className="w-12 h-8 p-0 text-center border-none bg-transparent focus-visible:ring-0 text-sm font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="text-sm font-medium text-muted-foreground mr-2">/ {numPages}</span>
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full"
            disabled={currentPage === numPages} 
            onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
          >
            →
          </Button>
        </div>
      )}

      <div ref={containerRef} className="w-full min-h-[60vh] rounded-xl flex justify-center items-start overflow-hidden touch-pan-y" />
    </div>
  );
}