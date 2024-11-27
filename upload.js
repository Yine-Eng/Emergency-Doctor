"use strict";

/**
 * Initializes the file upload functionality for images and videos, providing a preview
 * and managing the uploaded files within specified limits.
 */
document.addEventListener("DOMContentLoaded", () => {
    const uploadIcon = document.querySelector('.upload-photo-icon');
    const fileInput = document.createElement('input');
    const previewContainer = document.createElement('div');
    const maxFilesMessage = document.createElement('p');

    const MAX_FILES = 6;  // Maximum number of files allowed to upload
    const MAX_TOTAL_SIZE_MB = 25;  // Maximum total size of files in megabytes
    const allowedExtensions = ["image/jpeg", "image/png", "video/mp4"];  // Supported file types
    const maxBytes = MAX_TOTAL_SIZE_MB * 1024 * 1024;  // Convert max size to bytes

    window.uploadedFiles = [];  // Global array to keep track of uploaded files
    let totalSize = 0;  // Total size of uploaded files in bytes

    fileInput.type = 'file';
    fileInput.accept = allowedExtensions.join(", ");
    fileInput.multiple = true;
    fileInput.style.display = 'none';  // Hide file input element

    previewContainer.classList.add("preview-container", "scrollable");
    maxFilesMessage.classList.add("max-files-message");
    maxFilesMessage.style.display = "none";

    uploadIcon.insertAdjacentElement("afterend", previewContainer);
    uploadIcon.insertAdjacentElement("afterend", maxFilesMessage);

    /**
     * Updates the text message indicating the number of files uploaded and remaining allowance.
     */
    function updateMaxFilesMessage() {
        const remainingFiles = MAX_FILES - window.uploadedFiles.length;
        maxFilesMessage.textContent = `Files uploaded: ${window.uploadedFiles.length}/${MAX_FILES}. You can add ${remainingFiles} more file(s).`;
        maxFilesMessage.style.display = "block";
    }

    /**
     * Clears the current selection in the file input to allow new file selections.
     */
    function resetFileInput() {
        fileInput.value = "";  // Clear the file input to allow new selections
    }

    /**
     * Shows the file input dialog when the upload icon is clicked and checks for the file limit.
     */
    uploadIcon.addEventListener("click", () => {
        if (window.uploadedFiles.length < MAX_FILES) {
            fileInput.click();
        } else {
            alert(`You have already uploaded the maximum number of ${MAX_FILES} files.`);
        }
    });

    /**
     * Handles file selections and validations for file type and size.
     */
    fileInput.addEventListener("change", async () => {
        const files = Array.from(fileInput.files);

        for (let file of files) {
            if (!allowedExtensions.includes(file.type)) {
                alert(`Only JPEG, PNG, and MP4 formats are supported.`);
                continue;
            }

            if (totalSize + file.size > maxBytes) {
                alert("Total file size exceeds 25MB. Remove some files to add more.");
                break;
            }

            if (window.uploadedFiles.length >= MAX_FILES) {
                alert(`You can upload a maximum of ${MAX_FILES} files.`);
                break;
            }

            const reader = new FileReader();
            reader.onload = () => {
                window.uploadedFiles.push({ type: file.type, data: reader.result });
                totalSize += file.size;

                const previewElement = createPreviewElement(file, reader.result);
                previewContainer.appendChild(previewElement);
                updateMaxFilesMessage();
            };

            reader.readAsDataURL(file);
        }

        if (window.uploadedFiles.length >= MAX_FILES) {
            uploadIcon.style.display = "none";
        }

        updateMaxFilesMessage();
        resetFileInput();
    });

    /**
     * Creates a preview element for the uploaded file.
     *
     * @param {File} file - The file object from the file input.
     * @param {string} dataUrl - The base64 encoded URL of the file.
     * @returns {HTMLElement} - The preview element with the file content and a remove button.
     */
    function createPreviewElement(file, dataUrl) {
        const previewElement = document.createElement('div');
        previewElement.classList.add("preview-item");

        const removeButton = document.createElement('span');
        removeButton.innerText = 'x';
        removeButton.classList.add("remove-button");
        removeButton.title = "Remove this item";

        if (file.type.startsWith("image/")) {
            const img = document.createElement('img');
            img.src = dataUrl;
            img.classList.add("preview-image");
            previewElement.appendChild(img);
        } else if (file.type.startsWith("video")) {
            const video = document.createElement('video');
            video.src = dataUrl;
            video.controls = true;
            video.classList.add("preview-video");
            previewElement.appendChild(video);
        }

        previewElement.appendChild(removeButton);

        removeButton.addEventListener("click", () => {
            removeFile(file, previewElement);
        });

        return previewElement;
    }

    /**
     * Removes a file from the uploaded files list and updates the UI.
     *
     * @param {File} file - The file object to be removed.
     * @param {HTMLElement} previewElement - The preview element corresponding to the file.
     */
    function removeFile(file, previewElement) {
        totalSize -= file.size;
        const index = window.uploadedFiles.findIndex(f => f.data === reader.result);
        if (index > -1) window.uploadedFiles.splice(index, 1);
        previewElement.remove();

        if (window.uploadedFiles.length < MAX_FILES) {
            uploadIcon.style.display = "flex";
        }

        updateMaxFilesMessage();
    }

    // Initialize the file count message
    updateMaxFilesMessage();
});
