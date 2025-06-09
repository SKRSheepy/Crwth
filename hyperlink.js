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

// Services with API URLs
const services = {
  tinyurl: (url) => `https://api.tinyurl.com/create`,
  shorturl: (url) => `https://api.shorturl.asia/v1/shorten`,
  isgd: (url) => `https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`,
  shortly: (url) => `https://api.short.ly/v1/shorten`
}

// Generate shortened URL function
async function shortenLink(url, shortener) {
  if (!url) {
    throw new Error("No URL provided")
  }

  if (shortener === "tinyurl") {
    const response = await fetch(services.tinyurl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add your API key here if needed
        // "Authorization": "Bearer YOUR_API_KEY",
      },
      body: JSON.stringify({ url }),
    })
    if (!response.ok) throw new Error("Failed to shorten the link")
    const data = await response.json()
    return data.data.tiny_url || data.data.url || data.short_url
  }

  else if (shortener === "shorturl") {
    // ShortURL.asia requires an API key - placeholder below
    const response = await fetch(services.shorturl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "Authorization": "Bearer YOUR_API_KEY",
      },
      body: JSON.stringify({ url }),
    })
    if (!response.ok) throw new Error("Failed to shorten the link")
    const data = await response.json()
    return data.shorturl || data.result_url
  }

  else if (shortener === "isgd") {
    const response = await fetch(services.isgd(url))
    if (!response.ok) throw new Error("Failed to shorten the link")
    const shortUrl = await response.text()
    return shortUrl
  }

  else if (shortener === "shortly") {
    const response = await fetch(services.shortly(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "Authorization": "Bearer YOUR_API_KEY",
      },
      body: JSON.stringify({ long_url: url }),
    })
    if (!response.ok) throw new Error("Failed to shorten the link")
    const data = await response.json()
    return data.data.short_url || data.short_url
  }

  else {
    throw new Error("Selected shortener is not supported.")
  }
}

// Event listener for Generate button
generateButton.addEventListener("click", async () => {
  errorMessage.textContent = ""
  selectedOption = optionSelect.value
  selectedShortener = shortenerSelect.value
  inputLink = linkInput.value.trim()

  if (!selectedOption) {
    errorMessage.textContent = "Please select an option."
    return
  }
  if (!selectedShortener) {
    errorMessage.textContent = "Please select a shortener."
    return
  }
  if (!inputLink) {
    errorMessage.textContent = "Please enter a valid URL."
    return
  }

  try {
    generateButton.disabled = true
    generateButton.textContent = "Loading..."

    shortenedLink = await shortenLink(inputLink, selectedShortener)

    // Format output (example formatting)
    formattedOutput = `<a href="${shortenedLink}" target="_blank" rel="noopener noreferrer">${shortenedLink}</a>`

    outputCode.innerHTML = formattedOutput
    selectedOptionText.textContent = selectedOption
    shortenedLinkText.textContent = shortenedLink
    outputCard.style.display = "block"
  } catch (err) {
    errorMessage.textContent = err.message || "Failed to shorten the link. Please try again later."
  } finally {
    generateButton.disabled = false
    generateButton.textContent = "Generate Link"
  }
})

// Copy button functionality
copyButton.addEventListener("click", () => {
  if (!shortenedLink) return
  navigator.clipboard.writeText(shortenedLink)
    .then(() => {
      copied = true
      copyButton.textContent = "Copied!"
      setTimeout(() => {
        copied = false
        copyButton.textContent = "Copy Output"
      }, 2000)
    })
    .catch(() => {
      errorMessage.textContent = "Failed to copy the link."
    })
})
