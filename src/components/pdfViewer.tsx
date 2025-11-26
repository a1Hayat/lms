"use client";

import { useEffect, useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions, PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PdfSkeletonView } from "./loadingSkeleton";

// Mobile-friendly JS worker
GlobalWorkerOptions.workerSrc = "/pdf-worker/pdf.worker.min.js";

// Polyfill for PDF.js v5
if (typeof Promise.withResolvers === "undefined" && typeof window !== "undefined") {
  // @ts-expect-error
  window.Promise.withResolvers = function () {
    let resolve: (value?: unknown) => void = () => {};
    let reject: (reason?: any) => void = () => {};
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
  const [error, setError] = useState<string | null>(null);
  const touchStartX = useRef(0);

  // --- Load PDF ---
  useEffect(() => {
    const loadPDF = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const pdf = await getDocument(fileUrl).promise;
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        setCurrentPage(1);
      } catch (err) {
        console.error("PDF Load Error:", err);
        setError("Failed to load PDF. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (fileUrl) loadPDF();
  }, [fileUrl]);

  // --- Render PDF page ---
  const renderPage = async (pageNum: number) => {
    if (!pdfDoc || !containerRef.current) return;

    const page: PDFPageProxy = await pdfDoc.getPage(pageNum);

    const style = window.getComputedStyle(containerRef.current);
    const paddingLeft = parseFloat(style.paddingLeft) || 0;
    const paddingRight = parseFloat(style.paddingRight) || 0;
    const usableWidth = containerRef.current.clientWidth - (paddingLeft + paddingRight);

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

    const context = canvas.getContext("2d");
    if (!context) return;

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(canvas);

    await page.render({ canvasContext: context, viewport, canvas }).promise;
  };

  // --- Re-render on page change ---
  useEffect(() => {
    if (!pdfDoc) return;
    requestAnimationFrame(() => renderPage(currentPage));
  }, [currentPage, pdfDoc]);

  // --- Disable right-click ---
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const prevent = (e: MouseEvent) => e.preventDefault();
    container.addEventListener("contextmenu", prevent);
    return () => container.removeEventListener("contextmenu", prevent);
  }, []);

  // --- Swipe gestures ---
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
    const handleTouchEnd = (e: TouchEvent) => {
      const diff = e.changedTouches[0].clientX - touchStartX.current;
      if (diff > 50) setCurrentPage((p) => Math.max(1, p - 1));
      else if (diff < -50) setCurrentPage((p) => Math.min(numPages, p + 1));
    };

    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchend", handleTouchEnd);
    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [numPages]);

  return (
    <div className="flex flex-col items-center w-full space-y-4 text-gray-900 dark:text-gray-100">
      {error && <div className="text-red-500 font-semibold">{error}</div>}
      {isLoading && !error && <div className="w-full"><PdfSkeletonView /></div>}

      {!isLoading && !error && numPages > 0 && (
        <div className="flex items-center gap-3 bg-secondary/20 p-2 rounded-lg">
          <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
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
              className="w-16 h-8 text-center"
            />
            <span className="text-sm text-muted-foreground">/ {numPages}</span>
          </div>

          <Button variant="outline" size="sm" disabled={currentPage === numPages} onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}>
            Next
          </Button>
        </div>
      )}

      <div
        ref={containerRef}
        className="w-full max-w-full min-h-[70vh] sm:min-h-[80vh] md:min-h-[90vh] rounded-xl bg-transparent p-2 sm:p-4 lg:p-6 flex justify-center items-start overflow-auto"
      />
    </div>
  );
}

