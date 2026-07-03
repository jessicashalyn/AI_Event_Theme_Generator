function getCSRFToken() {
    return document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute("content");
}

const generateBtn = document.getElementById("generateBtn");
const downloadBtn = document.getElementById("downloadBtn");
const copyBtn = document.getElementById("copyBtn");
const resetBtn = document.getElementById("resetBtn");

const eventNameInput = document.getElementById("eventName");
const eventThemeInput = document.getElementById("eventTheme");

const loading = document.getElementById("loading");
const result = document.getElementById("result");

generateBtn.addEventListener("click", async () => {

    const eventName = eventNameInput.value.trim();
    const eventTheme = eventThemeInput.value.trim();

    if (!eventName || !eventTheme) {
        alert("Please Enter Event Name & Theme");
        return;
    }

    loading.style.display = "block";
    result.innerHTML = "";

    try {

        const response = await fetch("/generate/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCSRFToken()
            },
            body: JSON.stringify({
                event_name: eventName,
                theme: eventTheme
            })
        });

        const data = await response.json();

        loading.style.display = "none";

        if (!data.success) {
            result.innerHTML = `
                <div class="card">
                    <h3>❌ Error</h3>
                    <p>${data.error}</p>
                </div>
            `;
            return;
        }

        let output;

        try {
            output = JSON.parse(data.output);
        } catch (err) {

            result.innerHTML = `
                <div class="card">
                    <h3>⚠ Invalid JSON Returned</h3>
                    <pre>${data.output}</pre>
                </div>
            `;
            return;
        }

        localStorage.setItem("eventData", JSON.stringify(output));

        let timelineHTML = "";

        (output.timeline || []).forEach(item => {

            if (typeof item === "object") {

                const key = Object.keys(item)[0];

                timelineHTML += `
                    <p><strong>${key}</strong> : ${item[key]}</p>
                `;

            } else {

                timelineHTML += `
                    <p>${item}</p>
                `;
            }

        });

        result.innerHTML = `

        <div class="card">
            <h3>🎉 Event Title</h3>
            <p>${output.event_title || ""}</p>
        </div>

        <div class="card">
            <h3>🎨 Decorations</h3>
            <ul>
                ${(output.decorations || []).map(i => `<li>${i}</li>`).join("")}
            </ul>
        </div>

        <div class="card">
            <h3>🎯 Activities</h3>
            <ul>
                ${(output.activities || []).map(i => `<li>${i}</li>`).join("")}
            </ul>
        </div>

        <div class="card">
            <h3>🖼️ Poster Content</h3>
            <p>${output.poster_content || ""}</p>
        </div>

        <div class="card">
            <h3>✨ Tagline</h3>
            <p>${output.tagline || ""}</p>
        </div>

        <div class="card">
            <h3>💰 Budget</h3>
            <p>${output.budget || ""}</p>
        </div>

        <div class="card">
            <h3>📅 Timeline</h3>
            ${timelineHTML}
        </div>

        <div class="card">
            <h3>✅ Checklist</h3>
            <ul>
                ${(output.checklist || []).map(i => `<li>${i}</li>`).join("")}
            </ul>
        </div>

        `;

    } catch (err) {

        loading.style.display = "none";

        result.innerHTML = `
            <div class="card">
                <h3>⚠ Connection Error</h3>
                <p>${err}</p>
            </div>
        `;

        console.error(err);
    }

});  

// ========================
// DOWNLOAD PDF
// ========================

downloadBtn.addEventListener("click", async () => {

    const currentData = JSON.parse(localStorage.getItem("eventData"));

    if (!currentData) {
        alert("No data to download!");
        return;
    }

    try {

        const response = await fetch("/download-pdf/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCSRFToken()
            },
            body: JSON.stringify(currentData)
        });

        if (!response.ok) {
            alert("PDF Generation Failed!");
            return;
        }

        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "event_plan.pdf";

        document.body.appendChild(a);
        a.click();

        a.remove();

        window.URL.revokeObjectURL(url);

    } catch (err) {

        console.error(err);
        alert("Unable to download PDF.");

    }

});


// ========================
// COPY TO CLIPBOARD
// ========================

copyBtn.addEventListener("click", async () => {

    const currentData = JSON.parse(localStorage.getItem("eventData"));

    if (!currentData) {
        alert("No data to copy.");
        return;
    }

    let timelineText = "";

    (currentData.timeline || []).forEach(item => {

        if (typeof item === "object") {

            const key = Object.keys(item)[0];
            timelineText += `${key}: ${item[key]}\n`;

        } else {

            timelineText += `${item}\n`;

        }

    });

    const text = `
==========================
AI EVENT PLAN
==========================

🎉 EVENT TITLE
${currentData.event_title || ""}

--------------------------

🎨 DECORATIONS
${(currentData.decorations || []).join("\n")}

--------------------------

🎯 ACTIVITIES
${(currentData.activities || []).join("\n")}

--------------------------

🖼️ POSTER CONTENT
${currentData.poster_content || ""}

--------------------------

✨ TAGLINE
${currentData.tagline || ""}

--------------------------

💰 BUDGET
${currentData.budget || ""}

--------------------------

📅 TIMELINE
${timelineText}

--------------------------

✅ CHECKLIST
${(currentData.checklist || []).join("\n")}

==========================
`;

    try {

        await navigator.clipboard.writeText(text);

        alert("✅ Copied Successfully!");

    } catch (err) {

        console.error(err);
        alert("❌ Copy Failed!");

    }

});


// ========================
// RESET
// ========================

resetBtn.addEventListener("click", () => {

    eventNameInput.value = "";
    eventThemeInput.value = "";

    result.innerHTML = "";

    localStorage.removeItem("eventData");

    loading.style.display = "none";

    alert("Form Reset Successfully!");

});