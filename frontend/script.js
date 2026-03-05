/* =========================
   BASE API URLS
========================= */
const EVENTS_API = "/api/events";
const ANN_API = "/api/announcements";
const RES_API = "/api/resources";

/* =========================
   1. EVENTS LOGIC
========================= */
const eventForm = document.getElementById("addEventForm");
if (eventForm) {
    eventForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = {
            title: eventForm.querySelector("#title").value,
            description: eventForm.querySelector("#description").value,
            event_date: eventForm.querySelector("#event_date").value
        };
        const res = await fetch(`${EVENTS_API}/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        const msg = document.getElementById("message");
        if (res.ok) { msg.innerText = "✅ Event Added!"; eventForm.reset(); }
    });
}

/* =========================
   2. ANNOUNCEMENTS LOGIC
========================= */
const annForm = document.getElementById("announcementForm");
if (annForm) {
    annForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = {
            title: annForm.querySelector("#title").value,
            message: annForm.querySelector("#message").value
        };
        const res = await fetch(ANN_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        const status = document.getElementById("status");
        if (res.ok) { status.innerText = "✅ Announcement Added!"; annForm.reset(); }
    });
}

/* =========================
   3. RESOURCES LOGIC
========================= */
const resForm = document.getElementById("resourceForm");
if (resForm) {
    resForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = {
            title: resForm.querySelector("#title").value,
            type: resForm.querySelector("#type").value,
            link: resForm.querySelector("#link").value
        };
        const res = await fetch(RES_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        const status = document.getElementById("status");
        if (res.ok) { status.innerText = "✅ Resource Added!"; resForm.reset(); }
    });
}

/* =========================
   4. DATA LOADERS (Tables)
========================= */
async function loadAllData() {
    const evTable = document.getElementById("eventsTable");
    const annTable = document.getElementById("announcementsTable");
    const resTable = document.getElementById("resourcesTable");

    if (evTable) {
        const res = await fetch(EVENTS_API);
        const data = await res.json();
        evTable.innerHTML = data.map(ev => `<tr><td>${ev.id}</td><td>${ev.title}</td><td>${ev.description}</td><td>${ev.event_date.split('T')[0]}</td><td><button onclick="deleteData('${EVENTS_API}/delete', ${ev.id}, 'event')">Delete</button></td></tr>`).join("");
    }

    if (annTable) {
        const res = await fetch(ANN_API);
        const data = await res.json();
        annTable.innerHTML = data.map(a => `<tr><td>${a.id}</td><td>${a.title}</td><td>${a.message}</td><td>${a.created_at.split('T')[0]}</td><td><button onclick="deleteData('${ANN_API}', ${a.id}, 'ann')">Delete</button></td></tr>`).join("");
    }

    if (resTable) {
        const res = await fetch(RES_API);
        const data = await res.json();
        resTable.innerHTML = data.map(r => `<tr><td>${r.id}</td><td>${r.title}</td><td>${r.type}</td><td><a href="${r.link}" target="_blank">View</a></td><td>${r.created_at.split('T')[0]}</td><td><button onclick="deleteData('${RES_API}', ${r.id}, 'res')">Delete</button></td></tr>`).join("");
    }
}

/* =========================
   DASHBOARD STATS LOADER
========================= */
async function updateDashboardStats() {
    // Look for the elements on the page
    const eventEl = document.getElementById("eventCount");
    const annEl = document.getElementById("announcementCount");
    const resEl = document.getElementById("resourceCount");

    // If we aren't on the dashboard, don't run this
    if (!eventEl && !annEl && !resEl) return;

    try {
        // Fetch all data in parallel for speed
        const [eRes, aRes, rRes] = await Promise.all([
            fetch(EVENTS_API),
            fetch(ANN_API),
            fetch(RES_API)
        ]);

        const events = await eRes.json();
        const anns = await aRes.json();
        const resources = await rRes.json();

        // Update the HTML text
        if (eventEl) eventEl.innerText = events.length;
        if (annEl) annEl.innerText = anns.length;
        if (resEl) resEl.innerText = resources.length;
        
        console.log("Stats Updated:", { events: events.length, anns: anns.length, res: resources.length });
    } catch (err) {
        console.error("Failed to load dashboard stats:", err);
    }
}

// Ensure this runs when the page loads
document.addEventListener("DOMContentLoaded", () => {
    updateDashboardStats();
});

/* =========================
   5. DELETE HANDLER
========================= */
window.deleteData = async (url, id, type) => {
    if (!confirm("Confirm Delete?")) return;
    const fullUrl = type === 'event' ? `${url}/${id}` : `${url}/${id}`;
    await fetch(fullUrl, { method: "DELETE" });
    loadAllData();
};

document.addEventListener("DOMContentLoaded", loadAllData);