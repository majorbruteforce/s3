const express= require('express');
const mongoose= require('mongoose');
const app= express();
const multer= require('multer');

import {S3Client, PutObjectCommand} from "@aws-sdk/client-s3";

const bucketName= process.env.AWS_BUCKET_NAME; 
const bucketRegion= process.env.AWS_BUCKET_REGION;
const accessKey= process.env.AWS_ACCESS_KEY;
const secretAccessKey= process.env.AWS_SECRET_ACCESS_KEY;

const s3= new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey,
    },
    region: bucketRegion

});


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const HOST= "127.0.0.1";
const PORT=3002;

app.use(express.static('public'));


app.get('/',(req,res)=>{
    res.send('index.html');
})

app.post('/upload-file',upload.single('file'),(req,res)=>{
    console.log(req.body);
    console.log(req.file);
    
    res.send({});
})

app.listen(PORT,HOST,()=>{
    console.log(`Server is running at http://${HOST}:${PORT}`);
})