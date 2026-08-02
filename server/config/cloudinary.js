import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

/* 
   Validate Environment Variables
 */

const requiredEnv = [
  "CLOUD_NAME",
  "CLOUD_API_KEY",
  "CLOUD_API_SECRET",
];

const missing = requiredEnv.filter(
  (key) => !process.env[key]
);

if (missing.length > 0) {
  throw new Error(
    `Missing Cloudinary environment variables: ${missing.join(", ")}`
  );
}

/* 
   Cloudinary Configuration
 */

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

/* 
   Export Configured Instance
 */

export default cloudinary;