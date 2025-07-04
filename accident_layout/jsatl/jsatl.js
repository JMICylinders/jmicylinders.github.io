document.addEventListener("DOMContentLoaded", function () {
    const monthData = {
        january: [],
        february: [],
        march: [],
        may: [
            { x: 70, y: 350, type: "hand", name: "Sowkat Hossain Rabbi", id: "26081032", accident: "Struck by hammer by mistake", status: "Minor" },
            { x: 70, y: 315, type: "hand", name: "Md. Rabby Sarder", id: "26081014", accident: "Hit By A Cylinder ", status: "Minor" },
            { x: 495, y: 100, type: "hand", name: "Md. Nasim Hossain", id: "26090110", accident: "Got scratch while tighting a screw ", status: "Minor" },
        ],
        june: [
            { x: 90, y: 150, type: "hand", name: "Mohammad Mobarak Hossen", id: "26084025", accident: "Abrasion in left hand while passing by scrap", status: "Minor" },
            
        ],
    };

    let selectedMonth = ""; // Start with no month selected
    let heatmapVisible = false;

    // Set dropdown to default empty option
    document.getElementById("month").value = "";

    function updateMarkers() {
        const accidentData = monthData[selectedMonth];

        if (!accidentData || accidentData.length === 0) {
            alert("No data available for " + selectedMonth);
            clearMarkersAndTooltips();
            return;
        }

        clearMarkersAndTooltips();
        displayMarkers(accidentData);
    }

    document.getElementById("month").addEventListener("change", function () {
        selectedMonth = document.getElementById("month").value;
        if (selectedMonth !== "") {
            updateMarkers();
        } else {
            clearMarkersAndTooltips();
            clearHeatmap();
        }
    });

    document.getElementById("toggleHeatmap").addEventListener("click", function () {
        if (!heatmapVisible) {
            heatmapVisible = true;
            const allAccidentData = Object.values(monthData).flat();
            generateHeatmap(allAccidentData);
        } else {
            heatmapVisible = false;
            clearHeatmap();
            if (selectedMonth !== "") updateMarkers();
        }
    });

    function clearMarkersAndTooltips() {
        document.querySelectorAll(".marker, .tooltip").forEach(el => el.remove());
    }

    function clearHeatmap() {
        const heatmapCanvas = document.querySelector(".heatmap-canvas");
        if (heatmapCanvas) heatmapCanvas.remove();
    }

    function generateHeatmap(accidentData) {
        const imageContainer = document.querySelector(".image-container");
        clearHeatmap();

        const canvas = document.createElement("canvas");
        canvas.width = imageContainer.clientWidth;
        canvas.height = imageContainer.clientHeight;
        canvas.classList.add("heatmap-canvas");
        imageContainer.appendChild(canvas);
        const ctx = canvas.getContext("2d");

        const containerWidth = imageContainer.clientWidth;
        const containerHeight = imageContainer.clientHeight;

        accidentData.forEach(accident => {
            const scaledX = (accident.x / 1000) * containerWidth;
            const scaledY = (accident.y / 500) * containerHeight;
            drawHeatSpot(ctx, scaledX, scaledY);
        });
    }

    function drawHeatSpot(ctx, x, y) {
        const innerRadius = 10, outerRadius = 40;
        const gradient = ctx.createRadialGradient(x, y, innerRadius, x, y, outerRadius);
        gradient.addColorStop(0, "rgba(255, 0, 0, 0.5)");
        gradient.addColorStop(0.5, "rgba(255, 0, 0, 0.1)");
        gradient.addColorStop(1, "rgba(255, 0, 0, 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, outerRadius, 0, Math.PI * 2);
        ctx.fill();
    }

    function displayMarkers(accidentData) {
        const imageContainer = document.querySelector(".image-container");
        const containerWidth = imageContainer.clientWidth;
        const containerHeight = imageContainer.clientHeight;

        accidentData.forEach(accident => {
            const marker = document.createElement("div");
            marker.classList.add("marker");

            const markerX = (accident.x / 1000) * containerWidth;
            const markerY = (accident.y / 500) * containerHeight;

            marker.style.top = `${markerY}px`;
            marker.style.left = `${markerX}px`;

            const markerImage = document.createElement("img");
            markerImage.src = `../icons/${accident.type}.png`;
            markerImage.alt = accident.accident;
            marker.appendChild(markerImage);
            imageContainer.appendChild(marker);

            const tooltip = document.createElement("div");
            tooltip.classList.add("tooltip");
            tooltip.style.top = `${markerY + 30}px`;
            tooltip.style.left = `${markerX}px`;
            tooltip.innerHTML = `<b>Name:</b> ${accident.name} <br><b>ID:</b> ${accident.id} <br><b>Accident:</b> ${accident.accident} <br><b>Status:</b> ${accident.status}`;
            imageContainer.appendChild(tooltip);

            marker.addEventListener("click", () => {
                const currentDisplay = tooltip.style.display;
                tooltip.style.display = currentDisplay === "block" ? "none" : "block";
            });
        });
    }
});
