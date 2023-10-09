import React from "react";
import Webcam from 'react-webcam';
import cv from "@techstark/opencv-js";
import ColorPredicateRangeSlider from "./ColorPredicateRangeSlider";

export interface IBlobDetectorProps {
  webcam: React.RefObject<Webcam>;
  style?: React.CSSProperties;
};

type ColorPredicate = {
  red_min: number,
  red_max: number,
  green_min: number,
  green_max: number,
  blue_min: number,
  blue_max: number,

  red_green_min: number,
  red_green_max: number,
  red_blue_min: number,
  red_blue_max: number,
  green_blue_min: number,
  green_blue_max: number
};

function applyColorPredicate(src: cv.Mat, dst: cv.Mat, predicate: ColorPredicate) {
  const low = new cv.Mat(src.rows, src.cols, src.type(), [predicate.red_min, predicate.green_min, predicate.blue_min, 0]);
  const high = new cv.Mat(src.rows, src.cols, src.type(), [predicate.red_max, predicate.green_max, predicate.blue_max, 255]);

  cv.inRange(src, low, high, dst);


  low.delete();
  high.delete();
}

export default function BlobDetector(props: IBlobDetectorProps) {
  const webcamRef = props.webcam;
  const destRef: React.Ref<HTMLCanvasElement> = React.useRef(null);

  const [cvLoaded, setCvLoaded] = React.useState(false);

  cv['onRuntimeInitialized'] = () => {
    console.log(`cv is loaded`);
    console.log(cv.getBuildInformation());
    setCvLoaded(true);
  };

  React.useEffect(() => {
    if ( ( webcamRef.current ) && ( cvLoaded ) ) {
      const videoSrc = webcamRef.current!.video;
      const src = new cv.Mat(videoSrc?.height, videoSrc?.height, cv.CV_8UC4);
      const dst = new cv.Mat();
      const cap = new cv.VideoCapture(videoSrc!);

      const detectColor = async () => {
        if (!cap) {
          return;
        }

        return new Promise<void>((resolve) => {
          cap.read(src);

          const p = {
            red_min: 0, red_max: 255,
            green_min: 0, green_max: 255,
            blue_min: 0, blue_max: 255,

            red_green_min: -255, red_green_max: 255,
            red_blue_min: -255, red_blue_max: 255,
            green_blue_min: -255, green_blue_max: 255,
          };

          p.red_min = 100;
          p.red_max = 192;

          p.green_min = 100;
          p.green_max = 192;

          p.blue_min = 100;
          p.blue_max = 192;

          applyColorPredicate(src, dst, p);

          cv.imshow(destRef.current!, dst);
          resolve();
        });
      };

      let handle: number;

      const nextTick = () => {
        handle = requestAnimationFrame(async () => {
          await detectColor();
          nextTick();
        });
      };
      nextTick();
      return () => {
        cancelAnimationFrame(handle);
        src.delete();
        dst.delete();
      };
    }
  }, [cvLoaded, webcamRef.current]);

  return (
    <>
      <div style={{ ...props.style }}>
        <h2>Blob Detector</h2>

        <h3>Color Predicate</h3>
        <table>
          <tbody>
            <tr>
              <td>Red</td>
              <td>
                <div className="color-predicate-range-slider-container">
                  <ColorPredicateRangeSlider rtl={false} />
                </div>
              </td>
            </tr>
            <tr>
              <td>Green</td>
              <td>
                <div className="color-predicate-range-slider-container">
                  <ColorPredicateRangeSlider rtl={false} />
                </div>
              </td>
            </tr>
            <tr>
              <td>Blue</td>
              <td>
                <div className="color-predicate-range-slider-container">
                  <ColorPredicateRangeSlider rtl={false} />
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <table>
          <tbody>
            <tr>
              <td> <canvas ref={destRef} /> </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
