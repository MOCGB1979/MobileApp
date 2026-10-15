// Install support: registers the service worker and offers an "Install the app" button where the browser allows it.
if ("serviceWorker" in navigator) {
  addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(console.error));
}

(() => {
  const box = document.getElementById("install");
  if (!box) return;
  const button = document.getElementById("install-button");
  const hint = document.getElementById("install-hint");

  const installed = matchMedia("(display-mode: standalone)").matches || navigator.standalone;
  if (installed) return;

  // iPhone and iPad have no install prompt, so explain the Share menu instead
  const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (iOS) {
    hint.hidden = false;
    box.hidden = false;
    return;
  }

  let deferred;
  addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferred = event;
    button.hidden = false;
    box.hidden = false;
  });
  button.addEventListener("click", async () => {
    if (!deferred) return;
    deferred.prompt();
    await deferred.userChoice;
    deferred = null;
    box.hidden = true;
  });
  addEventListener("appinstalled", () => { box.hidden = true; });
})();
