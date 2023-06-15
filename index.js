const express = require("express");
const app = express()
const port = 8080;
const path = require('path')
const { Storage } = require('@google-cloud/storage');
const Multer = require('multer');
const src = path.join(__dirname, 'views')

app.use(express.static(src))

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, //max 10mb
    }
})

let projectId = 'sismul-tugas-akhir'
let keyFilename = 'mykey.json'
const storage = new Storage({
    projectId,
    keyFilename,
})
const bucket = storage.bucket('bucketforsismul')

app.post("/upload", multer.single('imgfile'), (req,res)=>{
    try{
        if(req.file){
            const blob = bucket.file(req.file.originalname);
            const blobStream = blob.createWriteStream();

            blobStream.on('finish', ()=>{
                res.status(200).send("Success")
            });
            blobStream.end(req.file.buffer);
            console.log("Upload Success");
        }
    }catch(err){
        res.status(500).send(err)
    }
})

app.get("/", (req, res)=>{
    res.sendFile(src + "/index.html");
})

app.listen(port, ()=>{
    console.log(`Server started on port ${port}`)
})