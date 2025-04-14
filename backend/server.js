const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `image-${Date.now()}.jpg`);
  }
});
const upload = multer({ storage });

app.post('/predict', upload.single('image'), async (req, res) => {
  const imagePath = path.resolve(__dirname, req.file.path);

  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(imagePath));

    const response = await axios.post('http://127.0.0.1:5000/predict', formData, {
      headers: formData.getHeaders()
    });

    fs.unlinkSync(imagePath); // remove uploaded file

    res.json({ prediction: response.data.prediction });
  } catch (error) {
    console.error('Prediction error:', error.message);
    res.status(500).json({ error: 'Prediction failed' });
  }
});

app.listen(port, () => {
  console.log(`🟢 Node server running at http://localhost:${port}`);
});
