"use strict";

/**
 * Script for handling the display and management of injury data on the PDF preview page.
 * This script fetches stored injury data from localStorage and IndexedDB, displays it appropriately,
 * and handles the dynamic loading and rendering of media files associated with the injury report.
 */

document.addEventListener("DOMContentLoaded", () => {
    // Retrieve stored injury data from localStorage
    const formData = JSON.parse(localStorage.getItem("injuryData")) || {};
    console.log("Retrieved formData:", formData);

    // DOM elements for displaying injury details
    const injuryTypeElement = document.getElementById("injury-type");
    const severityBar = document.getElementById("severity-bar");
    const severityLabel = document.createElement("p");
    const imagesContainer = document.getElementById("images-container");

    // Setting up the severity label within the severity bar
    severityLabel.id = "severity-label";
    severityBar.parentNode.insertBefore(severityLabel, severityBar.nextSibling);

    /**
     * Populates the UI with the injury type and severity level.
     */
    injuryTypeElement.textContent = formData.injuryType || "[No injury type selected]";
    severityBar.style.width = formData.severityPercent || "0%";
    severityBar.style.backgroundColor = formData.severityColor || "transparent";
    severityLabel.textContent = formData.severityPercent
        ? formData.severityPercent === "33%" ? "Mild"
        : formData.severityPercent === "67%" ? "Moderate"
        : "Severe"
        : "[No severity selected]";

    /**
     * Retrieves media files related to the injury from IndexedDB and initializes media previews.
     */
    const retrieveMediaFromIndexedDB = async () => {
        const db = await openIndexedDB();
        const mediaList = await fetchMediaFromIndexedDB(db);
        console.log("Retrieved media for preview:", mediaList);
        populateMediaPreviews(mediaList);
    };

    /**
     * Opens a connection to the IndexedDB.
     * @returns {Promise<IDBDatabase>} A promise that resolves with the IndexedDB instance.
     */
    async function openIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open("EmergencyMediaDB", 1);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Fetches all media items from the 'media' store in IndexedDB.
     * @param {IDBDatabase} db - The IndexedDB connection instance.
     * @returns {Promise<Array>} A promise that resolves with an array of media items.
     */
    async function fetchMediaFromIndexedDB(db) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction("media", "readonly");
            const store = transaction.objectStore("media");
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Creates and appends preview elements for each media item to the DOM.
     * @param {Array} mediaList - Array of media items containing type and data URL.
     */
    const populateMediaPreviews = (mediaList) => {
        if (!mediaList || mediaList.length === 0) {
            console.warn("No media to display.");
            return;
        }

        mediaList.forEach(({ type, data }) => {
            const previewElement = document.createElement("div");
            previewElement.classList.add("preview-item");

            if (type.startsWith("image")) {
                const img = document.createElement("img");
                img.src = data;
                img.alt = "Uploaded Image";
                img.classList.add("preview-image");
                previewElement.appendChild(img);
            } else if (type.startsWith("video")) {
                const video = document.createElement("video");
                video.src = data;
                video.controls = true;
                video.classList.add("preview-video");
                previewElement.appendChild(video);
            }

            imagesContainer.appendChild(previewElement);
        });
    };

    retrieveMediaFromIndexedDB();  // Initiate media retrieval on load
});
