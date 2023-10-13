import React from "react";
import Webcam from 'react-webcam';
import cv from "@techstark/opencv-js";
import ColorPredicateRangeSlider from "./ColorPredicateRangeSlider";

export interface IBlobDetectorProps {
  webcam: React.RefObject<Webcam>;
  style?: React.CSSProperties;
};

type ColorPredicate = {
  red_min?: number,
  red_max?: number,
  green_min?: number,
  green_max?: number,
  blue_min?: number,
  blue_max?: number,

  red_green_min?: number,
  red_green_max?: number,
  red_blue_min?: number,
  red_blue_max?: number,
  green_blue_min?: number,
  green_blue_max?: number
};

function applyColorPredicate(src: cv.Mat, dst: cv.Mat, predicate: ColorPredicate) {
  //console.log(`applyColorPredicate ${JSON.stringify( predicate ) }`);
  const low = new cv.Mat(src.rows, src.cols, src.type(), [predicate.red_min, predicate.green_min, predicate.blue_min, 0]);
  const high = new cv.Mat(src.rows, src.cols, src.type(), [predicate.red_max!, predicate.green_max!, predicate.blue_max!, 255]);
  const mask = new cv.Mat(src.rows, src.cols, src.type());
  const invMask = new cv.Mat(src.rows, src.cols, src.type());
  const red = new cv.Mat(src.rows, src.cols, src.type(), [255, 0, 0, 255]);
  //console.log("variables");

  cv.inRange(src, low, high, mask);
  cv.bitwise_not(mask, invMask);
  //console.log("inv");

  cv.bitwise_and(src, src, dst, invMask);
  cv.bitwise_and(red, red, dst, mask);
  //console.log(`and src ${src.type()} dst ${dst.type()} red ${red.type()} mask ${mask.type()}`);

  low.delete();
  high.delete();
  mask.delete();
  invMask.delete();
  red.delete();

  console.log("delete");
}

export default function BlobDetector(props: IBlobDetectorProps) {
  const webcamRef = props.webcam;
  const destRef: React.Ref<HTMLCanvasElement> = React.useRef(null);

  type PixelPos = { x: number, y: number };
  const addPoints: Array<PixelPos> = new Array<PixelPos>();

  const [cvLoaded, setCvLoaded] = React.useState(false);

  const p = {
    red_min: 0, red_max: 255,
    green_min: 0, green_max: 255,
    blue_min: 0, blue_max: 255,

    red_green_min: -255, red_green_max: 255,
    red_blue_min: -255, red_blue_max: 255,
    green_blue_min: -255, green_blue_max: 255,
  };
  const [colorPredicate, setColorPredicate] = React.useState(p);

  cv['onRuntimeInitialized'] = () => {
    console.log(`cv is loaded`);
    console.log(cv.getBuildInformation());
    setCvLoaded(true);
  };

  const updateColorPredicate = (color: ColorPredicate) => {
    //console.log(`updateColorPredicate ${JSON.stringify(color, null, 4)}`);
    setColorPredicate((previousState) => {
      const n = { ...previousState, ...color };
      //console.log(`updated ${JSON.stringify(n)}`);
      return n;
    });
  }

  const extendColorPredicate = (color: ColorPredicate) => {
    console.log(`extendColorPredicate ${JSON.stringify(color)}`);
    setColorPredicate((previousState) => {
      const n = { ...previousState };

      if (isResetColorPredicate(n)) {
        console.log("Resetting color");

        if (color.red_min !== undefined) {
          n.red_min = color.red_min;
        }
        if (color.red_max !== undefined) {
          n.red_max = color.red_max;
        }
        if (color.green_min !== undefined) {
          n.green_min = color.green_min;
        }
        if (color.green_max !== undefined) {
          n.green_max = color.green_max;
        }
        if (color.blue_min !== undefined) {
          n.blue_min = color.blue_min;
        }
        if (color.blue_max !== undefined) {
          n.blue_max = color.blue_max;
        }
        if (color.red_green_min !== undefined) {
          n.red_green_min = color.red_green_min;
        }
        if (color.red_green_max !== undefined) {
          n.red_green_max = color.red_green_max;
        }
        if (color.red_blue_min !== undefined) {
          n.red_blue_min = color.red_blue_min;
        }
        if (color.red_blue_max !== undefined) {
          n.red_blue_max = color.red_blue_max;
        }
        if (color.green_blue_min !== undefined) {
          n.green_blue_min = color.green_blue_min;
        }
        if (color.green_blue_max !== undefined) {
          n.green_blue_max = color.green_blue_max;
        }
      } else {
        console.log("Extending color");
        if ((color.red_min !== undefined) && (color.red_min < n.red_min)) {
          n.red_min = color.red_min;
        }
        if ((color.red_max !== undefined) && (color.red_max > n.red_max)) {
          n.red_max = color.red_max;
        }

        if ((color.green_min !== undefined) && (color.green_min < n.green_min)) {
          n.green_min = color.green_min;
        }
        if ((color.green_max !== undefined) && (color.green_max > n.green_max)) {
          n.green_max = color.green_max;
        }

        if ((color.blue_min !== undefined) && (color.blue_min < n.blue_min)) {
          n.blue_min = color.blue_min;
        }
        if ((color.blue_max !== undefined) && (color.blue_max > n.blue_max)) {
          n.blue_max = color.blue_max;
        }

        if ((color.red_green_min !== undefined) && (color.red_green_min < n.red_green_min)) {
          n.red_green_min = color.red_green_min;
        }
        if ((color.red_green_max !== undefined) && (color.red_green_max > n.red_green_max)) {
          n.red_green_max = color.red_green_max;
        }

        if ((color.red_blue_min !== undefined) && (color.red_blue_min < n.red_blue_min)) {
          n.red_blue_min = color.red_blue_min;
        }
        if ((color.red_blue_max !== undefined) && (color.red_blue_max > n.red_blue_max)) {
          n.red_blue_max = color.red_blue_max;
        }

        if ((color.green_blue_min !== undefined) && (color.green_blue_min < n.green_blue_min)) {
          n.green_blue_min = color.green_blue_min;
        }
        if ((color.green_blue_max !== undefined) && (color.green_blue_max > n.green_blue_max)) {
          n.green_blue_max = color.green_blue_max;
        }
      }
      console.log(`extendColorPredicate ${JSON.stringify(n)}`);
      return n;
    });
  }

  const getPixel = (m: cv.Mat, col: number, row: number) => {
    if ((m.isContinuous()) && (0 <= col) && (col < m.cols) && (row >= 0) && (row < m.rows)) {
      const R = m.data[(row * m.cols + col) * m.channels()];
      const G = m.data[(row * m.cols + col) * m.channels() + 1];
      const B = m.data[(row * m.cols + col) * m.channels() + 2];
      const A = m.data[(row * m.cols + col) * m.channels() + 3];
      return [R, G, B, A];
    }
    return undefined;
  }

  const isResetColorPredicate = (pred: ColorPredicate) => {
    return (!((pred.red_min != 0) || (pred.red_max != 255)
      || (pred.green_min != 0) || (pred.green_max != 255)
      || (pred.blue_min != 0) || (pred.blue_max != 255)));
  }

  const getMousePos = (x: number, y: number, canvas: HTMLCanvasElement | HTMLVideoElement) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: Math.round((x - rect.left) / (rect.right - rect.left) * canvas.width),
      y: Math.round((y - rect.top) / (rect.bottom - rect.top) * canvas.height),
    }
  }

  const startDragging = (ev: MouseEvent | TouchEvent) => {
    ev.preventDefault();
    dragging = true;
  }

  const stopDragging = (ev: MouseEvent | TouchEvent) => {
    ev.preventDefault();
    dragging = false;
  }

  let dragging = false;

  React.useEffect(() => {
    if ((webcamRef.current) && (cvLoaded)) {
      const videoSrc = webcamRef.current!.video;

      destRef.current!.width = videoSrc!.width;
      destRef.current!.height = videoSrc!.height;

      videoSrc!.onmousedown = startDragging;
      videoSrc!.onmouseup = stopDragging;

      videoSrc!.onmousemove = (ev: MouseEvent) => {
        ev.preventDefault();
        if (dragging) {
          const pos = getMousePos(ev.clientX, ev.clientY, videoSrc!);
          addPoints.push(pos);
          console.log(`mousemove pos ${pos.x},${pos.y} ${addPoints.length}`);
        }
      }

      videoSrc!.ontouchstart = startDragging;
      videoSrc!.ontouchend = stopDragging;

      videoSrc!.ontouchmove = (ev: TouchEvent) => {
        ev.preventDefault();
        if (dragging) {
          const pos = getMousePos(ev.touches[0].clientX, ev.touches[0].clientY, videoSrc!);
          addPoints.push(pos);
          console.log(`touchmove pos ${pos.x},${pos.y} ${addPoints.length}`);
        }
      }

      videoSrc!.onmouseleave = stopDragging;

      videoSrc!.ontouchcancel = stopDragging;

      //videoSrc?.play();

      const src = new cv.Mat(videoSrc?.height, videoSrc?.width, cv.CV_8UC4);
      const dst = new cv.Mat(videoSrc?.height, videoSrc?.width, src.type());
      const cap = new cv.VideoCapture(videoSrc!);

      const detectColor = async () => {
        if (!cap) {
          return;
        }

        return new Promise<void>((resolve) => {
          cap.read(src);
          while (addPoints.length > 0) {
            const pos = addPoints.shift();

            if (pos) {
              const pixel = getPixel(src, pos.x, pos.y);

              if (pixel) {
                extendColorPredicate({
                  red_min: pixel[0], red_max: pixel[0],
                  green_min: pixel[1], green_max: pixel[1],
                  blue_min: pixel[2], blue_max: pixel[2],
                  red_green_min: pixel[0] - pixel[1], red_green_max: pixel[0] - pixel[1],
                  red_blue_min: pixel[0] - pixel[2], red_blue_max: pixel[0] - pixel[2],
                  green_blue_min: pixel[1] - pixel[2], green_blue_max: pixel[1] - pixel[2],
                });
              }
            }
          }

          if (!isResetColorPredicate(colorPredicate)) {
            applyColorPredicate(src, dst, colorPredicate);
          } else {
            src.copyTo(dst);
          }

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
  }, [cvLoaded, webcamRef.current, colorPredicate]);

  return (
    <>
      <div style={{ ...props.style }}>
        <h2>Blob Detector</h2>
        <button className="resetButton" value={"Reset Color"} onClick={() => {
          setColorPredicate({
            red_min: 0, red_max: 255,
            green_min: 0, green_max: 255,
            blue_min: 0, blue_max: 255,

            red_green_min: -255, red_green_max: 255,
            red_blue_min: -255, red_blue_max: 255,
            green_blue_min: -255, green_blue_max: 255,
          });
        }}
        >Reset Color</button>
        <h3>Color Predicate</h3>
        <table>
          <tbody>
            <tr>
              <td>Red</td>
              <td>
                <div className="color-predicate-range-slider-container">
                  <ColorPredicateRangeSlider rtl={false}
                    values={[colorPredicate.red_min, colorPredicate.red_max]}
                    callback={
                      (values: [number, number]) => {
                        //console.log( `callback red ${values}`); 
                        updateColorPredicate({ red_min: values[0], red_max: values[1] });
                      }
                    }
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td>Green</td>
              <td>
                <div className="color-predicate-range-slider-container">
                  <ColorPredicateRangeSlider rtl={false}
                    values={[colorPredicate.green_min, colorPredicate.green_max]}
                    callback={
                      (values: [number, number]) => {
                        //console.log( `callback green ${values}`); 
                        updateColorPredicate({ green_min: values[0], green_max: values[1] });
                      }
                    }
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td>Blue</td>
              <td>
                <div className="color-predicate-range-slider-container">
                  <ColorPredicateRangeSlider rtl={false}
                    values={[colorPredicate.blue_min, colorPredicate.blue_max]}
                    callback={
                      (values: [number, number]) => {
                        //console.log( `callback blue ${values}`); 
                        updateColorPredicate({ blue_min: values[0], blue_max: values[1] });
                      }
                    } />
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <table>
          <tbody>
            <tr>
              <td> <canvas ref={destRef}
                onMouseDown={(ev) => {
                  dragging = true;
                }}
                onMouseUp={(ev) => {
                  dragging = false;
                }}
                onMouseMove={(ev) => {
                  if (dragging) {
                    const pos = getMousePos(ev.clientX, ev.clientY, destRef.current!);
                    addPoints.push(pos);
                    console.log(`mousemove pos ${pos.x},${pos.y} ${addPoints.length}`);
                  }
                }}
                onMouseLeave={(ev) => {
                  dragging = false;
                }}
                onTouchStart={(ev) => {
                  dragging = true;
                }}
                onTouchEnd={(ev) => {
                  dragging = false;
                }}
                onTouchCancel={(ev) => {
                  dragging = true;
                }}
                onTouchMove={(ev) => {
                  if (dragging) {
                    const pos = getMousePos(ev.touches[0].clientX, ev.touches[0].clientY, destRef.current!);
                    addPoints.push(pos);
                    console.log(`touchmove pos ${pos.x},${pos.y} ${addPoints.length}`);

                    if ( ev.cancelable ) {
                      ev.preventDefault();
                    }
                  }
                }}
              /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
