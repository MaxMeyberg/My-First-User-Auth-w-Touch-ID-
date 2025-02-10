let body = document.querySelector('body');
let fingerprint = document.querySelector('.fingerprint');
let center = document.querySelector('.center');
let scan = document.querySelector('.scan');
let timer, timerSuccess;

// Add this debug check when the script loads
console.log('WebAuthn Support Check:', {
    publicKeyCredential: !!window.PublicKeyCredential,
    navigator: !!navigator.credentials
});

// Function to handle successful authentication
function onSuccess() {
    fingerprint.classList.remove('active');
    center.classList.add('success');

    clearTimeout(timerSuccess);

    timerSuccess = setTimeout(() => {
        center.classList.remove('success');
    }, 3000);
}

// Function to handle failed authentication
function onFailure(error) {
    console.error('Authentication failed:', error);
    fingerprint.classList.remove('active');
    // You might want to add some UI feedback for failure
}

// Add this function to register credentials
async function registerCredential() {
    try {
        console.log('Starting registration...');
        
        // Generate a random user ID
        const userId = new Uint8Array(16);
        window.crypto.getRandomValues(userId);

        const createCredentialOptions = {
            publicKey: {
                // Random challenge
                challenge: new Uint8Array(32),
                
                // Relying Party (your app)
                rp: {
                    name: "WebAuthn Demo",
                    id: window.location.hostname
                },
                
                // User
                user: {
                    id: userId,
                    name: "test@example.com",
                    displayName: "Test User"
                },
                
                // Cryptographic parameters
                pubKeyCredParams: [{
                    type: "public-key",
                    alg: -7 // ES256
                }],
                
                authenticatorSelection: {
                    authenticatorAttachment: "platform", // Use built-in authenticator (Touch ID)
                    requireResidentKey: false,
                    userVerification: "required"
                },
                
                timeout: 60000,
            }
        };

        console.log('Creating credential...');
        const credential = await navigator.credentials.create(createCredentialOptions);
        console.log('Credential created:', credential);
        return credential;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}

// Function to start biometric authentication
async function startBiometricAuth() {
    try {
        console.log('Starting biometric auth...');
        fingerprint.classList.add('active');

        // Check if WebAuthn is supported
        if (!window.PublicKeyCredential) {
            throw new Error('WebAuthn is not supported in this browser');
        }

        // Check if platform authenticator is available
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        console.log('Platform authenticator available:', available);

        if (!available) {
            throw new Error('Platform authenticator is not available');
        }

        // Try to register first (in a real app, you'd only do this once)
        try {
            await registerCredential();
        } catch (error) {
            console.log('Registration failed or already registered:', error);
        }

        // Then authenticate
        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);

        const options = {
            publicKey: {
                challenge: challenge,
                rpId: window.location.hostname,
                userVerification: 'required',
                timeout: 60000,
            }
        };

        console.log('Requesting credential...');
        const credential = await navigator.credentials.get(options);
        console.log('Credential result:', credential);
        
        if (credential) {
            onSuccess();
        }
    } catch (error) {
        console.error('Authentication error:', error);
        onFailure(error);
    }
}

// Event Listeners
body.addEventListener('mousedown', startBiometricAuth);
body.addEventListener('touchstart', startBiometricAuth);