const STORAGE_API_BASE_KEY = "apiBaseUrl";
const DEFAULT_API_BASE_URL = "https://shop.lexicon.website";
export {};

const input = document.getElementById("apiBaseUrl") as HTMLInputElement | null;
const saveButton = document.getElementById("saveButton") as HTMLButtonElement | null;
const statusEl = document.getElementById("status");

async function loadSettings() {
  if (!input) return;
  const stored = await chrome.storage.sync.get(STORAGE_API_BASE_KEY);
  const value = stored[STORAGE_API_BASE_KEY];
  if (typeof value === "string") {
    input.value = value;
    return;
  }
  input.value = DEFAULT_API_BASE_URL;
}

function setStatus(message: string, isError = false) {
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.style.color = isError ? "#b91c1c" : "#166534";
}

saveButton?.addEventListener("click", async () => {
  if (!input) return;
  const rawValue = input.value.trim();
  if (!rawValue) {
    await chrome.storage.sync.remove(STORAGE_API_BASE_KEY);
    input.value = DEFAULT_API_BASE_URL;
    setStatus(`Cleared custom URL. Using default: ${DEFAULT_API_BASE_URL}`);
    return;
  }

  try {
    const url = new URL(rawValue);
    await chrome.storage.sync.set({ [STORAGE_API_BASE_KEY]: url.origin });
    setStatus(`Saved: ${url.origin}`);
  } catch {
    setStatus("Invalid URL. Example: https://your-app.com", true);
  }
});

void loadSettings();
