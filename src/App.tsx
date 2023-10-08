import "./App.css";
import React from "react";
import BlobDetector from "./components/BlobDetector";
import Webcam from "react-webcam";

export default function App() {
  const webcamRef: React.Ref<Webcam> = React.useRef(null);
  
  return (
    <>
      <h1>Blob Detection</h1>

      <div style={{visibility:"collapse", width:"0cm", height: "0cm"}}>
      <Webcam
        ref={webcamRef}
        className="camera"
        mirrored
        screenshotFormat="image/png"
      />
      </div>
      <BlobDetector webcam={webcamRef} />
    </>
  );
}
