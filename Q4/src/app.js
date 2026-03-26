// ============================================================
//  CYSE 411 Q4 Starter Code
//  Employee Directory Application
// ============================================================

function loadSession() {
    const raw = sessionStorage.getItem("session");

    try {
        const session = JSON.parse(raw);

        // make sure required fields exist and are valid
        if (
            !session ||
            typeof session.userId !== "string" || session.userId.trim() === "" ||
            typeof session.role !== "string" || session.role.trim() === "" ||
            typeof session.displayName !== "string" || session.displayName.trim() === ""
        ) {
            return null;
        }

        // return cleaned values
        return {
            userId: session.userId.trim(),
            role: session.role.trim(),
            displayName: session.displayName.trim()
        };

    } catch (e) {
        // if JSON is broken or tampered
        return null;
    }
}


// Q4.A – Safe Status Message Rendering
function renderStatusMessage(containerElement, message) {
    const p = document.createElement("p");

    // display message as plain text (prevents XSS)
    p.textContent = message;

    // clear old content and add safe content
    containerElement.textContent = "";
    containerElement.appendChild(p);
}


// Q4.B – Search Input Sanitization
function sanitizeSearchQuery(input) {

    // remove leading/trailing spaces
    const trimmed = input.trim();

    // allow only letters, numbers, spaces, hyphens, underscores
    const cleaned = trimmed.replace(/[^A-Za-z0-9 _-]/g, "");

    // limit to 40 characters
    const limited = cleaned.slice(0, 40);

    // return null if empty after cleaning
    if (limited.length === 0) {
        return null;
    }

    return limited;
}

function performSearch(query) {
    const sanitized = sanitizeSearchQuery(query);
    const label = document.getElementById("search-label");

    // safe output (no innerHTML)
    label.textContent = "Showing results for: " + (sanitized || "");
}


// Application Bootstrap
document.addEventListener("DOMContentLoaded", function () {

    // load session
    const session = loadSession();
    if (session) {
        document.getElementById("welcome-msg").textContent =
            "Welcome, " + session.displayName;
    }

    // sample profiles
    const simulatedProfiles = [
        {
            name: "Alice Johnson",
            department: "Engineering",
            status: "Working from home today"
        },
        {
            name: "Bob Martinez",
            department: "Security",
            // should NOT execute after fix
            status: "<img src=x onerror=\"alert('XSS: session stolen')\">"
        },
        {
            name: "Carol Lee",
            department: "HR",
            status: "Out of office until Friday"
        }
    ];

    const directory = document.getElementById("directory");

    simulatedProfiles.forEach(function (profile) {
        const card = document.createElement("div");
        card.className = "profile-card";

        const nameEl = document.createElement("h3");
        nameEl.textContent = profile.name;

        const deptEl = document.createElement("p");
        deptEl.textContent = "Department: " + profile.department;

        const statusContainer = document.createElement("div");
        statusContainer.className = "status";

        // safe rendering
        renderStatusMessage(statusContainer, profile.status);

        card.appendChild(nameEl);
        card.appendChild(deptEl);
        card.appendChild(statusContainer);
        directory.appendChild(card);
    });

    // search button
    document.getElementById("search-btn").addEventListener("click", function () {
        const query = document.getElementById("search-input").value;
        performSearch(query);
    });

});
