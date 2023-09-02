import env from "dotenv";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomBytes } from "crypto";
env.config();

const bucketName= process.env.AWS_BUCKET_NAME;
const bucketRegion = process.env.AWS_BUCKET_REGION;
const accessKey = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
});

async function generateRandomHash() {
  const rawBytes = await randomBytes(16);
  const hash = rawBytes.toString("hex");
  return hash;
}

export async function uploadToS3(file) {
  
  const uniquehash= generateRandomHash();
   
  const params = {
  Bucket: bucketName,
  Key: uniquehash,
  Body: file.buffer,
  ContentType: file.mimetype,
};
  const command = new PutObjectCommand(params);
  await s3.send(command);
  console.log(`File ${params.Key} was uploaded`);
}
