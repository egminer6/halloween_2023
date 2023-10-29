import React from "react";
import { JackyCamera, JackyCameraHandle } from './JackyCamera';
import Webcam from 'react-webcam';
import loadDataFile from "../DataFile";
import cv from "@techstark/opencv-js";

export interface IEyeProps {
  camera: React.RefObject<JackyCameraHandle>;
  style?: React.CSSProperties;
};

export default function Eye(props: IEyeProps) {
  const camRef = props.camera;
  
  const [cvLoaded, setCvLoaded] = React.useState(false);

  const destRef: React.Ref<HTMLCanvasElement> = React.useRef(null);

  const eyeBackgroundRef : React.Ref<HTMLImageElement> = React.useRef(null);
  const eyeIrisRef : React.Ref<HTMLImageElement> = React.useRef(null);
  const eyePupilRef : React.Ref<HTMLImageElement> = React.useRef(null);

  cv['onRuntimeInitialized'] = () => {
    console.log(`cv is loaded`);
    console.log(cv.getBuildInformation());
    setCvLoaded(true);
  };

  React.useEffect(() => {

    if ((camRef.current) && (cvLoaded)) {
      console.log(`Reading images ${eyeBackgroundRef.current}` );
      const eyeBackground = cv.imread( eyeBackgroundRef.current! );
      const eyePupil = cv.imread( eyePupilRef.current! );
      const eyeIris = cv.imread( eyeIrisRef.current! );

      //const camera : JackyCamera = camRef.current!;
      const webcam : Webcam | null = camRef.current!.getWebcam();
      if (webcam !== null) {
        const videoSrc = webcam.video;

        destRef.current!.width = videoSrc!.width;
        destRef.current!.height = videoSrc!.height;
        console.log( "rendering eye background" );
        //cv.imshow( destRef.current!, eyeBackground );
      }

      eyeBackground.delete();
      eyePupil.delete();
      eyeIris.delete();
  
    }

  }, [cvLoaded] );

  return (
    <>
      <div style={{ ...props.style }}>
        <canvas ref={destRef} />
      </div>
      <div>
        <img ref={ eyeBackgroundRef } src="/images/eye_background.png" />
        <img ref={ eyePupilRef } src="/images/eye_pupil.png" />
        <img ref={ eyeIrisRef } src="/images/eye_iris.png" />
      </div>
    </>
  );
}
