import React from "react";
import Webcam from 'react-webcam';
import cv from "@techstark/opencv-js";
import ColorPredicateRangeSlider from "./ColorPredicateRangeSlider";

export interface IBlobDetectorProps {
  webcam: React.RefObject<Webcam>;
  style?: React.CSSProperties;
};

export default function BlobDetector(props: IBlobDetectorProps) {
  const webcamRef = props.webcam;
  const srcRef: React.Ref<HTMLImageElement> = React.useRef(null);
  const destRef: React.Ref<HTMLCanvasElement> = React.useRef(null);

  React.useEffect(() => {
    const detectColor = async () => {
      const imageSrc = webcamRef!.current!.getScreenshot();
      if (!imageSrc) return;

      return new Promise<void>((resolve) => {
        srcRef.current!.src = imageSrc;
        srcRef.current!.onload = () => {
          try {
            const img = cv.imread(srcRef.current!);
            cv.imshow(destRef.current!, img);

            img.delete();
            resolve();
          } catch (error) {
            console.log(error);
            resolve();
          }
        };
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
    };
  });

  return (
    <>
      <div style={{ ...props.style}}>
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
        <img ref={srcRef} />
        <canvas ref={destRef} />

      </div>
    </>
  );
}
