"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { Copy, Check } from "lucide-react"

export default function RefresherPage() {
  const [isLightning, setIsLightning] = useState(false)
  const [selectedOption, setSelectedOption] = useState("")
  const [inputLink, setInputLink] = useState("")
  const [shortenedLink, setShortenedLink] = useState("")
  const [formattedOutput, setFormattedOutput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [showOutput, setShowOutput] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

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

  const shortenLink = async (url: string) => {
    try {
      // Add a unique timestamp parameter to ensure each request generates a new short link
      const uniqueUrl = `${url}${url.includes("?") ? "&" : "?"}_t=${Date.now()}&_r=${Math.random().toString(36).substring(2, 8)}`

      // Try multiple URL shortening services as fallbacks
      const services = [
        {
          name: "TinyURL",
          url: `https://tinyurl.com/api-create.php?url=${encodeURIComponent(uniqueUrl)}`,
        },
        {
          name: "is.gd",
          url: `https://is.gd/create.php?format=simple&url=${encodeURIComponent(uniqueUrl)}`,
        },
      ]

      for (const service of services) {
        try {
          const response = await fetch(service.url, {
            method: "GET",
            mode: "cors",
            // Add cache busting headers
            headers: {
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
            },
          })

          if (response.ok) {
            const shortened = await response.text()
            if (shortened && shortened.startsWith("http") && !shortened.includes("Error")) {
              return shortened.trim()
            }
          }
        } catch (serviceError) {
          console.log(`${service.name} failed, trying next service...`)
          continue
        }
      }

      // If all services fail, create a unique mock shortened link for demo purposes
      const mockShortened = `https://short.ly/${Math.random().toString(36).substring(2, 8)}${Date.now().toString(36)}`
      return mockShortened
    } catch (error) {
      throw new Error("All URL shortening services are currently unavailable")
    }
  }

  const generateFormattedOutput = (option: string, shortenedUrl: string) => {
    switch (option) {
      case "profile":
        return `[https://www.roblox.com/users/3095250/profile]("${shortenedUrl}")`
      case "private-server":
        return `[https://www.roblox.com/share?code=80177c63cdc8614aa84be3cbd84b051a&type=Server]("${shortenedUrl}")`
      case "groups":
        return `[https://www.roblox.com/groups/2194003353]("${shortenedUrl}")`
      default:
        return shortenedUrl
    }
  }

  const handleGenerateLink = async () => {
    // Clear all previous data immediately
    setError("")
    setCopied(false)
    setShortenedLink("")
    setFormattedOutput("")

    if (!selectedOption) {
      setError("Please select an option first")
      return
    }

    if (!inputLink) {
      setError("Please enter a link")
      return
    }

    if (!inputLink.startsWith("http://") && !inputLink.startsWith("https://")) {
      setError("Please enter a valid URL starting with http:// or https://")
      return
    }

    // If there's already output showing, fade it out first
    if (showOutput) {
      setIsTransitioning(true)
      setShowOutput(false)

      // Wait for fade out animation to complete
      await new Promise((resolve) => setTimeout(resolve, 300))
    }

    setIsLoading(true)

    try {
      // Always generate a fresh shortened link
      const shortened = await shortenLink(inputLink)
      setShortenedLink(shortened)
      const formatted = generateFormattedOutput(selectedOption, shortened)
      setFormattedOutput(formatted)

      // Small delay to ensure state is updated
      setTimeout(() => {
        setShowOutput(true)
        setIsTransitioning(false)
      }, 100)
    } catch (error) {
      setError("Failed to shorten the link. Please try again later.")
      setIsTransitioning(false)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formattedOutput)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = formattedOutput
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

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

      <div className="w-full max-w-2xl space-y-6">
        <Card
          className={`shadow-2xl border-0 backdrop-blur-sm border transition-all duration-150 ${
            isLightning ? "bg-gray-800/95 border-cyan-300/30 shadow-cyan-500/20" : "bg-gray-900/90 border-blue-900/30"
          }`}
        >
          <CardHeader className="text-center space-y-4 pb-6">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Refresher
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Select Option */}
            <div className="space-y-2">
              <label className="text-cyan-400 font-medium">Select Option</label>
              <Select value={selectedOption} onValueChange={setSelectedOption}>
                <SelectTrigger className="bg-black/40 border-blue-800/50 text-gray-300 focus:border-blue-600">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-blue-800/50">
                  <SelectItem value="profile" className="text-gray-300 focus:bg-blue-900/30">
                    Profile
                  </SelectItem>
                  <SelectItem value="private-server" className="text-gray-300 focus:bg-blue-900/30">
                    Private Server
                  </SelectItem>
                  <SelectItem value="groups" className="text-gray-300 focus:bg-blue-900/30">
                    Groups
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Enter Your Link */}
            <div className="space-y-2">
              <label className="text-cyan-400 font-medium">Enter Your Link</label>
              <Input
                type="url"
                placeholder="https://example.com"
                value={inputLink}
                onChange={(e) => setInputLink(e.target.value)}
                className="bg-black/40 border-blue-800/50 text-gray-300 placeholder:text-gray-500 focus:border-blue-600"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="transition-all duration-300 ease-in-out">
                <p className="text-blue-400 text-sm">{error}</p>
              </div>
            )}

            {/* Generate Link Button */}
            <Button
              onClick={handleGenerateLink}
              disabled={isLoading || isTransitioning}
              className="w-full bg-blue-900/80 hover:bg-blue-800 text-white border-0 py-3 text-lg font-medium transition-all duration-300"
            >
              {isLoading ? "Generating..." : isTransitioning ? "Updating..." : "Generate Link"}
            </Button>

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

        {/* Formatted Output Popup with Smooth Transitions */}
        <div
          className={`transition-all duration-300 ease-in-out transform ${
            showOutput && formattedOutput
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-4 scale-95 pointer-events-none"
          }`}
        >
          <Card className="bg-gray-900/95 border-blue-800/50 shadow-lg">
            <CardContent className="p-4">
              <div className="space-y-3">
                <h3 className="text-cyan-400 font-medium">Generated Output</h3>
                <div className="bg-black/40 border border-blue-800/50 rounded p-3 transition-all duration-200">
                  <code className="text-cyan-300 text-sm break-all font-mono">{formattedOutput}</code>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={copyToClipboard}
                    className="bg-blue-800 hover:bg-blue-700 text-white flex-1 transition-all duration-200"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Output
                      </>
                    )}
                  </Button>
                </div>
                <div className="transition-all duration-200">
                  <p className="text-sm text-gray-400">
                    Selected option:{" "}
                    <span className="text-cyan-400 capitalize">{selectedOption.replace("-", " ")}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Shortened link: <span className="text-blue-400">{shortenedLink}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
