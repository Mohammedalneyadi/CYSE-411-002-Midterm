// ============================================================
//  CYSE 411 – Mid-Term Exam V2  |  Q5 Starter File
//  Incident Tracker Application
// ============================================================


//  Application State

const ACCEPTED_SEVERITIES = ["low", "medium", "high", "critical"];
const ACCEPTED_FILTERS = ["all", "low", "medium", "high", "critical"];

// Current filter selection (set during state load, used on save)
let currentFilter = "all";



//  Q5.C  Dashboard State – Load
function loadDashboardState() {
    const raw = localStorage.getItem("dashboardState");

    try {
        const state = JSON.parse(raw);

        if (
            state &&
            typeof state.filter === "string" &&
            ACCEPTED_FILTERS.includes(state.filter)
        ) {
            currentFilter = state.filter;
        } else {
            currentFilter = "all";
        }
    } catch (e) {
        currentFilter = "all";
    }

    applyFilter(currentFilter);
}


//  Q5.C  Dashboard State – Save
function saveDashboardState() {
    const filterInput = document.getElementById("filter-select");
    const selectedFilter = filterInput.value;

    if (ACCEPTED_FILTERS.includes(selectedFilter)) {
        localStorage.setItem(
            "dashboardState",
            JSON.stringify({ filter: selectedFilter })
        );
        currentFilter = selectedFilter;
    } else {
        localStorage.setItem(
            "dashboardState",
            JSON.stringify({ filter: "all" })
        );
        currentFilter = "all";
    }
}



//  Q5.A  Fetch Incidents
async function fetchIncidents() {
    try {
        const res = await fetch("/api/incidents");

        if (!res.ok) {
            throw new Error("HTTP error: " + res.status);
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch incidents:", error);
        return [];
    }
}



//  Q5.B  Render Incidents
function renderIncidents(incidents) {
    const container = document.getElementById("incident-list");
    container.textContent = "";

    if (!Array.isArray(incidents)) {
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Unable to load incidents.";
        container.appendChild(errorMessage);
        return;
    }

    incidents.forEach(function (incident) {
        if (
            !incident ||
            typeof incident.title !== "string" ||
            incident.title.trim() === "" ||
            typeof incident.severity !== "string" ||
            !ACCEPTED_SEVERITIES.includes(incident.severity)
        ) {
            console.warn("Skipping invalid incident:", incident);
            return;
        }

        const item = document.createElement("li");

        const titleEl = document.createElement("strong");
        titleEl.textContent = incident.title.trim();

        const severityEl = document.createElement("span");
        severityEl.className = "severity severity-" + incident.severity;
        severityEl.textContent = incident.severity;

        item.appendChild(titleEl);
        item.appendChild(document.createTextNode(" "));
        item.appendChild(severityEl);

        container.appendChild(item);
    });
}



//  Filter Helper (provided – do not modify)
//  Hides/shows rendered items based on selected severity.

function applyFilter(filter) {
    const items = document.querySelectorAll("#incident-list li");
    items.forEach(function (item) {
        const badge = item.querySelector(".severity");
        if (!badge) return;
        const sev = badge.textContent.trim();
        item.style.display = (filter === "all" || sev === filter) ? "" : "none";
    });
    currentFilter = filter;
}



//  Application Bootstrap
//  Runs when the page finishes loading.

document.addEventListener("DOMContentLoaded", async function () {

    // Q5.C – Load saved filter state
    loadDashboardState();

    // Q5.A – Fetch incident data from the API
    const incidents = await fetchIncidents();

    // Q5.B – Render the incidents
    renderIncidents(incidents);

    // Re-apply loaded filter after rendering
    applyFilter(currentFilter);

    // Filter select change handler
    document.getElementById("filter-select").addEventListener("change", function () {
        const nextFilter = ACCEPTED_FILTERS.includes(this.value) ? this.value : "all";
        applyFilter(nextFilter);
        this.value = nextFilter;

        // Q5.C – Save the new filter choice
        saveDashboardState();
    });

});
