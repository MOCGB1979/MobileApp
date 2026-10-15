// Home page behaviour: next event, and the nearest-meeting finder.
// Data comes from data/*.json for now; the backend can serve the same shapes later.

const $ = (id) => document.getElementById(id);
const today = new Date().toISOString().slice(0, 10);

function el(tag, props = {}, ...children) {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...children.filter((c) => c != null && c !== false));
  return node;
}

async function getJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  return res.json();
}

/* ---------- Events ---------- */

const dayFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric" });
const fullFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });
const toDate = (iso) => new Date(iso + "T12:00:00");

function dateRange(start, end) {
  const s = toDate(start);
  if (!end || end === start) return fullFmt.format(s);
  const e = toDate(end);
  const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
  return sameMonth ? `${dayFmt.format(s)}–${fullFmt.format(e)}` : `${fullFmt.format(s)} – ${fullFmt.format(e)}`;
}

function eventTime(e) {
  return el("time", { dateTime: e.start, textContent: dateRange(e.start, e.end) });
}

async function loadEvents() {
  const box = $("next-event");
  let events = [];
  try {
    events = (await getJSON("data/events.json")).events
      .filter((e) => (e.end || e.start) >= today)
      .sort((a, b) => a.start.localeCompare(b.start));
  } catch (err) {
    console.error(err);
    box.append(el("p", { className: "empty", textContent: "Events couldn't be loaded. See the full list on mocgb.net." }));
    return;
  }

  if (!events.length) {
    box.append(el("p", { className: "empty", textContent: "No events are listed right now. Check mocgb.net for new dates." }));
    return;
  }

  const [next, ...rest] = events;
  box.append(
    el("img", { src: next.logo, alt: "", loading: "eager", className: "next-event-img" }),
    el("div", { className: "next-event-body" },
      eventTime(next),
      el("h3", { textContent: next.title }),
      el("p", { className: "event-location", textContent: next.location }),
      next.note && el("p", { className: "event-note", textContent: next.note }),
      el("a", { className: "button", href: next.url, textContent: "Event details" })
    )
  );

  if (rest.length) {
    const list = $("more-events");
    for (const e of rest) {
      list.append(el("li", { className: "event" },
        el("img", { src: e.logo, alt: "", width: 64, height: 64, loading: "lazy" }),
        el("div", {},
          el("h4", {}, el("a", { href: e.url, textContent: e.title })),
          el("p", { className: "event-location", textContent: e.location })
        ),
        eventTime(e)
      ));
    }
    list.hidden = false;
    $("more-events-title").hidden = false;
  }
}

/* ---------- Area meetings ---------- */

let areas = [];

function miles(lat1, lng1, lat2, lng2) {
  const r = (d) => (d * Math.PI) / 180;
  const a = Math.sin(r(lat2 - lat1) / 2) ** 2 +
    Math.cos(r(lat1)) * Math.cos(r(lat2)) * Math.sin(r(lng2 - lng1) / 2) ** 2;
  return 3958.8 * 2 * Math.asin(Math.sqrt(a));
}

function areaItem(a, distance) {
  const where = a.venue
    ? (a.postcode ? `${a.venue}, ${a.postcode}` : a.venue)
    : "Venue not listed. Ask the area contact.";
  return el("li", { className: "area" },
    el("div", { className: "area-head" },
      el("h3", { textContent: a.name }),
      distance != null && el("span", { className: "distance", textContent: `${Math.round(distance)} miles` })
    ),
    el("p", { className: "area-where", textContent: where }),
    a.when && el("p", { className: "area-when", textContent: a.when }),
    el("p", { className: "area-links" },
      el("a", { href: `mailto:${a.email}`, textContent: `Email ${a.contact}` }),
      el("a", { href: a.facebook, textContent: "Facebook group" })
    )
  );
}

function showNearest(lat, lng, label) {
  const ranked = areas
    .filter((a) => a.lat != null)
    .map((a) => ({ a, d: miles(lat, lng, a.lat, a.lng) }))
    .sort((x, y) => x.d - y.d)
    .slice(0, 3);
  const list = $("nearest-areas");
  list.replaceChildren(...ranked.map(({ a, d }) => areaItem(a, a.approx ? null : d)));
  list.hidden = false;
  $("finder-status").textContent = `Closest areas to ${label}.`;
  list.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "nearest" });
}

async function lookupPostcode(raw) {
  const pc = raw.trim().replace(/\s+/g, " ").toUpperCase();
  if (!pc) throw new Error("Enter a postcode, or just the first part like MK45.");
  // postcodes.io has no usable coordinates for the Crown Dependencies, so place them directly
  const island = { JE: [49.19, -2.11], GY: [49.45, -2.54], IM: [54.15, -4.48] }[pc.slice(0, 2)];
  if (island && /^(JE|GY|IM)\d/.test(pc)) return { lat: island[0], lng: island[1], label: pc };
  const inUK = (r) => r?.latitude >= 49 && r.latitude <= 61 && r.longitude >= -9 && r.longitude <= 2;
  // Full postcode first, then the outward part (e.g. "MK45") on its own
  for (const path of [`postcodes/${encodeURIComponent(pc)}`, `outcodes/${encodeURIComponent(pc.split(" ")[0])}`]) {
    const res = await fetch(`https://api.postcodes.io/${path}`);
    if (res.ok) {
      const { result } = await res.json();
      if (inUK(result)) return { lat: result.latitude, lng: result.longitude, label: pc };
    }
  }
  throw new Error(`We couldn't find ${pc}. Check it and try again.`);
}

async function loadAreas() {
  try {
    areas = (await getJSON("data/areas.json")).areas;
  } catch (err) {
    console.error(err);
    $("finder-status").textContent = "Meetings couldn't be loaded. See the list on mocgb.net.";
    return;
  }
  $("all-areas").replaceChildren(...areas.map((a) => areaItem(a)));

  const status = $("finder-status");
  const locBtn = $("use-location");
  if (!("geolocation" in navigator)) locBtn.hidden = true;

  locBtn.addEventListener("click", () => {
    status.textContent = "Finding your location…";
    navigator.geolocation.getCurrentPosition(
      (pos) => showNearest(pos.coords.latitude, pos.coords.longitude, "your location"),
      () => { status.textContent = "Location isn't available. Enter a postcode instead."; $("postcode").focus(); },
      { maximumAge: 600000, timeout: 10000 }
    );
  });

  $("postcode-form").addEventListener("submit", async (ev) => {
    ev.preventDefault();
    status.textContent = "Looking up postcode…";
    try {
      const { lat, lng, label } = await lookupPostcode($("postcode").value);
      showNearest(lat, lng, label);
    } catch (err) {
      status.textContent = err instanceof TypeError
        ? "Postcode lookup isn't available right now. Try again, or browse all areas below."
        : err.message;
    }
  });
}

loadEvents();
loadAreas();
