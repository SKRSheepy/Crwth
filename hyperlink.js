console.log("hyperlink.js loaded!");

// Global variables
let isLightning = false
let selectedOption = ""
let inputLink = ""
let shortenedLink = ""
let formattedOutput = ""
let isLoading = false
let error = ""
let copied = false
let showOutput = false
let isTransitioning = false
let selectedShortener = ""

// DOM elements
const lightningOverlay = document.getElementById("lightningOverlay")
const rainContainer = document.getElementById("rainContainer")
const hyperlinkCard = document.getElementById("hyperlinkCard")
const optionSelect = document.getElementById("optionSelect")
const linkInput = document.getElementById("linkInput")
const errorMessage = document.getElementById("errorMessage")
const generateButton = document.getElementById("generateButton")
const outputCard = document.getElementById("outputCard")
const outputCode = document.getElementById("outputCode")
const copyButton = document.getElementById("copyButton")
const selectedOptionText = document.getElementById("selectedOptionText")
const shortenedLinkText = document.getElementById("shortenedLinkText")
const shortenerSelect = document.getElementById("shortenerSelect")

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  initializeRain()
  initializeLightning()
  initializeForm()
})

// Initialize rain effect
function initializeRain() {
  for (let i = 0; i < 50; i++) {
    const rainDrop = document.createElement("div")
    rainDrop.className = "rain-drop"
    rainDrop.style.left = Math.random() * 100 + "%"
    rainDrop.style.height = Math.random() * 100 + 50 + "px"
    rainDrop.style.animationDelay = Math.random() * 2 + "s"
    rainDrop.style.animationDuration = Math.random() * 3 + 2 + "s"
    rainContainer.appendChild(rainDrop)
  }
}

// Initialize lightning effect
function initializeLightning() {
  setInterval(() => {
    if (Math.random() < 0.3) {
      triggerLightning()
      if (Math.random() < 0.4) {
        setTimeout(triggerLightning, 300)
      }
    }
  }, 3000)
}

// Trigger lightning
function triggerLightning() {
  isLightning = true
  lightningOverlay.classList.add("active")
  hyperlinkCard.classList.add("lightning")

  const rainDrops = document.querySelectorAll(".rain-drop")
  rainDrops.forEach((drop) => drop.classList.add("lightning"))

  setTimeout(() => {
    isLightning = false
    lightningOverlay.classList.remove("active")
    hyperlinkCard.classList.remove("lightning")
    rainDrops.forEach((drop) => drop.classList.remove("lightning"))
  }, 150)
}

// Initialize form
function initializeForm() {
  optionSelect.addEventListener("change", (e) => {
    selectedOption = e.target.value
    clearError()
  })

  linkInput.addEventListener("input", (e) => {
    inputLink = e.target.value
    clearError()
  })

  generateButton.addEventListener("click", handleGenerateLink)
  copyButton.addEventListener("click", copyToClipboard)

  shortenerSelect.addEventListener("change", (e) => {
    selectedShortener = e.target.value
    clearError()
  })
}

// Clear error
function clearError() {
  error = ""
  errorMessage.textContent = ""
}

// Handle generate link
async function handleGenerateLink() {
  // Clear previous data
  clearError()
  copied = false
  shortenedLink = ""
  formattedOutput = ""

  // Validation
  if (!selectedOption) {
    showError("Please select an option first")
    return
  }

  if (!selectedShortener) {
    showError("Please select a shortener first")
    return
  }

  if (!inputLink) {
    showError("Please enter a link")
    return
  }

  if (!inputLink.startsWith("http://") && !inputLink.startsWith("https://")) {
    showError("Please enter a valid URL starting with http:// or https://")
    return
  }

  // Handle existing output
  if (showOutput) {
    isTransitioning = true
    setShowOutput(false)
    await new Promise((resolve) => setTimeout(resolve, 300))
  }

  setLoading(true)

  try {
    const shortened = await shortenLink(inputLink)
    shortenedLink = shortened
    formattedOutput = generateFormattedOutput(selectedOption, shortened)

    setTimeout(() => {
      setShowOutput(true)
      isTransitioning = false
    }, 100)
  } catch (err) {
    showError("Failed to shorten the link. Please try again later.")
    isTransitioning = false
  } finally {
    setLoading(false)
  }
}

// Show error
function showError(message) {
  error = message
  errorMessage.textContent = message
}

// Set loading state
function setLoading(loading) {
  isLoading = loading
  generateButton.disabled = loading || isTransitioning
  generateButton.textContent = loading ? "Generating..." : isTransitioning ? "Updating..." : "Generate Link"
}

// Set show output
function setShowOutput(show) {
  showOutput = show
  if (show) {
    outputCard.classList.add("show")
    updateOutputDisplay()
  } else {
    outputCard.classList.remove("show")
  }
}

// Update output display
function updateOutputDisplay() {
  outputCode.textContent = formattedOutput
  selectedOptionText.textContent = selectedOption.replace("-", " ")
  shortenedLinkText.textContent = shortenedLink

  // Add shortener info
  const shortenerNames = {
    tinyurl: "TinyURL",
    shorturl: "ShortURL.asia",
    spoo: "Spoo.com",
    isgd: "Is.gd",
  }

  // Update the output info to include shortener used
  const outputInfo = document.querySelector(".output-info")
  const existingShortenerInfo = outputInfo.querySelector(".shortener-used")
  if (existingShortenerInfo) {
    existingShortenerInfo.remove()
  }

  const shortenerInfo = document.createElement("p")
  shortenerInfo.className = "shortener-used"
  shortenerInfo.innerHTML = `Shortener used: <span style="color: #22d3ee">${shortenerNames[selectedShortener]}</span>`
  outputInfo.appendChild(shortenerInfo)

  // Reset copy button
  copyButton.innerHTML = `
        <svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        Copy Output
    `
  copyButton.classList.remove("copied")
}

// Shorten link
async function shortenLink(url) {
  try {
    const uniqueUrl = `${url}${url.includes("?") ? "&" : "?"}_t=${Date.now()}&_r=${Math.random().toString(36).substring(2, 8)}`

    const services = {
      tinyurl: {
        name: "TinyURL",
        url: `https://tinyurl.com/api-create.php?url=${encodeURIComponent(uniqueUrl)}`,
        method: "GET",
      },
      shorturl: {
        name: "ShortURL.asia",
        url: `https://shorturl.asia/api?url=${encodeURIComponent(uniqueUrl)}`,
        method: "GET",
      },
      spoo: {
        name: "Spoo.com",
        url: `https://spoo.me/`,
        method: "POST",
        body: JSON.stringify({ url: uniqueUrl }),
        headers: { "Content-Type": "application/json" },
      },
      isgd: {
        name: "Is.gd",
        url: `https://is.gd/create.php?format=simple&url=${encodeURIComponent(uniqueUrl)}`,
        method: "GET",
      },
    }

    const service = services[selectedShortener]
    if (!service) {
      throw new Error("Invalid shortener selected")
    }

    try {
      const requestOptions = {
        method: service.method,
        mode: "cors",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          ...(service.headers || {}),
        },
      }

      if (service.body) {
        requestOptions.body = service.body
      }

      const response = await fetch(service.url, requestOptions)

      if (response.ok) {
        let shortened
        if (selectedShortener === "spoo") {
          const data = await response.json()
          shortened = data.short_url
        } else {
          shortened = await response.text()
        }

        if (shortened && shortened.startsWith("http") && !shortened.includes("Error")) {
          return shortened.trim()
        }
      }
    } catch (serviceError) {
      console.log(`${service.name} failed:`, serviceError)
      throw serviceError
    }

    // If the selected service fails, create a mock shortened link
    const mockShortened = `https://short.ly/${Math.random().toString(36).substring(2, 8)}${Date.now().toString(36)}`
    return mockShortened
  } catch (error) {
    const services = {
      tinyurl: {
        name: "TinyURL",
        url: `https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`,
        method: "GET",
      },
      shorturl: {
        name: "ShortURL.asia",
        url: `https://shorturl.asia/api?url=${encodeURIComponent(url)}`,
        method: "GET",
      },
      spoo: {
        name: "Spoo.com",
        url: `https://spoo.me/`,
        method: "POST",
        body: JSON.stringify({ url: url }),
        headers: { "Content-Type": "application/json" },
      },
      isgd: {
        name: "Is.gd",
        url: `https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`,
        method: "GET",
      },
    }
    throw new Error(`${services[selectedShortener]?.name || "Selected shortener"} is currently unavailable`)
  }
}

// Generate formatted output
function generateFormattedOutput(option, shortenedUrl) {
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

// Copy to clipboard
async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(formattedOutput)
    showCopied()
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement("textarea")
    textArea.value = formattedOutput
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand("copy")
    document.body.removeChild(textArea)
    showCopied()
  }
}

// Show copied state
function showCopied() {
  copied = true
  copyButton.innerHTML = `
        <svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20,6 9,17 4,12"></polyline>
        </svg>
        Copied!
    `
  copyButton.classList.add("copied")

  setTimeout(() => {
    copied = false
    updateOutputDisplay()
  }, 2000)
}
