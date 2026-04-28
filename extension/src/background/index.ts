const MENU_SAVE_PAGE = "bookmark-save-page";
const MENU_SAVE_LINK = "bookmark-save-link";
const STORAGE_API_BASE_KEY = "apiBaseUrl";
const DEFAULT_API_BASE_URL = "https://shop.lexicon.website";
export {};

function createMenus() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: MENU_SAVE_PAGE,
      title: "Save this tab",
      contexts: ["page"],
    });

    chrome.contextMenus.create({
      id: MENU_SAVE_LINK,
      title: "Bookmark this link",
      contexts: ["link"],
    });
  });
}

function notify(message: string) {
  console.log(`[bookmark-extension] ${message}`);
  chrome.action.setBadgeText({ text: "OK" }).catch(() => undefined);
  chrome.action.setBadgeBackgroundColor({ color: "#16a34a" }).catch(() => undefined);
  setTimeout(() => {
    chrome.action.setBadgeText({ text: "" }).catch(() => undefined);
  }, 1500);
}

async function getStoredApiBaseUrl(): Promise<string> {
  const stored = await chrome.storage.sync.get(STORAGE_API_BASE_KEY);
  const value = stored[STORAGE_API_BASE_KEY];
  return typeof value === "string" && value.length > 0 ? value : DEFAULT_API_BASE_URL;
}

async function saveToAppBookmarkApi(input: { apiBaseUrl: string; url: string; title: string }) {
  const normalizedBaseUrl = input.apiBaseUrl.replace(/\/+$/, "");
  const endpoint = `${normalizedBaseUrl}/api/bookmarks`;
  const response = await fetch(endpoint, {
    method: "POST",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      url: input.url,
      note: "",
      title: input.title,
    }),
  });

  if (!response.ok) {
    const bodyText = await response.text().catch(() => "");
    throw new Error(`Bookmark API failed at ${endpoint} (${response.status}): ${bodyText}`);
  }
}

chrome.runtime.onInstalled.addListener(createMenus);
chrome.runtime.onStartup.addListener(createMenus);

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  try {
    const targetUrl = info.menuItemId === MENU_SAVE_LINK ? info.linkUrl : tab?.url;
    if (!targetUrl) return;

    const apiBaseUrl = await getStoredApiBaseUrl();

    if (info.menuItemId === MENU_SAVE_LINK && info.linkUrl) {
      await saveToAppBookmarkApi({
        apiBaseUrl,
        url: info.linkUrl,
        title: info.selectionText || info.linkUrl,
      });
      notify("Link saved to your account.");
      return;
    }

    if (info.menuItemId === MENU_SAVE_PAGE) {
      const pageUrl = tab?.url;
      if (!pageUrl) return;
      const pageTitle = tab.title || pageUrl;
      await saveToAppBookmarkApi({
        apiBaseUrl,
        url: pageUrl,
        title: pageTitle,
      });
      notify("Tab saved to your account.");
    }
  } catch (error) {
    console.error("[bookmark-extension] Failed to save bookmark", error);
    notify("Save failed. Open your app and log in on this browser.");
  }
});
