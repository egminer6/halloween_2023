import "./App.css";
import React from "react";
import BlobDetector from "./components/BlobDetector";
import Webcam from "react-webcam";

export default function App() {
  const webcamRef: React.Ref<Webcam> = React.useRef(null);
  //getContext('2d', { willReadFrequently: true });
  //webcamRef.current!.getCanvas!.getContext('2d', { willReadFrequently: true } );
  //webcamRef.current!.context('2d', { willReadFrequently: true } );

  return (
    <>
      <h1>Blob Detection</h1>

      <div>
      <Webcam
        ref={webcamRef}
        className="camera"
        width="640"
        height="480"
      />
      </div>
      <BlobDetector webcam={webcamRef} />
    </>
  );
}
