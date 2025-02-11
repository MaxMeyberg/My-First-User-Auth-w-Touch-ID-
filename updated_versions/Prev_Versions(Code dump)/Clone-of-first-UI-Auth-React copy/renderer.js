console.log('Script starting...');

document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const body = document.querySelector('body');
    const fingerprint = document.querySelector('.fingerprint');
    const center = document.querySelector('.center');

    // Track if animation is in progress
    let isAnimating = false;

    // Simple success handler
    function onSuccess() {
        console.log('Touch ID accepted!');
        fingerprint.classList.remove('active');
        center.classList.add('success');
        setTimeout(() => {
            center.classList.remove('success');
            isAnimating = false;  // Animation is now complete, allow new clicks
            console.log('Ready for next scan');
        }, 3000);
    }

    // Simple failure handler
    function onFailure() {
        console.log('Touch ID rejected');
        fingerprint.classList.remove('active');
        center.classList.add('failure');  // Add failure class
        setTimeout(() => {
            center.classList.remove('failure');  // Remove failure class
            isAnimating = false;
            console.log('Ready for next scan');
        }, 1000);
    }

    // Simplified UI-only biometric simulation
    async function triggerBiometricUI(event) {
        // Only proceed if no animation is in progress
        if (isAnimating) {
            console.log('Scan in progress, please wait');
            event.preventDefault();  // Prevent any default click behavior
            return;
        }

        console.log('Starting Touch ID scan...');
        isAnimating = true;
        fingerprint.classList.add('active');
        
        try {
            // Just check if biometric is available and can be used
            const result = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
            if (result) {
                onSuccess();
            } else {
                onFailure();
            }
        } catch (error) {
            onFailure();
        }
    }

    // Event Listeners
    body.addEventListener('click', triggerBiometricUI);
    body.addEventListener('touchstart', triggerBiometricUI);
}); 