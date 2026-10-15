// Theme switch: System (follows the device), Light or Dark. The choice is remembered on this device.
// The inline script in each page's <head> applies a saved choice before first paint, to avoid a flash.
(() => {
  const root = document.documentElement;
  const meta = document.querySelector('meta[name="theme-color"]');
  const darkQuery = matchMedia("(prefers-color-scheme: dark)");
  const buttons = document.querySelectorAll("[data-theme-choice]");

  const saved = () => { try { return localStorage.getItem("theme") || "system"; } catch { return "system"; } };

  function apply(choice) {
    if (choice === "light" || choice === "dark") root.dataset.theme = choice;
    else delete root.dataset.theme;
    const dark = choice === "dark" || (choice === "system" && darkQuery.matches);
    // Colours the phone's status bar to match the header
    if (meta) meta.content = dark ? "#161e33" : "#fafaf8";
    buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.themeChoice === choice)));
  }

  buttons.forEach((b) => b.addEventListener("click", () => {
    const choice = b.dataset.themeChoice;
    try {
      if (choice === "system") localStorage.removeItem("theme");
      else localStorage.setItem("theme", choice);
    } catch { /* storage blocked: still switch for this visit */ }
    apply(choice);
  }));

  darkQuery.addEventListener("change", () => apply(saved()));
  apply(saved());
})();
