"use strict";

/**
 * Manages interactive functionalities on the human body diagram within the Emergency Doctor app.
 * This script adds dynamic interactions to the SVG body parts, enabling users to select areas,
 * display tooltips, and visually indicate selected regions.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Select all SVG paths representing body parts on both front and back diagrams.
    const bodyParts = document.querySelectorAll('#front_body path, #back_body path');
    const tooltip = document.getElementById('tooltip'); // Tooltip element for displaying part names.

    // Add event listeners to each body part for interaction.
    bodyParts.forEach(part => {
        /**
         * Enhance the title attribute for accessibility and set up the tooltip.
         * The tooltip shows a user-friendly name for each body part.
         */
        const partName = part.id.replace('-', ' ').toUpperCase(); // Format body part IDs to readable text.

        /**
         * Displays a tooltip with the body part name when the user hovers over a part.
         */
        part.addEventListener('mouseenter', function(event) {
            tooltip.style.display = 'block'; // Show the tooltip.
            tooltip.innerHTML = partName; // Set the tooltip content to the part name.
            if (!this.classList.contains('selected')) {
                this.style.fill = "rgba(255, 0, 0, 0.3)"; // Apply lighter red fill if not selected.
            }
        });

        /**
         * Adjusts the tooltip's position to follow the cursor within the viewport.
         */
        part.addEventListener('mousemove', function(event) {
            tooltip.style.left = `${event.pageX + 10}px`; // Position horizontally with offset.
            tooltip.style.top = `${event.pageY + 10}px`; // Position vertically with offset.
        });

        /**
         * Hides the tooltip and resets the body part color when the mouse leaves.
         */
        part.addEventListener('mouseleave', function() {
            tooltip.style.display = 'none'; // Hide the tooltip.
            if (!this.classList.contains('selected')) {
                this.style.fill = "transparent"; // Reset fill if not selected.
            }
        });

        /**
         * Toggles the selection state of a body part when clicked, changing its appearance.
         */
        part.addEventListener('click', function() {
            this.classList.toggle('selected'); // Toggle the 'selected' class to mark or unmark the part.
            this.style.fill = this.classList.contains('selected') ? "#FF0000" : "transparent"; // Change fill based on selection.
        });
    });
});
