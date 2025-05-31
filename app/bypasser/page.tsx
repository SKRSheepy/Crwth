"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"

export default function BypasserPage() {
  const [isLightning, setIsLightning] = useState(false)

  useEffect(() => {
    const triggerLightning = () => {
      setIsLightning(true)
      setTimeout(() => setIsLightning(false), 150)
    }

    const lightningInterval = setInterval(() => {
      // Random chance for lightning (about every 3-8 seconds)
      if (Math.random() < 0.3) {
        triggerLightning()
        // Sometimes double flash
        if (Math.random() < 0.4) {
          setTimeout(triggerLightning, 300)
        }
      }
    }, 3000)

    return () => clearInterval(lightningInterval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-700 p-4 flex items-center justify-center relative">
      {/* Lightning Flash Overlay */}
      <div
        className={`fixed inset-0 pointer-events-none transition-opacity duration-150 ${
          isLightning ? "opacity-20" : "opacity-0"
        } bg-gradient-to-br from-cyan-200 via-white to-rose-200 z-10`}
      />
      {/* Rain Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className={`absolute w-0.5 bg-gradient-to-b rain-drop transition-colors duration-150 ${
              isLightning ? "from-cyan-100/60 to-transparent" : "from-cyan-400/30 to-transparent"
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              height: `${Math.random() * 100 + 50}px`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
              transform: `translateY(-100px)`,
            }}
          />
        ))}
      </div>
      <style jsx>{`
        @keyframes rain {
          0% {
            transform: translateY(-100px);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }
        .rain-drop {
          animation: rain linear infinite;
        }
      `}</style>
      <Card
        className={`w-full max-w-md shadow-2xl border-0 backdrop-blur-sm border transition-all duration-150 ${
          isLightning ? "bg-gray-800/95 border-cyan-300/30 shadow-cyan-500/20" : "bg-gray-900/90 border-rose-900/30"
        }`}
      >
        <CardHeader className="text-center space-y-4 pb-6">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-rose-400 bg-clip-text text-transparent">
            Bypasser
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold text-gray-200">Down at the moment</h2>
          <p className="text-gray-400">
            The Bypasser service is currently undergoing maintenance. Please check back later.
          </p>

          {/* Back to Hub */}
          <div className="text-center pt-4 border-t border-blue-900/30">
            <Button
              onClick={() => (window.location.href = "/")}
              className="bg-gray-700 hover:bg-gray-600 text-white transition-all duration-300"
              variant="outline"
            >
              Back to Hub
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
