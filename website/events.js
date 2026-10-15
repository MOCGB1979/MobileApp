// Renders upcoming events from data/events.json. Later this can point at the backend API instead.
(async () => {
  const list = document.getElementById("event-list");
  const empty = document.getElementById("events-empty");
  if (!list) return;

  const dateFmt = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  const today = new Date().toISOString().slice(0, 10);

  let events = [];
  try {
    const res = await fetch("data/events.json");
    if (!res.ok) throw new Error(res.status);
    events = (await res.json()).events
      .filter((e) => e.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date));
  } catch (err) {
    console.error("Couldn't load events", err);
  }

  if (!events.length) {
    empty.hidden = false;
    return;
  }

  for (const e of events) {
    const li = document.createElement("li");
    li.className = "event";

    const img = document.createElement("img");
    img.src = e.logo;
    img.alt = "";
    img.width = 64;
    img.height = 64;
    img.loading = "lazy";

    const body = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = e.title;
    const loc = document.createElement("p");
    loc.className = "event-location";
    loc.textContent = e.location;
    body.append(title, loc);

    const time = document.createElement("time");
    time.dateTime = e.date;
    time.textContent = dateFmt.format(new Date(e.date + "T12:00:00"));

    li.append(img, body, time);
    list.append(li);
  }
  list.hidden = false;
})();
