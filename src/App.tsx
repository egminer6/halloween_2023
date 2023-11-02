import "./App.css";
import React from "react";
import Eye from "./components/Eye";
import { JackyCameraHandle, JackyCamera } from "./components/JackyCamera";

export default function App() {
  const camRef : React.Ref<JackyCameraHandle> = React.useRef(null);
  //const blobDetectorRef: React.Ref<BlobDetector> = React.useRef(null);

  //getContext('2d', { willReadFrequently: true });
  //webcamRef.current!.getCanvas!.getContext('2d', { willReadFrequently: true } );
  const videoConstraints = {
    facingMode: "environment"
  };

  return (
    <>
      <div>
        <JackyCamera
          ref={camRef}
          className="camera"
          width="640"
          height="480"
          audio={false}
          videoConstraints={videoConstraints} forceScreenshotSourceSize={false} imageSmoothing={false} mirrored={false} onUserMedia={function (stream: MediaStream): void {
            throw new Error("Function not implemented.");
          } } onUserMediaError={function (error: string | DOMException): void {
            throw new Error("Function not implemented.");
          } } screenshotFormat={"image/webp"} screenshotQuality={0}        />
      </div>
      <div>
        <Eye camera={camRef} />
      </div>
    </>
  );
}
