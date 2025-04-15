const pdfSelect = document.getElementById("pdf-select");
const viewerContainer = document.getElementById("viewer-container");

// Function to dynamically load the correct version
function loadViewer() {
    let selectedValue = pdfSelect.value; // Get the selected training material
    let screenWidth = window.innerWidth; // Get screen width

    let fileType = screenWidth > 768 ? "pdf" : "html"; // Choose file type based on screen size
    let filePath = `${selectedValue}.${fileType}`; // Construct file path

    // Remove any existing iframe
    viewerContainer.innerHTML = "";

    // Create a new iframe
    let iframe = document.createElement("iframe");
    iframe.src = filePath;
    iframe.width = "100%";
    iframe.height = screenWidth > 768 ? "500px" : "800px"; // Adjust height for screens
    iframe.style.border = "none";

    viewerContainer.appendChild(iframe); // Add iframe to container
}

// Load viewer initially when the page loads
loadViewer();

// Reload viewer when selection changes
pdfSelect.addEventListener("change", loadViewer);

// Reload viewer when screen resizes (useful for switching between mobile and desktop views)
window.addEventListener("resize", loadViewer);
