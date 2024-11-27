"use strict";

/**
 * This script manages the interactions within the form part of the Emergency Doctor application.
 * It includes dynamic form elements, form validation, and submission handling.
 */
document.addEventListener("DOMContentLoaded", () => {
    // Grab all the checkbox inputs within the injury checkbox group
    const injuryTypeCheckboxes = document.querySelectorAll('#injury-checkbox-group input[type="checkbox"]');
    const otherCheckbox = document.querySelector('#injury-checkbox-group input[value="other"]');
    const otherInputField = document.createElement('input');
    const severityRadios = document.querySelectorAll('input[name="severity-level"]');
    const submitButton = document.getElementById("submitbutton");

    // Create and configure the "Other" text input field for specifying other injury types
    otherInputField.setAttribute('type', 'text');
    otherInputField.setAttribute('id', 'otherInput');
    otherInputField.setAttribute('placeholder', 'Please specify');
    otherInputField.style.display = 'none'; // Initially hidden
    otherCheckbox.parentNode.appendChild(otherInputField);

    // Event listener to toggle the visibility of the "Other" input field
    otherCheckbox.addEventListener('change', () => {
        if (otherCheckbox.checked) {
            otherInputField.style.display = 'block';
            otherInputField.focus(); // Focus on the input field when shown
        } else {
            otherInputField.style.display = 'none';
            otherInputField.value = ''; // Clear the value when unchecked
        }
    });

    /**
     * Validates the form inputs collected from the user.
     * Checks for selected injury types and severity, and handles the "Other" injury type specifically.
     * Returns an object containing any validation errors and the validated data.
     */
    const validateForm = () => {
        const errors = [];
        let selectedInjuryTypes = Array.from(injuryTypeCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        // Handle the 'Other' checkbox input validation
        if (otherCheckbox.checked) {
            const otherValue = otherInputField.value.trim();
            if (!otherValue) {
                errors.push("Please specify the type of injury for 'Other'.");
            } else {
                selectedInjuryTypes = selectedInjuryTypes.map(type =>
                    type === "other" ? `Other - ${otherValue}` : type
                );
            }
        }

        if (selectedInjuryTypes.length === 0) {
            errors.push("Please select at least one injury type.");
        }

        const selectedSeverity = Array.from(severityRadios).find(radio => radio.checked)?.value;
        if (!selectedSeverity) {
            errors.push("Please select a severity level.");
        }

        return { errors, selectedInjuryTypes: selectedInjuryTypes.join(", "), selectedSeverity };
    };

    /**
     * Event handler for the form submission button.
     * It prevents the default form submission, validates the form, and handles data storage.
     */
    submitButton.addEventListener("click", async (e) => {
        e.preventDefault();
        const { errors, selectedInjuryTypes, selectedSeverity } = validateForm();

        if (errors.length > 0) {
            alert(errors.join("\n")); // Display all validation errors as a single alert.
        } else {
            // Proceed with saving the validated data if there are no errors.
            await saveDataToIndexedDBAndLocalStorage(selectedInjuryTypes, selectedSeverity);
            alert("Form submitted successfully!");
            window.location.href = "pdf-preview.html"; // Redirect to PDF preview page on successful submission.
        }
    });
});
