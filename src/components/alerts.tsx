"use client"

import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useEffect, useState } from "react"

interface AppAlertProps {
  type?: "success" | "warning" | "error" | "info"
  title: string
  description?: string
  open: boolean
  onClose: () => void
}

export function AppAlert({
  type = "info",
  title,
  description,
  open,
  onClose,
}: AppAlertProps) {
  const [visible, setVisible] = useState(open)

  useEffect(() => {
    setVisible(open)
  }, [open])

  const icons = {
    success: <CheckCircle2 className="text-green-600 dark:text-green-400" />,
    warning: <TriangleAlert className="text-yellow-500 dark:text-yellow-400" />,
    error: <AlertCircle className="text-red-600 dark:text-red-400" />,
    info: <Info className="text-blue-600 dark:text-blue-400" />,
  }

  const variants = {
    success:
      "border-green-500/30 bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-100",
    warning:
      "border-yellow-500/30 bg-yellow-50 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-100",
    error:
      "border-red-500/30 bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-100",
    info:
      "border-blue-500/30 bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-100",
  }

  return (
    <div
      className={`fixed top-6 right-6 z-50 transition-all duration-500 transform ${
        visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <Alert
        className={`relative flex items-start gap-3 pr-10 w-80 shadow-lg rounded-lg border ${variants[type]}`}
      >
        <div className="mt-1 shrink-0">{icons[type]}</div>
        <div>
          <AlertTitle className="font-semibold">{title}</AlertTitle>
          {description && (
            <AlertDescription className="text-sm mt-1">{description}</AlertDescription>
          )}
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Close alert"
        >
          <X size={16} />
        </button>
      </Alert>
    </div>
  )
}
