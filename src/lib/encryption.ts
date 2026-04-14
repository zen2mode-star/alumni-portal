import crypto from 'crypto';

// The secret key needs to be 32 bytes for AES-256. 
// For production, this should be in process.env.ENCRYPTION_KEY
// We fallback to a hardcoded string for development stability.
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'kumaon-institute-secure-vault-32';
const ALGORITHM = 'aes-256-gcm';

export function encryptMessage(text: string): string {
  if (!text) return '';
  
  // Generate a totally random 12-byte initialization vector (IV)
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  
  // Pack IV, Auth Tag, and Encrypted Payload into a single storable string
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

export function decryptMessage(cipherText: string): string {
  if (!cipherText) return '';
  if (!cipherText.includes(':')) return cipherText; // Return original if not encrypted format
  
  try {
    const [ivHex, authTagHex, encryptedHex] = cipherText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption failed on corrupted secure payload.');
    return '[Encrypted Payload Unreadable]';
  }
}
