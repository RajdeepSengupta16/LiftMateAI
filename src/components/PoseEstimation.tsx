import React, { useRef, useEffect, useState, useCallback } from 'react';

// Types for landmarks
interface NormalizedLandmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

// Constants for the landmarks and connections
const POSE_LANDMARKS = {
  LEFT_SHOULDER: 11,
  LEFT_ELBOW: 13,
  LEFT_WRIST: 15,
  LEFT_HIP: 23,
  LEFT_KNEE: 25,
};

const POSE_CONNECTIONS = [
  [11, 12], [11, 13], [13, 15],
  [12, 14], [14, 16],
  [11, 23], [12, 24],
  [23, 24],
  [23, 25], [25, 27],
  [24, 26], [26, 28],
];

// Helper function: Draw pose skeleton and keypoints
const drawPose = (
  ctx: CanvasRenderingContext2D,
  landmarks: NormalizedLandmark[],
  width: number,
  height: number
) => {
  ctx.strokeStyle = '#00ff00';
  ctx.lineWidth = 2;
  POSE_CONNECTIONS.forEach(([start, end]) => {
    const a = landmarks[start];
    const b = landmarks[end];
    if (a?.visibility! > 0.5 && b?.visibility! > 0.5) {
      ctx.beginPath();
      ctx.moveTo(a.x * width, a.y * height);
      ctx.lineTo(b.x * width, b.y * height);
      ctx.stroke();
    }
  });

  ctx.fillStyle = '#ff0000';
  landmarks.forEach(p => {
    if (p.visibility && p.visibility > 0.5) {
      ctx.beginPath();
      ctx.arc(p.x * width, p.y * height, 5, 0, 2 * Math.PI);
      ctx.fill();
    }
  });
};

// Helper function: Draw text on canvas
const drawText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color: string,
  size: number = 16
) => {
  ctx.fillStyle = color;
  ctx.font = `${size}px Arial`;
  ctx.fillText(text, x, y);
};

// Main component with rep-counting logic
const PoseEstimation: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState("Initializing...");
  const [error, setError] = useState("");
  const [formStatus, setFormStatus] = useState({ text: "Position yourself", color: "#ffffff" });
  const poseLandmarkerRef = useRef<any>(null);
  const animationIdRef = useRef<number | null>(null);

  // Rep counting state
  const [repCount, setRepCount] = useState(0);
  const repState = useRef<"up" | "down" | null>(null);

  // Angle calculation between three points
  const calculateAngle = (a: [number, number], b: [number, number], c: [number, number]): number => {
    const radians = Math.atan2(c[1] - b[1], c[0] - b[0]) - Math.atan2(a[1] - b[1], a[0] - b[0]);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    return angle > 180 ? 360 - angle : angle;
  };

  // The main prediction/drawing loop
  const predict = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const detector = poseLandmarkerRef.current;

    if (!video || !canvas || !ctx || !detector) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      const results = await detector.detectForVideo(video, performance.now());

      if (results.landmarks?.length > 0) {
        const landmarks = results.landmarks[0];

        drawPose(ctx, landmarks, canvas.width, canvas.height);

        const getXY = (idx: number): [number, number] => [
          landmarks[idx].x * canvas.width,
          landmarks[idx].y * canvas.height,
        ];

        const shoulder = getXY(POSE_LANDMARKS.LEFT_SHOULDER);
        const elbow = getXY(POSE_LANDMARKS.LEFT_ELBOW);
        const wrist = getXY(POSE_LANDMARKS.LEFT_WRIST);
        const hip = getXY(POSE_LANDMARKS.LEFT_HIP);
        const knee = getXY(POSE_LANDMARKS.LEFT_KNEE);

        const elbowAngle = calculateAngle(shoulder, elbow, wrist);
        const hipAngle = calculateAngle(shoulder, hip, knee);

        drawText(ctx, `Elbow: ${Math.round(elbowAngle)}°`, 30, 60, "#ffffff", 20);
        drawText(ctx, `Hip: ${Math.round(hipAngle)}°`, 30, 90, "#ffffff", 20);

        const goodForm = elbowAngle >= 70 && elbowAngle <= 100 && hipAngle >= 160 && hipAngle <= 180;
        const feedbackText = goodForm ? "✅ Good Form" : "⚠️ Fix Form";
        const feedbackColor = goodForm ? "#00ff00" : "#ff0000";
        setFormStatus({ text: feedbackText, color: feedbackColor });

        drawText(ctx, feedbackText, 30, 130, feedbackColor, 24);

        // --- Rep counting logic (elbow flexion/extension) ---
        const FLEXED_THRESHOLD = 60;    // Elbow bent
        const EXTENDED_THRESHOLD = 160; // Elbow straight

        if (repState.current === null) {
          if (elbowAngle > EXTENDED_THRESHOLD) {
            repState.current = "down";
          } else if (elbowAngle < FLEXED_THRESHOLD) {
            repState.current = "up";
          }
        } else if (repState.current === "down" && elbowAngle < FLEXED_THRESHOLD) {
          repState.current = "up";
        } else if (repState.current === "up" && elbowAngle > EXTENDED_THRESHOLD) {
          repState.current = "down";
          setRepCount(prev => prev + 1);
        }
      }
    } catch (err) {
      console.error("Pose detection failed:", err);
    }
    animationIdRef.current = requestAnimationFrame(predict);
  }, []);

  // Initialization/useEffect
  useEffect(() => {
    const init = async () => {
      try {
        setStatus("Requesting camera...");
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await new Promise<void>((resolve) => {
            videoRef.current!.onloadedmetadata = () => {
              videoRef.current!.play();
              resolve();
            };
          });
        }

        setStatus("Loading model...");
        const { FilesetResolver, PoseLandmarker } = await import("@mediapipe/tasks-vision");
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );

        const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numPoses: 1,
        });

        poseLandmarkerRef.current = poseLandmarker;
        setStatus("Model ready");
        setIsLoading(false);
        predict();

      } catch (err: any) {
        console.error(err);
        setError("❌ " + err.message);
        setIsLoading(false);
      }
    };

    init();

    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, [predict]);

  if (error) {
    return <div className="text-red-500 text-center mt-8">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Pose Estimation</h1>
      {isLoading && <p className="mb-4">{status}</p>}

      <video
        ref={videoRef}
        muted
        autoPlay
        playsInline
        style={{ display: 'none' }}
      />

      <canvas
        ref={canvasRef}
        className="border border-blue-500 rounded"
        width={640}
        height={480}
      />

      <div className="mt-4 text-center font-semibold" style={{ color: formStatus.color }}>
        {formStatus.text}
      </div>

      <div className="mt-4 text-center font-bold text-lg text-yellow-400">
        Reps: {repCount}
      </div>
    </div>
  );
};

export default PoseEstimation;
