"use strict";

/**
 * Checks browser support for speech recognition and initializes functionality for recording,
 * processing, and managing speech input for a textarea in the Emergency Doctor application.
 * It allows users to input their notes via speech and processes the input for grammar, punctuation, 
 * and content filtering.
 */

// Verify browser support for SpeechRecognition API
if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
    alert("Speech recognition is not supported in your browser. Please use Chrome or Edge.");
}

document.addEventListener("DOMContentLoaded", () => {
    // Initialize DOM elements used for controlling recording and displaying text
    const microphoneIcon = document.getElementById("microphone-icon");
    const pauseIcon = document.getElementById("pause-icon");
    const stopIcon = document.getElementById("stop-icon");
    const additionalNotes = document.getElementById("additional_notes");
    additionalNotes.classList.add("scrollable"); // Ensure the textarea can scroll

    // Maintain state of recording to manage user interactions
    let isRecording = false;
    let isPaused = false;
    let recognition;
    let transcripts = []; // Array to store final text from speech recognition
    let manualProcessed = false; // Flag to check if manually entered text has been processed

    // Define configuration for processing text
    const config = {
        offensiveWords: [
            "fuck", "fucking", "shit", "damn", "bitch", "asshole",
            "bastard", "crap", "stupid", "fool", "foolish", "idiot",
            "crazy", "imbecile", "bullshit"
        ],
        questionWords: [
            "who", "what", "where", "when", "why", "how", "is", "are",
            "can", "should", "would", "will", "did", "do"
        ],
        exclamatoryWords: [
            "wow", "amazing", "incredible", "unbelievable", "astonishing",
            "fantastic", "great", "awesome"
        ]
    };

    // Regular expression to identify offensive words and censor them
    const offensiveWordsRegex = new RegExp(`\\b(${config.offensiveWords.join('|')})\\b`, "gi");

    /**
     * Censors offensive words by replacing inner characters with asterisks.
     * @param {string} text - The input text to censor.
     * @returns {string} - The censored text.
     */
    const censorOffensiveWords = (text) => text.replace(offensiveWordsRegex, (match) => 
        match[0] + "*".repeat(match.length - 2) + match[match.length - 1]);

    /**
     * Capitalizes the first letter of each sentence for proper grammar.
     * @param {string} text - The input text to capitalize.
     * @returns {string} - The text with sentences capitalized.
     */
    const capitalizeSentences = (text) => text.replace(/(?:^|\. |\! |\? )([a-z])/g, (match) => match.toUpperCase());

    /**
     * Adds punctuation to sentences based on the content and common indicators of questions or exclamations.
     * @param {string} text - The input text to punctuate.
     * @returns {string} - The text with appropriate punctuation added.
     */
    const applyPunctuation = (text) => {
        const sentence = text.trim();
        if (config.questionWords.some(word => sentence.toLowerCase().startsWith(word))) return sentence + "?";
        if (config.exclamatoryWords.some(word => sentence.toLowerCase().includes(word))) return sentence + "!";
        return sentence + ".";
    };

    /**
     * Adjusts the height of the textarea dynamically to fit the content.
     * @param {HTMLElement} textarea - The textarea to adjust.
     */
    const adjustTextareaHeight = (textarea) => {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
    };

    /**
     * Updates the word and character count displayed below the textarea.
     */
    const updateWordCount = () => {
        const maxCharacters = 5000;
        const currentCharacters = additionalNotes.value.length;
        const wordCountDisplay = document.getElementById("word-count");
        if (wordCountDisplay) {
            wordCountDisplay.textContent = `${currentCharacters}/${maxCharacters} characters`;
            wordCountDisplay.style.color = currentCharacters > maxCharacters ? "red" : "#424242";
        }
        additionalNotes.style.color = currentCharacters > maxCharacters ? "red" : "";
    };

    /**
     * Processes and adds manually entered text to the textarea, applying censorship and capitalization.
     */
    const processExistingText = () => {
        if (!manualProcessed) {
            let text = additionalNotes.value.trim();
            text = censorOffensiveWords(text);
            text = capitalizeSentences(text);
            if (!/[.?!]$/.test(text)) {
                text += ".";
            }
            additionalNotes.value = text + " ";
            manualProcessed = true;
        }
    };

    /**
     * Updates icon titles dynamically based on the current recording state to inform the user of available actions.
     */
    const updateIconTitles = () => {
        if (!isRecording) {
            microphoneIcon.title = "Click to start recording";
            pauseIcon.title = "";
            stopIcon.title = "";
        } else if (isPaused) {
            microphoneIcon.title = "";
            pauseIcon.title = "Recording paused. Click to continue.";
            stopIcon.title = "Click to stop recording";
        } else {
            microphoneIcon.title = "";
            pauseIcon.title = "Click to pause recording";
            stopIcon.title = "Click to stop recording";
        }
    };

    /**
     * Event listener for manual input to sanitize and process text as the user types, ensuring only clean text is accepted.
     */
    additionalNotes.addEventListener("input", (e) => {
        additionalNotes.value = e.target.value.replace(/<[^>]*>?/gm, ""); // Sanitize input
        adjustTextareaHeight(e.target);
        updateWordCount();
        manualProcessed = false; // Reset flag to allow reprocessing
    });

    // Initial setup: adjust textarea height, update word count, and set icon tooltips
    adjustTextareaHeight(additionalNotes);
    updateWordCount();
    updateIconTitles();

    /**
     * Scrolls to the bottom of the textarea whenever new content is added to ensure visibility of the latest text.
     */
    const scrollToBottom = () => {
        additionalNotes.scrollTop = additionalNotes.scrollHeight;
    };

    /**
     * Prevents form submission if the character limit is exceeded, providing user feedback to reduce their input.
     */
    document.querySelector("form").addEventListener("submit", (e) => {
        const maxCharacters = 5000;
        if (additionalNotes.value.length > maxCharacters) {
            e.preventDefault();
            alert("Character limit exceeded. Please reduce your input.");
            additionalNotes.focus();
        }
    });

    /**
     * Initializes and manages the speech recognition process, including starting, pausing, and stopping recording.
     */
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = true; // Set continuous mode
        recognition.interimResults = true; // Set interimResults to true to handle real-time processing
        recognition.lang = "en-US"; // Set the language to US English

        /**
         * Starts the speech recognition service, processing any existing text first.
         */
        const startRecording = () => {
            if (!isRecording) {
                processExistingText(); // Process any manually entered text before starting recording
            }
            isRecording = true;
            isPaused = false;
            microphoneIcon.style.display = "none";
            pauseIcon.style.display = "inline";
            stopIcon.style.display = "inline";
            recognition.start(); // Start the speech recognition
            updateIconTitles(); // Update icons to reflect the recording state
        };

        /**
         * Pauses or resumes the recording based on the current state.
         */
        const pauseRecording = () => {
            isPaused = !isPaused;
            if (isPaused) {
                recognition.stop(); // Stop recognition to pause
                pauseIcon.classList.replace("fa-pause", "fa-play");
            } else {
                recognition.start(); // Start recognition to resume
                pauseIcon.classList.replace("fa-play", "fa-pause");
            }
            updateIconTitles(); // Update icons to reflect the paused or resumed state
        };

        /**
         * Stops the recording and resets the interface elements.
         */
        const stopRecording = () => {
            isRecording = false;
            isPaused = false;
            microphoneIcon.style.display = "inline";
            pauseIcon.style.display = "none";
            stopIcon.style.display = "none";
            recognition.stop(); // Stop the speech recognition
            updateIconTitles(); // Update icons to reflect the stopped state
        };

        /**
         * Processes the results from the speech recognition and updates the textarea.
         * Finalized transcripts are processed for punctuation, capitalization, and filtering before being displayed.
         */
        recognition.onresult = (event) => {
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    const processedSentence = capitalizeSentences(censorOffensiveWords(applyPunctuation(result[0].transcript.trim())));
                    transcripts.push(processedSentence); // Add processed sentence to transcripts
                }
            }

            // Combine all transcripts and update the textarea
            const combinedTranscript = transcripts.join(" ");
            additionalNotes.value = additionalNotes.value.trim() + " " + combinedTranscript;
            transcripts = []; // Clear transcripts after updating

            adjustTextareaHeight(additionalNotes); // Adjust textarea height to fit new content
            scrollToBottom(); // Scroll to the bottom to show latest text
            updateWordCount(); // Update word count after adding new text
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error); // Log any errors for debugging
            stopRecording(); // Stop recording on error
        };

        // Event listeners for recording controls
        microphoneIcon.addEventListener("click", () => !isRecording && startRecording());
        pauseIcon.addEventListener("click", () => isRecording && pauseRecording());
        stopIcon.addEventListener("click", () => isRecording && stopRecording());
    } else {
        alert("Your browser does not support speech recognition. Please try a different browser."); // Alert if browser does not support speech recognition
    }
});
