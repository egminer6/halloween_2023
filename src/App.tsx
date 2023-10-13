import "./App.css";
import React from "react";
import BlobDetector from "./components/BlobDetector";
import Webcam from "react-webcam";

export default function App() {
  const webcamRef: React.Ref<Webcam> = React.useRef(null);
  //getContext('2d', { willReadFrequently: true });
  //webcamRef.current!.getCanvas!.getContext('2d', { willReadFrequently: true } );
  
  const videoConstraints = {
    facingMode: "environment"
  }

  return (
    <>
      <h1>Blob Detection</h1>

      <div>
        <table style={{visibility:"collapse"}}>
          <tbody>
            <tr>
              <td>
                <Webcam
                  ref={webcamRef}
                  className="camera"
                  width="640"
                  height="480"
                  audio={false}
                  videoConstraints={videoConstraints}
                />
              </td>
            </tr>
          </tbody>
        </table>

      </div>
      <BlobDetector webcam={webcamRef} />
    </>
  );
}
