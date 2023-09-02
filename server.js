import multer from "multer";
import express from "express";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {randomBytes} from 'crypto';
const app= express();
import env from 'dotenv';

env.config();

const storage= multer.memoryStorage();
const upload= multer({storage: storage});

const bucketName = process.env.AWS_BUCKET_NAME;
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

app.use(express.static('public'));


function generateRandomHash() {
  const rawBytes = randomBytes(16);
  const hash = rawBytes.toString("hex");
  return hash;
}


app.get('/',(req,res)=>{
    res.send('index.html');
})

app.post('/upload-file',upload.single("file"),async (req,res)=>{
    const uniquehash= generateRandomHash();
    const params = {
    Bucket: bucketName,
    Key: uniquehash,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };
    const command= new PutObjectCommand(params);
    await s3.send(command);
    res.send("Alright");
    // console.log(`File`)

})


app.listen(3000,()=>{
    console.log("Server running");
})

