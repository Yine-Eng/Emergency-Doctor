"use strict";

/**
 * Handles the functionality of the mobile navigation menu in the Emergency Doctor web application.
 * This script enables the interactive elements of the mobile menu, allowing users to toggle
 * the visibility of the menu and potentially navigate to a sign-in page via a profile icon.
 */

document.addEventListener("DOMContentLoaded", () => {
    // Retrieve the DOM elements for the menu and profile icons.
    const menuIcon = document.getElementById("menu-icon");
    const mobileMenu = document.getElementById("mobile-menu");
    const profileIcon = document.getElementById("profile-icon");

    /**
     * Toggles the visibility of the mobile menu.
     * This function is triggered when the menu icon is clicked.
     * It adds or removes a 'visible' class that controls the display of the menu.
     */
    menuIcon.addEventListener("click", () => {
        mobileMenu.classList.toggle("visible");
    });

    /**
     * Placeholder for profile icon functionality.
     * Currently, this function does nothing but can be expanded to navigate
     * to a sign-in page or user profile page.
     */
    profileIcon.addEventListener("click", () => {
        // This line is commented out for future implementation.
        // window.location.href = "signin.html"; // Navigate to the sign-in page when implemented.
    });
});
