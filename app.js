//Upload files via server's (using multer) memory storage



import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import env from "dotenv";
import { uploadToS3 } from "./s3-modules.js";


const app = express();
env.config();

const bucketName = process.env.AWS_BUCKET_NAME;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const HOST = "127.0.0.1";
const PORT = 3002;




app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("index.html");
});

app.post("/upload-file", upload.single("file") ,async (req, res) => {
  const file=req.file;

  await uploadToS3(file);
  res.status(200).send("Alright");
});

app.listen(PORT, HOST, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});


