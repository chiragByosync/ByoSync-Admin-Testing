const secret = "ByoSyncPayWithFace"
const generateHMAC = async (dataToSign) => {
    // Step 1: Convert secret key and data into ArrayBuffer
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const data = encoder.encode(dataToSign);

    // Step 2: Import the secret key as a Web Crypto key
    const key = await window.crypto.subtle.importKey(
        'raw',           // We are using raw format for the secret
        keyData,         // Secret key data (encoded)
        { name: 'HMAC', hash: { name: 'SHA-256' } }, // Algorithm details
        false,           // Key is not extractable
        ['sign']         // Key can only be used for signing
    );

    // Step 3: Generate the HMAC
    const signature = await window.crypto.subtle.sign('HMAC', key, data);

    // Step 4: Convert signature (ArrayBuffer) to hex format
    const hexArray = Array.from(new Uint8Array(signature));
    const hmac = hexArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    console.log("hmac", hmac)
    return hmac;
};


export default generateHMAC