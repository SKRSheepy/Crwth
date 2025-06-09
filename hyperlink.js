// Global variables
let isLightning = false;
let selectedOption = "";
let inputLink = "";
let shortenedLink = "";
let formattedOutput = "";
let isLoading = false;
let error = "";
let copied = false;
let showOutput = false;
let isTransitioning = false;
let selectedShortener = "";

// DOM elements
const lightningOverlay = document.getElementById("lightningOverlay");
const rainContainer = document.getElementById("rainContainer");
const hyperlinkCard = document.getElementById("hyperlinkCard");
const optionSelect = document.getElementById("optionSelect");
const linkInput = document.getElementById("linkInput");
const errorMessage = document.getElementById("errorMessage");
const generateButton = document.getElementById("generateButton");
const outputCard = document.getElementById("outputCard");
const outputCode = document.getElementById("outputCode");
const copyButton = document.getElementById("copyButton");
const selectedOptionText = document.getElementById("selectedOptionText");
const shortenedLinkText = document.getElementById("shortenedLinkText");
const shortenerSelect = document.getElementById("shortenerSelect");

// Event listeners
optionSelect.addEventListener("change", () => {
  selectedOption = optionSelect.value;
  errorMessage.textContent = "";
});

shortenerSelect.addEventListener("change", () => {
  selectedShortener = shortenerSelect.value;
  errorMessage.textContent = "";
});

copyButton.addEventListener("click", () => {
  const text = outputCode.textContent;
  if (text) {
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied to clipboard!");
    });
  }
});

generateButton.addEventListener("click", async () => {
  errorMessage.textContent = "";
  outputCode.textContent = "";
  shortenedLinkText.textContent = "";

  if (!selectedOption) {
    errorMessage.textContent = "Please select an option.";
    return;
  }
  if (!selectedShortener) {
    errorMessage.textContent = "Please select a shortener.";
    return;
  }
  if (!linkInput.value || !isValidUrl(linkInput.value)) {
    errorMessage.textContent = "Please enter a valid URL.";
    return;
  }

  inputLink = linkInput.value.trim();
  selectedOptionText.textContent = selectedOption;

  // Modify inputLink or build URL based on selectedOption if needed
  // For now, just use inputLink as-is (you can customize here)
  let urlToShorten = inputLink;

  try {
    const shortUrl = await shortenLink(urlToShorten);
    shortenedLink = shortUrl;
    shortenedLinkText.textContent = shortUrl;
    outputCode.textContent = shortUrl;
  } catch (err) {
    errorMessage.textContent = err.message;
  }
});

// URL validation helper
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Shorten URL using selected shortener
async function shortenLink(url) {
  try {
    // Add random query params to avoid caching issues
    const uniqueUrl = `${url}${url.includes("?") ? "&" : "?"}_t=${Date.now()}&_r=${Math.random().toString(36).substring(2, 8)}`;

    // CORS proxy to bypass CORS for testing — replace or remove in production
    const proxy = "https://cors-anywhere.herokuapp.com/";

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
    };

    const service = services[selectedShortener];
    if (!service) {
      throw new Error("Invalid shortener selected.");
    }

    const fetchOptions = {
      method: service.method,
      mode: "cors",
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        ...(service.headers || {}),
      },
    };

    if (service.body) {
      fetchOptions.body = service.body;
    }

    // Use proxy only for GET requests (to avoid CORS issues in browser)
    const fetchUrl = service.method === "GET" ? proxy + service.url : service.url;

    const response = await fetch(fetchUrl, fetchOptions);

    if (!response.ok) {
      throw new Error(`${service.name} API responded with status ${response.status}`);
    }

    let shortened;
    if (selectedShortener === "spoo") {
      const data = await response.json();
      shortened = data.short_url;
    } else {
      shortened = await response.text();
    }

    if (shortened && shortened.startsWith("http") && !shortened.toLowerCase().includes("error")) {
      return shortened.trim();
    } else {
      throw new Error(`${service.name} did not return a valid shortened URL.`);
    }
  } catch (error) {
    console.error(error);
    throw new Error(`${services[selectedShortener]?.name || "Selected shortener"} is currently unavailable. Please try another one.`);
  }
}
