import React, { useImperativeHandle } from "react";
import Webcam, { WebcamProps } from 'react-webcam';

export type JackyCameraProps = WebcamProps;

// export type JackyCameraProps = Omit<WebcamProps, "ref"> & {
//     audio: boolean;
//     audioConstraints?: MediaStreamConstraints["audio"];
//     forceScreenshotSourceSize: boolean;
//     imageSmoothing: boolean;
//     mirrored: boolean;
//     minScreenshotHeight?: number;
//     minScreenshotWidth?: number;
//     onUserMedia: (stream: MediaStream) => void;
//     onUserMediaError: (error: string | DOMException) => void;
//     screenshotFormat: "image/webp" | "image/png" | "image/jpeg";
//     screenshotQuality: number;
//     videoConstraints?: MediaStreamConstraints["video"];
//     children?: (childrenProps: ChildrenProps) => JSX.Element;
// }

interface ScreenshotDimensions {
    width: number;
    height: number;
}

interface ChildrenProps {
    getScreenshot: (screenshotDimensions?: ScreenshotDimensions) => string | null;
}

export type JackyCameraHandle = {
    getWebcam: () => Webcam | null;
}

export const JackyCamera = React.forwardRef((props: JackyCameraProps, ref) => {
    const camRef: React.Ref<Webcam> = React.useRef(null);
    
    useImperativeHandle(
        ref,
        () => ({
            getWebcam: () => {
                return camRef.current;
            }
        }), [camRef]
    );

    const [deviceId, setDeviceId] = React.useState({});
    const [devices, setDevices] = React.useState<Array<MediaDeviceInfo>>([]);

    const handleDevices = React.useCallback(
        (mediaDevices: Array<MediaDeviceInfo>) =>
            setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
        [setDevices]
    );

    React.useEffect(
        () => {
            navigator.mediaDevices.enumerateDevices().then(handleDevices);
        },
        [handleDevices]
    );

    console.log(`Rendering JackyCamera`);

    return (
        <>
            <div>
                <select className="cameraSelect" name="cameraSelect"
                onChange={ (ev) => {
                    setDeviceId( ev.target.value );
                }}>
                    {devices.map((device, key) => (
                        <option key={`Device ${key+1}`} value={device.deviceId}>{device.label || `Device ${key + 1}`}</option>
                    ))}
                </select>
                <table style={{ visibility: "collapse" }}>
                    <tbody>
                        <tr>
                            <td>
                                <Webcam
                                    ref={camRef}
                                    width="640"
                                    height="480"
                                    audio={false}
                                    videoConstraints={ { deviceId: deviceId } }
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
});

export default JackyCamera
