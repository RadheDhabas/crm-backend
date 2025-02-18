import crypto from 'crypto';

const validateSignature = (payload, signature) => {
  const appSecret = process.env.APP_SECRET;
  const payloadString = JSON.stringify(payload);
 
  const expectedSignature = crypto
    .createHmac('sha256', Buffer.from(appSecret, 'latin1'))
    .update(payloadString, 'utf8')
    .digest('hex');

  // Compare the computed signature with the incoming signature
  return crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature));
};
const signatureRequired = (req, res, next) => {
  const signature = req.headers['x-hub-signature-256'];  // Get the signature from header
  if (!signature) {
    console.log("Signature header missing!");
    return res.status(403).json({ status: "error", message: "Signature missing" });
  }

  // Remove 'sha256=' prefix from the signature
  const actualSignature = signature.substring(7);  // Remove 'sha256='
  
  // Validate the signature
  if (!validateSignature(req.body, actualSignature)) {
    console.log("Signature verification failed!");
    return res.status(403).json({ status: "error", message: "Invalid signature" });
  }

  // Proceed with the request if the signature is valid
  next();
};

export default signatureRequired;