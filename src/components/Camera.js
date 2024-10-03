import { useEffect, useRef, useState } from "react";

import * as tf from "@tensorflow/tfjs";

import * as cocossd from "@tensorflow-models/coco-ssd";

const Camera = () => {
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);

  const [predictions, setPredictions] = useState([]);

  const videoRef = useRef(null);

  useEffect(() => {
    const predictobject = async () => {
      const model = await cocossd.load();

      model
        .detect(videoRef.current)
        .then((predictions) => {
          setPredictions(predictions);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    predictobject();
  }, []);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        setStream(stream);
      })
      .catch((error) => {
        setError("Unable to get access tot he camera");
      });

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  return (
    <div>
      This will be the Camera Component
      <video ref={videoRef} autoPlay playsInline></video>
    </div>
  );
};

export default Camera;
