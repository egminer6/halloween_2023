import React from "react";
import { JackyCamera, JackyCameraHandle } from './JackyCamera';
import Webcam from 'react-webcam';
import loadDataFile from "../DataFile";
import cv from "@techstark/opencv-js";

export interface IEyeProps {
  camera: React.RefObject<JackyCameraHandle>;
  style?: React.CSSProperties;
};

const preMultiplyAlpha = ( src: cv.Mat, dst: cv.Mat ) => {
  const rgbaPlanes = new cv.MatVector();
  // Split the Mat
  cv.split(src, rgbaPlanes);

  // Get R channel
  cv.multiply( rgbaPlanes.get(0), rgbaPlanes.get(3), rgbaPlanes.get(0) );
  cv.multiply( rgbaPlanes.get(1), rgbaPlanes.get(3), rgbaPlanes.get(1) );
  cv.multiply( rgbaPlanes.get(2), rgbaPlanes.get(3), rgbaPlanes.get(2) );

  const dstRgbaPlanes = new cv.MatVector();

  dstRgbaPlanes.push_back( rgbaPlanes.get(0) );
  dstRgbaPlanes.push_back( rgbaPlanes.get(1) );
  dstRgbaPlanes.push_back( rgbaPlanes.get(2) );
  
  // Merge all channels
  cv.merge(dstRgbaPlanes, dst);

  rgbaPlanes.delete();
  dstRgbaPlanes.delete();
}

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
      //const theEye = new cv.Mat( eyeBackground.rows, eyeBackground.cols, eyeBackground.channels() );
      
      //cv.add( eyeIris, eyePupil, theEye,  );

      console.log( `eyeBackground ${eyeBackground.channels()}`);

      //const camera : JackyCamera = camRef.current!;
      const webcam : Webcam | null = camRef.current!.getWebcam();
      if (webcam !== null) {
        const videoSrc = webcam.video;
        // on Mac range is from to 30, 375 -> 0, 600
        // destRef.current!.width = videoSrc!.width;
        // destRef.current!.height = videoSrc!.height;
        // console.log( "rendering eye background" );
        //cv.imshow( destRef.current!, theEye );
      }

      eyeBackground.delete();
      eyePupil.delete();
      eyeIris.delete();
      //theEye.delete();
    }

  }, [cvLoaded] );

  return (
    <>
      <div style={{ ...props.style }}>
        <canvas ref={destRef} />
      </div>
      <div className="eyeContainer" style={{position:"relative", width:"640px" }}>
        <img className="eyeBackgroundImg" ref={ eyeBackgroundRef } src="/images/eye_background.png" style={{ position: "absolute", top: 0, zIndex: 30 }}/>
        <img className="eyePupilImg" ref={ eyePupilRef } src="/images/eye_pupil.png" style={{ position: "absolute", top: "30px", left: "375px", zIndex: 20 }} />
        <img className="eyeIrisImg" ref={ eyeIrisRef } src="/images/eye_iris.png" style={{ position: "absolute", top: 0, zIndex: 10 }} />
      </div>
    </>
  );
}
