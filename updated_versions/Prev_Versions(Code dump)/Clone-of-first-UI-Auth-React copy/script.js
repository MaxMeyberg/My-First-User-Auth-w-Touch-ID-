console.log('Script starting...');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    
    // Get DOM elements
    const body = document.querySelector('body');
    const fingerprint = document.querySelector('.fingerprint');
    const center = document.querySelector('.center');

    console.log('Elements found:', {
        body: !!body,
        fingerprint: !!fingerprint,
        center: !!center
    });

    // Simple success handler
    function onSuccess() {
        fingerprint.classList.remove('active');
        center.classList.add('success');
        setTimeout(() => {
            center.classList.remove('success');
        }, 3000);
    }

    // Simple failure handler
    function onFailure() {
        fingerprint.classList.remove('active');
        console.error('Biometric authentication failed');
    }

    // Simplified biometric prompt function
    async function triggerBiometricPrompt() {
        try {
            console.log('Triggering biometric prompt...');
            fingerprint.classList.add('active');

            // Simple WebAuthn request with empty challenge
            const credential = await navigator.credentials.get({
                publicKey: {
                    challenge: new Uint8Array(0),  // Empty challenge for UI only
                    rpId: window.location.hostname,
                    userVerification: 'required',
                    timeout: 60000,
                }
            });

            if (credential) {
                onSuccess();
            }
        } catch (error) {
            onFailure();
        }
    }

    // Event Listeners
    body.addEventListener('click', triggerBiometricPrompt);
    body.addEventListener('touchstart', triggerBiometricPrompt);
});