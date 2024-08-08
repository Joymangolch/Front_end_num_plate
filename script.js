// JavaScript to handle parking slots, live camera feed, and modal form

// Parking Slots Initialization
const parkingSlots = [];

// Generate parking slots dynamically
for (let i = 0; i < 20; i++) { // Adjust the number of slots to 20
    const slot = document.createElement("div");
    slot.className = "parking-slot empty";
    slot.textContent = `Slot ${i + 1}`;
    parkingSlots.push({ element: slot, state: "empty", details: null });
    document.querySelector(".parking-lot").appendChild(slot);
}

// Modal Elements
const modal = document.getElementById("slotModal");
const modalTitle = document.getElementById("modalTitle");
const closeModal = document.getElementsByClassName("close")[0];
const slotForm = document.getElementById("slotForm");
const slotDetails = document.getElementById("detectionResult");

// Function to update the slot display and detection results
function updateSlotDisplay() {
    parkingSlots.forEach((slot, index) => {
        if (slot.state === "empty") {
            slot.element.classList.add("empty");
            slot.element.classList.remove("occupied");
            slot.element.textContent = `Slot ${index + 1}`;
        } else {
            slot.element.classList.add("occupied");
            slot.element.classList.remove("empty");
            slot.element.textContent = `Slot ${index + 1} - Parked`;
        }
    });
    updateDetectionResult(); // Update detection result after slot status change
}

// Function to update detection result
function updateDetectionResult() {
    let availableSlots = '';
    parkingSlots.forEach((slot, index) => {
        if (slot.state === "empty") {
            availableSlots += `<button class="slot-button available">Slot ${index + 1} is available</button>`;
        } else {
            availableSlots += `<button class="slot-button occupied">Slot ${index + 1} is not available</button>`;
        }
    });
    slotDetails.innerHTML = availableSlots;
}

// Add event listeners to detect parking events
parkingSlots.forEach((slot, index) => {
    slot.element.addEventListener("click", () => {
        if (slot.state === "empty") {
            modalTitle.textContent = `Park Vehicle in Slot ${index + 1}`;
            slotForm.onsubmit = function (event) {
                event.preventDefault();
                slot.state = "occupied";
                slot.details = {
                    licensePlate: document.getElementById("licensePlate").value,
                    driverName: document.getElementById("driverName").value,
                    contactNumber: document.getElementById("contactNumber").value,
                };
                updateSlotDisplay(); // Update slot display and detection results
                modal.style.display = "none";
            };
            modal.style.display = "block";
        } else {
            // Confirmation to free up the slot
            modalTitle.textContent = `Free Slot ${index + 1}`;
            slotForm.onsubmit = function (event) {
                event.preventDefault();
                const confirmation = confirm("Do you want to clear this slot?");
                if (confirmation) {
                    slot.state = "empty";
                    slot.details = null;
                    updateSlotDisplay(); // Update slot display and detection results
                    modal.style.display = "none";
                }
            };
            modal.style.display = "block";
        }
    });
});

// Close the modal when the user clicks on <span> (x)
closeModal.onclick = function() {
    modal.style.display = "none";
}

// Close the modal when the user clicks anywhere outside of the modal
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Clear form inputs when modal is closed
modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        slotForm.reset();
    }
});

// Live Camera Feed Initialization
const video = document.getElementById('videoFeed');
navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
        video.srcObject = stream;
    })
    .catch((err) => {
        console.error("Error accessing webcam: ", err);
    });

// Initial update
updateSlotDisplay();
