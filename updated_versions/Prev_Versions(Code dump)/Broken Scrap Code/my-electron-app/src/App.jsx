import React, { useState } from 'react';
import './style.css';

function App() {
    const [status, setStatus] = useState('Click to verify');
    const [isVerified, setIsVerified] = useState(false);

    async function handleBiometric() {
        try {
            // Create empty challenge
            const challenge = new Uint8Array(32);
            window.crypto.getRandomValues(challenge);

            // WebAuthn options with minimal requirements
            const options = {
                publicKey: {
                    challenge,
                    timeout: 60000,
                    userVerification: "required",
                    rpName: "Your App Name",
                    rp: {
                        name: "Your App Name",
                        id: window.location.hostname
                    },
                    user: {
                        id: Uint8Array.from("test", c => c.charCodeAt(0)),
                        name: "test@test.com",
                        displayName: "Test User"
                    },
                    pubKeyCredParams: [{
                        type: "public-key",
                        alg: -7 // ES256
                    }],
                    authenticatorSelection: {
                        authenticatorAttachment: "platform",
                        userVerification: "required"
                    }
                }
            };

            // Trigger biometric prompt
            const credential = await navigator.credentials.create(options);
            
            if (credential) {
                setStatus('Verified successfully!');
                setIsVerified(true);
            }

        } catch (error) {
            console.error('Biometric error:', error);
            setStatus('Verification failed');
            setIsVerified(false);
        }
    }

    return (
        <div className="center">
            <h1>Login With Touch ID</h1>
            <svg 
                className={`fingerprint ${isVerified ? 'success' : ''}`} 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="-1.5 -1.5 136.63 136.56" 
                width="136.63" 
                height="136.56"
                onClick={handleBiometric}
            >
                <path className="original" d="M74.79 8.76C34.79 5.41 8.15 33.6 8.2 67.06c.02 9.4 4.71 18.2-3.08 26.3M95.66 6.84C64.75-6.62 35.16-.37 12.83 27.07m92.5-14.8c18.89 14.55 28.33 31.7 28.3 55.56M7.33 36.48C-.21 51.34-1.78 65.35 1.96 82.91m15.46-24.84c11.03-56.46 92.3-55.76 99.67 4.91M49 29.02c16.4-7.37 31.33-5.39 44.7 5.88m-9.5-23.96c34.23 11.28 46.91 41.4 41.55 86.97M19.31 114.08c5.28-4.5 10.26-10.33 12.77-17.5m-5.93 22.53c15.22-12.49 18.45-31.24 16.52-44.59-5.3-27.22 16.68-33.82 26.82-32.75m-60.06 59c13.42-12.83 7.13-24.08 7.23-32.41m-2.3 39.33C42.6 79.8 7.64 65.8 40.34 34.52m.44 93.96a60.94 60.94 0 0 0 14.6-22.67M33.32 124.1c13.22-12.7 20.85-31.39 17.7-50.9m18.23 60.37c7.88-12.08 13-25.79 15.32-41.2m.55-9.96c2.77-42.91-32.4-36.83-34.59-18.61m63.56 50.8c3.44-14.48 5.28-28.43 4.18-41.01m-27.51 55.7c3.05-6.22 6.01-13.64 7.48-20.15m3.93 14.49c11.26-26.47 9.82-68.08-1.45-81.57m-51.14 89..." />
            </svg>
            <svg className="icon-success" viewBox="0 0 76 76">
                <circle cx="38" cy="38" r="36" fill="#66bb6a"></circle>
                <path fill="none" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="56" stroke-dashoffset="56" d="M17.7,40.9l10.9,10.9l28.7-28.7"></path>
            </svg>
            <div className="scan">{status}</div>
        </div>
    );
}

export default App;
