document.addEventListener("DOMContentLoaded", function () {
    // Accident data for each month
    const monthData = {
        january: [
            { x: 800, y: 100, type: "foot", name: "Shakil", id: "12345", accident: "👣" },
            { x: 400, y: 150, type: "hand", name: "Michael Smith", id: "54321", accident: "Hand Injury ✋" }
        ],
        february: [
            { x: 800, y: 290, type: "foot", name: "Shakil Ahammod", id: "26086005", accident: "👣" },
            { x: 200, y: 220, type: "eye", name: "Masum", id: "67890", accident: "Hand Injury ✋" },
            { x: 600, y: 300, type: "foot", name: "Md. Ibrahim", id: "26086006", accident: "👣" }
        ],
        march: [
            { x: 690, y: 165, type: "hand", name: "Md.Rofiqul Islam", id: "26063010", accident: "Small Cut While Handling Cylinder",status:"Minor" },
            { x: 800, y: 100, type: "foot", name: "Choton Borua", id: "26090195", accident: "Hit By A Cylinder by Another Worker",status:"Minor"  },
            { x: 800, y: 300, type: "foot", name: "Sadek Ali", id: "", accident: "Hit By A Cylinder ",status:"Minor"  },
            { x: 600, y: 300, type: "foot", name: "Md. Kawser Rahman", id: "26090256", accident: "Hit By A Cylinder by Another Worker",status:"Minor"  }
        ],
        may: [
            { x: 690, y: 190, type: "eye", name: "Md. Billal Mia", id: "26090203", accident: "burned color waste (heat treatment) enter into the eye",status:"Minor" },
            { x: 550, y: 450, type: "hand", name: "Mohi Uddin", id: "26090169", accident: "Hit By A Cylinder by Another Worker",status:"Minor"  },
            { x: 950, y: 300, type: "foot", name: "Md. Jahed Hasan", id: "26086002", accident: "Hit By A Cylinder ",status:"Minor"  },
            { x: 820, y: 300, type: "eye", name: "Md. Najam Uddin", id: "26090132", accident: "Dust particle enter into the eye",status:"Minor"  },
            { x: 800, y: 100, type: "hand", name: "Md. Rasel", id: "26090047", accident: "Burn in hand while loading in heat treatment",status:"Minor"  }
        ],
    };

    // Retrieve selected month from localStorage or default to January
    let selectedMonth = localStorage.getItem("selectedMonth") || "january";
    let heatmapVisible = false;

    // Set the dropdown to the saved value
    document.getElementById("month").value = selectedMonth;

    // Function to update displayed markers
    function updateMarkers() {
        const accidentData = monthData[selectedMonth];

        if (!accidentData || accidentData.length === 0) {
            alert("No data available for " + selectedMonth);
            return;
        }

        clearMarkersAndTooltips();
        displayMarkers(accidentData);
    }

    // Event listener for selecting a month
    document.getElementById("month").addEventListener("change", function () {
        selectedMonth = document.getElementById("month").value;
        localStorage.setItem("selectedMonth", selectedMonth); // Save selected month
        updateMarkers(); // Update markers when a month is selected
    });

    // Event listener for toggling the heatmap
    document.getElementById("toggleHeatmap").addEventListener("click", function () {
        if (!heatmapVisible) {
            heatmapVisible = true;
            const allAccidentData = Object.values(monthData).flat(); // Aggregate all months' data
            generateHeatmap(allAccidentData);
        } else {
            heatmapVisible = false;
            clearHeatmap();
            updateMarkers(); // Restore markers for selected month
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
        clearHeatmap(); // Remove previous heatmap before adding a new one

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
        const innerRadius = 10, outerRadius = 40; // Increased radius for better visualization
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
            markerImage.src = `icons/${accident.type}.png`;
            markerImage.alt = accident.accident;
            marker.appendChild(markerImage);
            imageContainer.appendChild(marker);

            const tooltip = document.createElement("div");
            tooltip.classList.add("tooltip");
            tooltip.style.top = `${markerY + 30}px`;
            tooltip.style.left = `${markerX}px`;
            tooltip.innerHTML = `<b>Name:</b> ${accident.name} <br><b>ID:</b> ${accident.id} <br><b>Accident:</b> ${accident.accident} <br><b>Status:</b> ${accident.status}`;
            imageContainer.appendChild(tooltip);

            // Add click event to toggle tooltip visibility
            marker.addEventListener("click", () => {
                const currentDisplay = tooltip.style.display;
                tooltip.style.display = currentDisplay === "block" ? "none" : "block";
            });
        });
    }
});
