console.log('Script starting...');

// Wait for the webpage to fully load before running any code
document.addEventListener('DOMContentLoaded', () => {
    // Find important elements on the webpage by their CSS classes
    // Think of these like grabbing specific LEGO pieces you need
    const body = document.querySelector('body');                   // The whole webpage
    const fingerprint = document.querySelector('.fingerprint');    // The fingerprint icon
    const center = document.querySelector('.center');             // The center container
    const errorMessage = document.querySelector('.error-message'); // Where we show error messages

    // Create two flags (like on/off switches) to track:
    // 1. If an animation is currently playing
    // 2. If this device can do fingerprint scanning
    let isAnimating = false;
    let isBiometricsSupported = false;

    // This function shows error messages on the screen
    // It's like a digital Post-it note
    function showError(message) {
        errorMessage.textContent = message;        // Write the message
        errorMessage.classList.add('show');        // Make it visible
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 3000);
    }

    // This function checks if the device can do fingerprint scanning
    // It's like checking if your phone has a fingerprint sensor
    async function checkBiometricSupport() {
        // First, check if the browser knows what fingerprint scanning is
        if (!window.PublicKeyCredential) {
            showError("Biometric authentication not supported in this browser (No WebAuthn)");
            return false;
        }
        
        try {
            // Ask the device: "Hey, do you have a fingerprint scanner?"
            const isAvailable = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
            
            if (!isAvailable) {
                showError("No biometric sensor found on this device");
                return false;
            }
            
            // If we get here, the device can do fingerprint scanning!
            showError("Biometric authentication is available! ✅");
            return true;
        } catch (error) {
            // If anything goes wrong, show the error
            showError("Error checking biometric support: " + error.message);
            return false;
        }
    }

    // This function handles when authentication succeeds
    // It's like showing a green checkmark ✅
    function onSuccess() {
        fingerprint.classList.remove('active');    // Stop the scanning animation
        center.classList.add('success');           // Show the success animation
        setTimeout(() => {
            center.classList.remove('success');    // After 3 seconds, reset everything
            isAnimating = false;
        }, 3000);
    }

    // This function handles when authentication fails
    // It's like showing a red X ❌
    function onFailure() {
        fingerprint.classList.remove('active');    // Stop the scanning animation
        center.classList.add('failure');           // Show the failure animation
        setTimeout(() => {
            center.classList.remove('failure');    // After 1 second, reset everything
            isAnimating = false;
        }, 1000);
    }

    // This function runs when someone clicks to authenticate
    // It's like pressing your finger on a phone's scanner
    async function triggerBiometricAuth(event) {
        // If we're already scanning, don't do anything
        if (isAnimating) return;

        // If this device can't do fingerprint scanning, show failure
        if (!isBiometricsSupported) {
            onFailure();
            return;
        }

        // Start the scanning animation
        isAnimating = true;
        fingerprint.classList.add('active');

        try {
            // DEMO MODE: Randomly succeed or fail
            // In a real app, this would actually check your fingerprint
            setTimeout(() => {
                if (Math.random() > 0.3) {        // 70% chance of success
                    onSuccess();
                } else {                          // 30% chance of failure
                    onFailure();
                }
            }, 2000);                            // Wait 2 seconds to simulate scanning
        } catch (error) {
            onFailure();
        }
    }

    // Listen for clicks anywhere on the webpage
    body.addEventListener('click', triggerBiometricAuth);
    // Also listen for touches (for mobile devices)
    body.addEventListener('touchstart', triggerBiometricAuth);

    // When the page loads, check if this device can do fingerprint scanning
    checkBiometricSupport().then(supported => {
        isBiometricsSupported = supported;                    // Save the result
        console.log('Biometric Support:', supported);         // Show in console
    });
});