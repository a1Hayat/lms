import { BrainCircuit, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function AiAgentComingSoon() {
  return (
    <Card className="relative w-full overflow-hidden
      border border-transparent 
      transition-all duration-300 ease-in-out
      hover:border-blue-600/30
      hover:shadow-lg hover:shadow-blue-600/10
    ">
      <CardContent className="p-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          {/* Icon */}
          <div className="shrink-0 rounded-lg bg-blue-100 p-3 dark:bg-blue-950/40">
            <BrainCircuit className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <h3 className="text-xl font-semibold text-card-foreground">
                Bari AI Assistant
              </h3>
              <Badge
                variant="outline"
                className="text-blue-600 border-blue-500/50 dark:text-blue-400"
              >
                Coming Soon
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Get instant answers, debug pseudocode, and understand complex
              O/A Level concepts 24/7.
            </p>
          </div>

          {/* Action Button */}
          <Button
            disabled
            className="mt-2 w-full shrink-0 sm:mt-0 sm:w-auto"
          >
            Get Notified
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}