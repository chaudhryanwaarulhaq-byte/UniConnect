/* =========================
   BASE API URLS (RELATIVE)
========================= */
const EVENTS_API = "/api/events";
const ANN_API = "/api/announcements";
const RES_API = "/api/resources";

/* =========================
   ADD EVENT
========================= */
const addEventForm = document.getElementById("addEventForm");

if (addEventForm) {
    addEventForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const title = document.getElementById("title").value;
        const description = document.getElementById("description").value;
        const event_date = document.getElementById("event_date").value;
        const message = document.getElementById("message");

        try {
            const res = await fetch(`${EVENTS_API}/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description, event_date })
            });

            if (res.ok) {
                message.innerText = "Event added successfully!";
                message.style.color = "green";
                addEventForm.reset();
            } else {
                message.innerText = "Failed to add event";
                message.style.color = "red";
            }
        } catch {
            message.innerText = "Server error";
            message.style.color = "red";
        }
    });
}

/* =========================
   LOAD EVENTS
========================= */
async function loadEvents() {
    const table = document.getElementById("eventsTable");
    if (!table) return;

    table.innerHTML = "";

    const res = await fetch(EVENTS_API);
    const events = await res.json();

    events.forEach(ev => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${ev.id}</td>
            <td>${ev.title}</td>
            <td>${ev.description}</td>
            <td>${ev.event_date.split("T")[0]}</td>
            <td>
                <button onclick="deleteEvent(${ev.id})">Delete</button>
            </td>
        `;
        table.appendChild(row);
    });
}

async function deleteEvent(id) {
    if (!confirm("Delete this event?")) return;
    await fetch(`${EVENTS_API}/delete/${id}`, { method: "DELETE" });
    loadEvents();
}

/* =========================
   ADD ANNOUNCEMENT
========================= */
const annForm = document.getElementById("announcementForm");

if (annForm) {
    annForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const title = document.getElementById("title").value;
        const message = document.getElementById("message").value;
        const status = document.getElementById("status");

        const res = await fetch(ANN_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, message })
        });

        if (res.ok) {
            status.innerText = "Announcement added successfully!";
            status.style.color = "green";
            annForm.reset();
        }
    });
}

/* =========================
   LOAD ANNOUNCEMENTS
========================= */
async function loadAnnouncements() {
    const table = document.getElementById("announcementsTable");
    if (!table) return;

    table.innerHTML = "";

    const res = await fetch(ANN_API);
    const anns = await res.json();

    anns.forEach(a => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${a.id}</td>
            <td>${a.title}</td>
            <td>${a.message}</td>
            <td>${a.created_at.split("T")[0]}</td>
            <td>
                <button onclick="deleteAnnouncement(${a.id})">Delete</button>
            </td>
        `;
        table.appendChild(row);
    });
}

async function deleteAnnouncement(id) {
    if (!confirm("Delete this announcement?")) return;
    await fetch(`${ANN_API}/${id}`, { method: "DELETE" });
    loadAnnouncements();
}

/* =========================
   ADD RESOURCE
========================= */
const resForm = document.getElementById("resourceForm");

if (resForm) {
    resForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const title = document.getElementById("title").value;
        const type = document.getElementById("type").value;
        const link = document.getElementById("link").value;
        const status = document.getElementById("status");

        const res = await fetch(RES_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, type, link })
        });

        if (res.ok) {
            status.innerText = "Resource added successfully!";
            status.style.color = "green";
            resForm.reset();
        }
    });
}

/* =========================
   LOAD RESOURCES
========================= */
async function loadResources() {
    const table = document.getElementById("resourcesTable");
    if (!table) return;

    table.innerHTML = "";

    const res = await fetch(RES_API);
    const resources = await res.json();

    resources.forEach(r => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${r.id}</td>
            <td>${r.title}</td>
            <td>${r.type}</td>
            <td><a href="${r.link}" target="_blank">Open</a></td>
            <td>${r.created_at.split("T")[0]}</td>
            <td>
                <button onclick="deleteResource(${r.id})">Delete</button>
            </td>
        `;
        table.appendChild(row);
    });
}

async function deleteResource(id) {
    if (!confirm("Delete this resource?")) return;
    await fetch(`${RES_API}/${id}`, { method: "DELETE" });
    loadResources();
}

/* =========================
   AUTO LOAD (SAFE)
========================= */
document.addEventListener("DOMContentLoaded", () => {
    loadEvents();
    loadAnnouncements();
    loadResources();
});
/* =========================
   DASHBOARD COUNTS
========================= */
async function loadDashboardStats() {
    try {
        const events = await fetch("/api/events").then(res => res.json());
        const anns = await fetch("/api/announcements").then(res => res.json());
        const resources = await fetch("/api/resources").then(res => res.json());

        const eventEl = document.getElementById("eventCount");
        const annEl = document.getElementById("announcementCount");
        const resEl = document.getElementById("resourceCount");

        if (eventEl) eventEl.innerText = events.length;
        if (annEl) annEl.innerText = anns.length;
        if (resEl) resEl.innerText = resources.length;
    } catch (err) {
        console.error("Dashboard stats error", err);
    }
}
document.addEventListener("DOMContentLoaded", () => {
    loadEvents();
    loadAnnouncements();
    loadResources();
    loadDashboardStats();
});

/* =========================
   DASHBOARD CHART
========================= */
async function loadDashboardChart() {
  const canvas = document.getElementById("statsChart");
  if (!canvas) return;

  const events = await fetch(EVENTS_API).then(res => res.json());
  const anns = await fetch(ANN_API).then(res => res.json());
  const resources = await fetch(RES_API).then(res => res.json());

  new Chart(canvas, {
    type: "bar",
    data: {
      labels: ["Events", "Announcements", "Resources"],
      datasets: [{
        label: "Total Count",
        data: [events.length, anns.length, resources.length],
        backgroundColor: ["#0d6efd", "#198754", "#fd7e14"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  });
}