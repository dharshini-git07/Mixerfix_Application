import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const keyId = process.env.RAZORPAY_KEY_ID || '';
const keySecret = process.env.RAZORPAY_KEY_SECRET || '';

let razorpayInstance = null;

if (keyId && keySecret) {
  try {
    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
    console.log(`[Razorpay] Initialized in ${keyId.startsWith('rzp_test_') ? 'TEST MODE' : 'LIVE MODE'} with Key: ${keyId.slice(0, 8)}...`);
  } catch (err) {
    console.warn(`[Razorpay Warning] Failed to initialize Razorpay SDK: ${err.message}`);
  }
} else {
  console.warn(
    `[Razorpay Notice] RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not configured in server/.env.\n` +
    `  Razorpay test orders will simulate test checkout tokens until your test API keys are added.`
  );
}

export const getRazorpayInstance = () => razorpayInstance;

export const isRazorpayConfigured = () => Boolean(razorpayInstance && keyId && keySecret);

/**
 * Verify Razorpay standard checkout payment signature using HMAC SHA256
 */
export const verifyPaymentSignature = ({ orderId, paymentId, signature }) => {
  const secret = process.env.RAZORPAY_KEY_SECRET || keySecret;
  if (!secret) return false;

  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return generatedSignature === signature;
};

/**
 * Verify Razorpay webhook signature using raw body and webhook secret
 */
export const verifyWebhookSignature = (rawBody, signature) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret || !signature) return false;

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  return expectedSignature === signature;
};

export default razorpayInstance;
