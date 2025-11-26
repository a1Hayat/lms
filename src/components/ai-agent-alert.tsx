import { Sparkles } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

export function AiAgentAlert() {
  return (
    <Alert className="relative border-blue/30 bg-primary/5 text-primary">
      <Sparkles className="h-4 w-4 text-primary!" />
      <Badge className="absolute -right-3 -top-3">Coming Soon</Badge>
      <AlertTitle className="font-bold">
        Bari's AI Assistant is Landing Soon!
      </AlertTitle>
      <AlertDescription className="text-primary/90">
        Get ready to supercharge your O/A Level CS studies with instant help
        and pseudocode debugging.
      </AlertDescription>
    </Alert>
  )
}