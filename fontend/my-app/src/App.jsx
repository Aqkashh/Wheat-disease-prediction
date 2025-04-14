import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import './App.css'; // Import the CSS file

function App() {
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [prediction, setPrediction] = useState('');

  const capture = () => {
    const image = webcamRef.current.getScreenshot();
    setImageSrc(image);
  };

  const sendImage = async () => {
    if (!imageSrc) return;

    const res = await fetch(imageSrc);
    const blob = await res.blob();
    const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('http://localhost:3000/api/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPrediction(response.data.disease);
    } catch (err) {
      console.error(err);
      setPrediction('Prediction failed.');
    }
  };

  return (
    <div className="app">
      <h1 className="title">🌾 Wheat Disease Detector</h1>

      {!imageSrc ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="webcam"
          />
          <button className="btn" onClick={capture}>📸 Capture</button>
        </>
      ) : (
        <>
          <img src={imageSrc} alt="Captured" className="preview" />
          <div className="btn-group">
            <button className="btn" onClick={sendImage}>🔍 Predict</button>
            <button className="btn secondary" onClick={() => setImageSrc(null)}>🔄 Retake</button>
          </div>
        </>
      )}

      {prediction && <h2 className="result">🧪 Result: {prediction}</h2>}
    </div>
  );
}

export default App;
