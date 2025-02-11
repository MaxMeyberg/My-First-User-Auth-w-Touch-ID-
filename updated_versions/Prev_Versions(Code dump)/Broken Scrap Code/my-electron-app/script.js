let body = document.querySelector('body');
let fingerprint = document.querySelector('.fingerprint');
let center = document.querySelector('.center');
let scan = document.querySelector('.scan');
let timer, timerSuccess;

// Device and session management
const deviceId = crypto.randomUUID();
let sessionToken = null;

// Simple biometric check without passkey storage
async function checkBiometric() {
    try {
        const options = {
            publicKey: {
                challenge: new Uint8Array([1, 2, 3, 4]),
                rpId: window.location.hostname,
                userVerification: "required",
                timeout: 60000,
                authenticatorAttachment: "platform", // Force platform authenticator
                allowCredentials: [] // Prevent passkey prompt
            }
        };

        // Just check if biometric succeeds
        await navigator.credentials.get(options);
        return true; // Biometric succeeded

    } catch (error) {
        console.error('Biometric failed:', error);
        return false;
    }
}

// Generate session token after successful biometric
function generateSessionToken() {
    return {
        deviceId: deviceId,
        userId: 'user-' + Math.random(), // Simulate userId
        expires: Date.now() + (30 * 60 * 1000), // 30 min expiry
        lastAccess: Date.now()
    };
}

// Verify existing session
function verifySession(token) {
    if (!token) return false;
    return (
        token.deviceId === deviceId &&
        token.expires > Date.now()
    );
}

// Click handler
body.addEventListener('mousedown', async () => {
    fingerprint.classList.add('active');
    scan.textContent = 'Scan your finger...';

    // First, try biometric
    const biometricSuccess = await checkBiometric();
    
    if (biometricSuccess) {
        // Generate new session
        sessionToken = generateSessionToken();
        localStorage.setItem('sessionToken', JSON.stringify(sessionToken));
        
        scan.textContent = 'Biometric verified!';
        onSuccess();
    } else {
        onFailure('Biometric verification failed');
    }
});

function onSuccess() {
    fingerprint.classList.remove('active');
    center.classList.add('success');
    clearTimeout(timerSuccess);
    timerSuccess = setTimeout(() => {
        center.classList.remove('success');
    }, 3000);
}

function onFailure(error) {
    fingerprint.classList.remove('active');
    scan.textContent = 'Verification failed. Try again.';
    localStorage.removeItem('sessionToken');
}

// Check for existing session on load
const storedToken = JSON.parse(localStorage.getItem('sessionToken'));
if (verifySession(storedToken)) {
    sessionToken = storedToken;
    scan.textContent = 'Session active. Click to verify again.';
}