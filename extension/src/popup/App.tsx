function App() {
  const openOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  const openApp = () => {
    chrome.tabs.create({ url: "https://shop.lexicon.website/app" });
  };

  return (
    <div className="popup">
      <div className="popup-card">
        <h1 className="popup-title">Bookmark Tab Saver</h1>
        <p className="popup-text">
          Right-click any page or link and use the bookmark menu item to save it to your app
          account.
        </p>
        <p className="popup-text">Default app: shop.lexicon.website</p>
        <div className="popup-actions">
          <button type="button" onClick={openOptions} className="popup-button">
            Open Settings
          </button>
          <button type="button" onClick={openApp} className="popup-button">
            Open App
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
