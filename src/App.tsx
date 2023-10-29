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
          videoConstraints={videoConstraints}
        />
      </div>
      <Eye camera={camRef} />
    </>
  );
}
