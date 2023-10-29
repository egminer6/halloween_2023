import React from "react";
import { JackyCamera, JackyCameraHandle } from './JackyCamera';
import Webcam from 'react-webcam';
import { loadDataFile } from "../DataFile";
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

export async function loadHaarFaceModels() {
  try {
    console.log("=======start downloading Haar-cascade models=======");
    await loadDataFile(
      "haarcascade_frontalface_default.xml",
      "models/haarcascade_frontalface_default.xml"
    );
    await loadDataFile("haarcascade_eye.xml", "models/haarcascade_eye.xml");
    console.log("=======downloaded Haar-cascade models=======");
  } catch (error) {
    console.error(error);
  }
}


export default function Eye(props: IEyeProps) {
  const camRef = props.camera;
  
  const [cvLoaded, setCvLoaded] = React.useState(false);
  const [ haarFacesLoaded, setHaarFacesLoaded ] = React.useState( false );

  const destRef: React.Ref<HTMLCanvasElement> = React.useRef(null);

  const eyeBackgroundRef : React.Ref<HTMLImageElement> = React.useRef(null);
  const eyeIrisRef : React.Ref<HTMLImageElement> = React.useRef(null);
  const eyePupilRef : React.Ref<HTMLImageElement> = React.useRef(null);

  cv['onRuntimeInitialized'] = () => {
    console.log(`cv is loaded`);
    console.log(cv.getBuildInformation());
    setCvLoaded(true);

    loadHaarFaceModels().then( () => { setHaarFacesLoaded( true ); } );
  };

  React.useEffect(() => {
    if ((camRef.current) && (cvLoaded)) {

      //const camera : JackyCamera = camRef.current!;
      const webcam : Webcam | null = camRef.current!.getWebcam();

      const classifier = new cv.CascadeClassifier();
      // load pre-trained classifiers
      classifier.load('haarcascade_frontalface_default.xml');
  
      if (webcam !== null) {
        const videoSrc = webcam.video;
        // on Mac range is from to 30, 375 -> 0, 600

        const src = new cv.Mat(videoSrc?.height, videoSrc?.width, cv.CV_8UC4);
        const dst = new cv.Mat(videoSrc?.height, videoSrc?.width, src.type());
        const gray = new cv.Mat();
        const cap = new cv.VideoCapture(videoSrc!);

        const faceCascade = new cv.CascadeClassifier();
        faceCascade.load( "haarcascade_frontalface_default.xml");

        const eyeCascade = new cv.CascadeClassifier();
        eyeCascade.load( "haarcascade_eye.xml");

        const faces = new cv.RectVector();
        const eyes = new cv.RectVector();

        const detectFaces = async () => {
          if (!cap) {
            return;
          }

          return new Promise<void>((resolve) => {
            cap.read(src);
            src.copyTo(dst);

            cv.cvtColor( dst, gray, cv.COLOR_RGBA2GRAY, 0 );

            const msize = new cv.Size( 0, 0 );

            faceCascade.detectMultiScale( gray, faces, 1.1, 3, 0, msize, msize );

            if  ( faces.size() > 0 ) {
              const el = eyePupilRef.current!;
              const tx = faces.get(0).x;
              const ty = faces.get(0).y;
              const base_y = -200;
              const base_x = 
              
              el.style.transform = "translate(" + (tx) + "px," + (base_y + ty) + "px)";
            }

            for (let i = 0; i < faces.size(); ++i) {
              const face = faces.get(i);
              const point1 = new cv.Point(face.x, face.y);
              const point2 = new cv.Point(face.x + face.width, face.y + face.height);
              cv.rectangle(src, point1, point2, [255, 0, 0, 255]);
            }
            cv.imshow(destRef.current!, src);
            resolve();
          });
        };

        let handle: number;

        const nextTick = () => {
          handle = requestAnimationFrame(async () => {
            await detectFaces();
            nextTick();
          });
        };

        nextTick();
        return () => {
          cancelAnimationFrame(handle);
          src.delete();
          dst.delete();
          gray.delete();
          faces.delete();
          eyes.delete();
          faceCascade.delete();
          eyeCascade.delete();
          classifier.delete();
        };
      }
    }
  }, [ haarFacesLoaded ] );

  return (
    <>
      <div style={{ ...props.style }}>
        <canvas ref={destRef} />
      </div>
      <div className="eyeContainer" style={{position:"relative", width:"640px" }}>
        <img className="eyeBackgroundImg" ref={ eyeBackgroundRef } src="/images/eye_background.png" style={{ position: "absolute", top: 0, zIndex: 30 }}/>
        <img className="eyePupilImg" ref={ eyePupilRef } src="/images/eye_pupil.png" style={{ position: "absolute", top: "30px", left: "200px", zIndex: 20 }} />
        <img className="eyeIrisImg" ref={ eyeIrisRef } src="/images/eye_iris.png" style={{ position: "absolute", top: 0, zIndex: 10 }} />
      </div>
    </>
  );
}
