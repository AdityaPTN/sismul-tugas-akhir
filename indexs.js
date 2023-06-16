const express = require("express");
const app = express();
const port = 8080;
const path = require('path');
const { Storage } = require('@google-cloud/storage');
const Multer = require('multer');

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // Max 10mb
  },
});

const projectId = 'sismul-tugas-akhir';
const keyFilename = 'mykey.json';
const storage = new Storage({
  projectId,
  keyFilename,
});
const bucket = storage.bucket('bucketforsismul');

app.post('/upload', multer.single('imgfile'), (req, res) => {
  try {
    if (req.file) {
      const blob = bucket.file(req.file.originalname);
      const blobStream = blob.createWriteStream();

      blobStream.on('finish', () => {
        res.status(200).send('Success');
      });
      blobStream.end(req.file.buffer);
      console.log('Upload Success');
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/', async (req, res) => {
  try {
    const [files] = await bucket.getFiles();
    const fileNames = files.map((file) => file.name);
    res.render('index', { files: fileNames });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get("/main", (req, res)=>{
    res.sendFile("/index.html");
})

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
