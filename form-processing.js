"use strict";

/**
 * Handles the storage and retrieval of form data related to injury documentation within the Emergency Doctor app.
 * This script manages the interaction with IndexedDB for media files and localStorage for less bulky data.
 */

document.addEventListener("DOMContentLoaded", () => {
    /**
     * Retrieves an array of uploaded files stored globally.
     * @returns {Array} An array of uploaded files or an empty array if none.
     */
    function getUploadedFiles() {
        return window.uploadedFiles || [];
    }

    /**
     * Saves the injury data to both IndexedDB and localStorage for persistence across sessions.
     * @param {string} injuryType - The type of injury selected by the user.
     * @param {string} severityLevel - The severity level of the injury selected by the user.
     */
    const saveDataToIndexedDBAndLocalStorage = async (injuryType, severityLevel) => {
        const uploadedFiles = getUploadedFiles();
        console.log("Uploaded files in form-processing:", uploadedFiles);

        // Open IndexedDB and save media files.
        const db = await openIndexedDB();
        await saveMediaToIndexedDB(db, uploadedFiles);

        // Calculate severity percentage and corresponding color based on selected level.
        const severityPercent = {
            mild: "33%",
            moderate: "67%",
            severe: "100%"
        }[severityLevel] || "0%";

        const severityColor = {
            mild: "#4CAF50",
            moderate: "#FFEB3B",
            severe: "#F44336"
        }[severityLevel] || "transparent";

        // Prepare data object to be saved in localStorage.
        const injuryData = {
            name: document.getElementById("patient-name")?.value || "Your Name",
            age: document.getElementById("patient-age")?.value || "Your Age",
            contact: document.getElementById("patient-contact")?.value || "Your Contact",
            location: document.getElementById("patient-location")?.value || "",
            injuryType,
            severityPercent,
            severityColor,
            mediaCount: uploadedFiles.length // Stores count of media files for quick reference.
        };

        // Save data in localStorage for session persistence.
        localStorage.setItem("injuryData", JSON.stringify(injuryData));
    };

    /**
     * Opens a connection to IndexedDB, creating the database and object store if needed.
     * @returns {Promise<IDBDatabase>} A promise that resolves with the IndexedDB instance.
     */
    async function openIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open("EmergencyMediaDB", 1);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains("media")) {
                    db.createObjectStore("media", { autoIncrement: true });
                }
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Saves media files to the specified IndexedDB database.
     * @param {IDBDatabase} db - The database instance to use.
     * @param {Array} files - An array of file objects to be stored.
     * @returns {Promise<void>} A promise that resolves when all files are stored successfully.
     */
    async function saveMediaToIndexedDB(db, files) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction("media", "readwrite");
            const store = transaction.objectStore("media");
            files.forEach(file => store.add(file));
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        });
    }

    // Expose the main data-saving function to other scripts.
    window.saveDataToIndexedDBAndLocalStorage = saveDataToIndexedDBAndLocalStorage;
});
