document.addEventListener("DOMContentLoaded", function () {
    const monthData = {
       
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
            { x: 820, y: 300, type: "eye", name: "Md. Nijam Uddin", id: "26090132", accident: "Dust particle enter into the eye",status:"Minor"  },
            { x: 800, y: 100, type: "hand", name: "Md. Rasel", id: "26090047", accident: "Burn in hand while loading in heat treatment",status:"Minor"  }
        ],

        june: [
            
            { x: 770, y: 300, type: "foot", name: "Mohi Uddin", id: "26090169", accident: "Cylinder fell on foot during handling",status:"Minor"  },
            { x: 830, y: 290, type: "hand", name: "Md. Ibrahim", id: "26086006", accident: "Fingers get caught between two cylinders ",status:"Minor"  },
            { x: 930, y: 290, type: "hand", name: "Nur Uddin", id: "26090239", accident: "Fingers get caught between two cylinders ",status:"Minor"  },
            { x: 830, y: 135, type: "hand", name: "Shakil Hossain", id: "26070030", accident: "Got burn in hand while passing through hot cylinder",status:"Minor"},
            { x: 430, y: 135, type: "foot", name: "Md. Mofidul Islam", id: "26090060", accident: "Fell outside (Water Filter pump room) and sustained leg injury",status:"Moderate"},
        ],
    };

    let selectedMonth = "";  // Always start empty
    let heatmapVisible = false;

    // Ensure dropdown starts at default option
    document.getElementById("month").value = "";

    function updateMarkers() {
        const accidentData = monthData[selectedMonth];

        if (!accidentData || accidentData.length === 0) {
            alert("No data available for " + selectedMonth);
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

            marker.addEventListener("click", () => {
                const currentDisplay = tooltip.style.display;
                tooltip.style.display = currentDisplay === "block" ? "none" : "block";
            });
        });
    }
});
