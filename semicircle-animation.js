"use strict";

/**
 * This script manages the animation and visibility handling of semicircle sections on the home page.
 * It swaps semicircles every 3.5 seconds unless paused, and checks for the visibility of the home section
 * to control the animation based on user's viewport.
 */
document.addEventListener("DOMContentLoaded", () => {
    const semicircle1 = document.getElementById('semicircle1');
    const semicircle2 = document.getElementById('semicircle2');
    const homeSection = document.getElementById('home');
    const semicircles = document.querySelectorAll('.semicircle');
    let isPaused = false; // Flag to control the swapping when the user interacts
    let intervalId; // Reference for the interval to clear it later if needed

    /**
     * Starts the automatic swapping of semicircles.
     */
    const startSwapping = () => {
        intervalId = setInterval(() => {
            if (!isPaused) {
                if (semicircle1.classList.contains('semicircle')) {
                    // Swapping semicircle1 to semicircle2
                    semicircle1.classList.remove('semicircle');
                    semicircle1.id = 'semicircle2';
                    semicircle2.id = 'semicircle1';
                    semicircle2.classList.add('semicircle');
                } else {
                    // Reverting the swap
                    semicircle1.classList.add('semicircle');
                    semicircle1.id = 'semicircle1';
                    semicircle2.id = 'semicircle2';
                    semicircle2.classList.remove('semicircle');
                }
            }
        }, 3500); // The interval is set to 3.5 seconds
    };

    /**
     * Pauses the swapping when user hovers over a semicircle.
     */
    const pauseSwapping = () => { 
        isPaused = true; 
    };

    /**
     * Resumes the swapping when the mouse leaves a semicircle.
     */
    const resumeSwapping = () => { 
        isPaused = false; 
    };

    // Event listeners to pause and resume swapping on mouse interactions
    semicircles.forEach((semicircle) => {
        semicircle.addEventListener('mouseenter', pauseSwapping);
        semicircle.addEventListener('mouseleave', resumeSwapping);
    });

    /**
     * Checks the visibility of the home section to pause the animation when less than 30% visible.
     */
    const checkHomeSectionVisibility = () => {
        const rect = homeSection.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        // Calculates visible height of the home section
        const visibleHeight = Math.max(0, Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0));
        // Determines the percentage of visibility
        const visiblePercentage = (visibleHeight / rect.height) * 100;
        // Pauses if less than 30% of the home section is visible
        isPaused = visiblePercentage < 30;
    };

    startSwapping(); // Initiate the swapping on load
    // Checks visibility on scroll and resize to adjust the animation
    window.addEventListener('scroll', checkHomeSectionVisibility);
    window.addEventListener('resize', checkHomeSectionVisibility);
});
