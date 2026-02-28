/* =========================
   API URLS
========================= */
const EVENTS_API = "http://localhost:3000/api/events";
const ANN_API = "http://localhost:3000/api/announcements";
const RES_API = "http://localhost:3000/api/resources";

/* =========================
   LOAD EVENTS
========================= */
async function loadEvents() {
    const table = document.getElementById("eventsTable");
    if (!table) return;

    table.innerHTML = "";
    const res = await fetch(EVENTS_API);
    const events = await res.json();

    events.forEach(e => {
        const dateOnly = e.event_date.split("T")[0];
        table.innerHTML += `
            <tr>
                <td>${e.id}</td>
                <td>${e.title}</td>
                <td>${e.description}</td>
                <td>${dateOnly}</td>
            </tr>
        `;
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
    const announcements = await res.json();

    announcements.forEach(a => {
        const dateOnly = a.created_at.split("T")[0];
        table.innerHTML += `
            <tr>
                <td>${a.id}</td>
                <td>
                    <input id="ann-title-${a.id}" value="${a.title}">
                </td>
                <td>
                    <input id="ann-msg-${a.id}" value="${a.message}">
                </td>
                <td>${dateOnly}</td>
                <td>
                    <button onclick="updateAnnouncement(${a.id})">Edit</button>
                    <button onclick="deleteAnnouncement(${a.id})">Delete</button>
                </td>
            </tr>
        `;
    });
}

async function updateAnnouncement(id) {
    const title = document.getElementById(`ann-title-${id}`).value;
    const message = document.getElementById(`ann-msg-${id}`).value;

    await fetch(`${ANN_API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, message })
    });

    alert("Announcement updated");
    loadAnnouncements();
}

async function deleteAnnouncement(id) {
    if (!confirm("Delete announcement?")) return;

    await fetch(`${ANN_API}/${id}`, { method: "DELETE" });
    loadAnnouncements();
}

/* =========================
   LOAD RESOURCES (🔥 FIXED)
========================= */
async function loadResources() {
    const table = document.getElementById("resourcesTable");
    if (!table) return;

    table.innerHTML = "";
    const res = await fetch(RES_API);
    const resources = await res.json();

    resources.forEach(r => {
        const dateOnly = r.created_at.split("T")[0];
        table.innerHTML += `
            <tr>
                <td>${r.id}</td>
                <td><input id="res-title-${r.id}" value="${r.title}"></td>
                <td><input id="res-type-${r.id}" value="${r.type}"></td>
                <td><input id="res-link-${r.id}" value="${r.link}"></td>
                <td>${dateOnly}</td>
                <td>
                    <button onclick="updateResource(${r.id})">Edit</button>
                    <button onclick="deleteResource(${r.id})">Delete</button>
                </td>
            </tr>
        `;
    });
}

async function updateResource(id) {
    const title = document.getElementById(`res-title-${id}`).value;
    const type = document.getElementById(`res-type-${id}`).value;
    const link = document.getElementById(`res-link-${id}`).value;

    await fetch(`${RES_API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, type, link })
    });

    alert("Resource updated");
    loadResources();
}

async function deleteResource(id) {
    if (!confirm("Delete resource?")) return;

    await fetch(`${RES_API}/${id}`, { method: "DELETE" });
    loadResources();
}

/* =========================
   ADD RESOURCE
========================= */
const resourceForm = document.getElementById("resourceForm");

if (resourceForm) {
    resourceForm.addEventListener("submit", async e => {
        e.preventDefault();

        const title = document.getElementById("title").value;
        const type = document.getElementById("type").value;
        const link = document.getElementById("link").value;
        const status = document.getElementById("status");

        await fetch(RES_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, type, link })
        });

        status.style.color = "green";
        status.innerText = "Resource added successfully!";
        resourceForm.reset();
    });
}

/* =========================
   SINGLE SAFE PAGE LOAD
========================= */
document.addEventListener("DOMContentLoaded", () => {
    loadEvents();
    loadAnnouncements();
    loadResources();
});