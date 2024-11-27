"use strict";

/**
 * This script manages the navigation and UI interactions for the Emergency Doctor web application.
 * It handles the visibility and transitions between different sections of the application,
 * such as home, gender selection, injury selection, and document preparation.
 */

document.addEventListener("DOMContentLoaded", () => {
    // DOM elements representing different sections of the application
    const homeSection = document.getElementById("home");
    const genderSelectPopup = document.getElementById("gender_select");
    const dashboardSection = document.getElementById("dashboard");
    const injurySelectionSection = document.getElementById("injury_selection");
    const injuryDocumentSection = document.getElementById("injurydocument");
    const navbar = document.querySelector("nav");
    const overlay = document.getElementById("overlay");

    // Interactive elements within the application
    const animateButton2 = document.getElementById("animate_button2");
    const backToGenderButton = document.getElementById("back_to_gender");
    const nextToInjuryDocumentButton = document.getElementById("next_to_injury_document");
    const backButtonInInjuryDocument = document.getElementById("backbutton");
    const closeIcon = document.getElementById("close");
    const maleItem = document.getElementById("male");
    const femaleItem = document.getElementById("female");

    // Default setting for selected gender
    let selectedGender = "male";

    // Initial visibility settings for each section
    homeSection.style.display = "block";
    genderSelectPopup.style.display = "none";
    dashboardSection.style.display = "none";
    injurySelectionSection.style.display = "none";
    injuryDocumentSection.style.display = "none";
    navbar.style.display = "flex";  // Navbar is always visible

    /**
     * Displays the overlay screen.
     */
    const showOverlay = () => {
        overlay.style.display = "block";
    };

    /**
     * Hides the overlay screen.
     */
    const hideOverlay = () => {
        overlay.style.display = "none";
    };

    /**
     * Displays the gender selection popup and sets the correct display states
     * for related UI sections.
     */
    const showGenderSelectPopup = () => {
        homeSection.style.display = "none";
        genderSelectPopup.style.display = "flex";
        dashboardSection.style.display = "block";
        injurySelectionSection.style.display = "block";
        showOverlay();
    };

    /**
     * Handles the gender selection and transitions to the injury selection section.
     * @param {string} gender - The gender selected by the user.
     */
    const handleGenderSelection = (gender) => {
        selectedGender = gender;
        setBodyImages(gender);
        genderSelectPopup.style.display = "none";
        injurySelectionSection.style.display = "block";
        hideOverlay();
        injurySelectionSection.scrollIntoView({ behavior: "smooth" });
    };

    /**
     * Sets the body images based on the selected gender.
     * @param {string} gender - The gender selected by the user.
     */
    const setBodyImages = (gender) => {
        const frontImg = gender === "male" ? "trace-guide/man_front.svg" : "trace-guide/woman_front.svg";
        const backImg = gender === "male" ? "trace-guide/man_back.svg" : "trace-guide/woman_back.svg";
        document.querySelector(".front-view img").src = frontImg;
        document.querySelector(".back-view img").src = backImg;
    };

    /**
     * Transitions the UI to show the injury document section.
     */
    const showInjuryDocumentSection = () => {
        injurySelectionSection.style.display = "none";
        injuryDocumentSection.style.display = "flex";
        showOverlay();
    };

    /**
     * Handles the navigation back to the injury selection from the injury document section.
     */
    const backToInjurySelection = () => {
        injuryDocumentSection.style.display = "none";
        injurySelectionSection.style.display = "block";
        hideOverlay();
        injurySelectionSection.scrollIntoView({ behavior: "smooth" });
    };

    // Event listeners for UI interactions
    animateButton2.addEventListener("click", showGenderSelectPopup);
    maleItem.addEventListener("click", () => handleGenderSelection("male"));
    femaleItem.addEventListener("click", () => handleGenderSelection("female"));
    closeIcon.addEventListener("click", () => handleGenderSelection("male"));  // Default reset to male on close
    backToGenderButton.addEventListener("click", backToInjurySelection);
    nextToInjuryDocumentButton.addEventListener("click", (e) => {
        e.preventDefault();
        showInjuryDocumentSection();
    });
    backButtonInInjuryDocument.addEventListener("click", (e) => {
        e.preventDefault();
        backToInjurySelection();
    });
});
