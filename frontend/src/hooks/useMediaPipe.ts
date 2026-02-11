import { useEffect, useRef, useState, useCallback, RefObject } from "react";
import {
    FaceLandmarker,
    FilesetResolver,
    DrawingUtils,
    FaceLandmarkerResult,
} from "@mediapipe/tasks-vision";

export interface BodyLanguageMetrics {
    eyeContactScore: number;      // 0-100
    expressionScore: number;      // 0-100
    headStabilityScore: number;   // 0-100
    confidenceScore: number;      // 0-100 weighted composite
    faceDetected: boolean;
    currentExpression: string;    // "Neutral" | "Happy" | "Tense"
}

const DEFAULT_METRICS: BodyLanguageMetrics = {
    eyeContactScore: 0,
    expressionScore: 0,
    headStabilityScore: 0,
    confidenceScore: 0,
    faceDetected: false,
    currentExpression: "—",
};

// Blendshape category names from MediaPipe
const SMILE_SHAPES = ["mouthSmileLeft", "mouthSmileRight"];
const FROWN_SHAPES = ["mouthFrownLeft", "mouthFrownRight"];
const BROW_DOWN_SHAPES = ["browDownLeft", "browDownRight"];

// Eye landmarks (MediaPipe face mesh indices)
const LEFT_EYE_OUTER = 33;
const LEFT_EYE_INNER = 133;
const LEFT_IRIS_CENTER = 468;
const RIGHT_EYE_OUTER = 362;
const RIGHT_EYE_INNER = 263;
const RIGHT_IRIS_CENTER = 473;

function clamp(val: number, min: number, max: number) {
    return Math.max(min, Math.min(max, val));
}

function computeEyeContactScore(landmarks: any[]): number {
    if (!landmarks || landmarks.length < 478) return 50;

    // Compute how centered the iris is within the eye opening
    const leftOuter = landmarks[LEFT_EYE_OUTER];
    const leftInner = landmarks[LEFT_EYE_INNER];
    const leftIris = landmarks[LEFT_IRIS_CENTER];

    const rightOuter = landmarks[RIGHT_EYE_OUTER];
    const rightInner = landmarks[RIGHT_EYE_INNER];
    const rightIris = landmarks[RIGHT_IRIS_CENTER];

    // Horizontal ratio: 0 = looking fully outer, 1 = looking fully inner
    const leftEyeWidth = Math.abs(leftInner.x - leftOuter.x);
    const leftIrisPos = leftEyeWidth > 0 ? (leftIris.x - leftOuter.x) / leftEyeWidth : 0.5;

    const rightEyeWidth = Math.abs(rightInner.x - rightOuter.x);
    const rightIrisPos = rightEyeWidth > 0 ? (rightIris.x - rightOuter.x) / rightEyeWidth : 0.5;

    // Center is ~0.5 for both eyes. Distance from center → lower score
    const leftDeviation = Math.abs(leftIrisPos - 0.5);
    const rightDeviation = Math.abs(rightIrisPos - 0.5);
    const avgDeviation = (leftDeviation + rightDeviation) / 2;

    // Map: 0 deviation → 100, 0.3+ deviation → 0
    const score = clamp((1 - avgDeviation / 0.3) * 100, 0, 100);
    return Math.round(score);
}

function computeExpressionScore(blendshapes: any[]): { score: number; label: string } {
    if (!blendshapes || blendshapes.length === 0) return { score: 50, label: "Neutral" };

    const shapes = blendshapes[0]?.categories || [];
    const shapeMap = new Map<string, number>();
    shapes.forEach((s: any) => shapeMap.set(s.categoryName, s.score));

    const smileAvg =
        ((shapeMap.get(SMILE_SHAPES[0]) || 0) + (shapeMap.get(SMILE_SHAPES[1]) || 0)) / 2;
    const frownAvg =
        ((shapeMap.get(FROWN_SHAPES[0]) || 0) + (shapeMap.get(FROWN_SHAPES[1]) || 0)) / 2;
    const browDownAvg =
        ((shapeMap.get(BROW_DOWN_SHAPES[0]) || 0) + (shapeMap.get(BROW_DOWN_SHAPES[1]) || 0)) / 2;

    let label = "Neutral";
    let score = 60; // Neutral baseline

    if (smileAvg > 0.3) {
        label = "Happy";
        score = 70 + smileAvg * 30; // Up to 100
    } else if (frownAvg > 0.3 || browDownAvg > 0.4) {
        label = "Tense";
        score = 30 + (1 - Math.max(frownAvg, browDownAvg)) * 30;
    }

    return { score: clamp(Math.round(score), 0, 100), label };
}

function computeHeadStability(
    landmarks: any[],
    headPoseHistory: Array<{ yaw: number; pitch: number }>
): { score: number; history: Array<{ yaw: number; pitch: number }> } {
    if (!landmarks || landmarks.length < 10) return { score: 50, history: headPoseHistory };

    // Use nose tip and face edges to estimate rough yaw/pitch
    const noseTip = landmarks[1];
    const leftCheek = landmarks[234];
    const rightCheek = landmarks[454];
    const forehead = landmarks[10];
    const chin = landmarks[152];

    const faceWidth = Math.abs(rightCheek.x - leftCheek.x);
    const noseOffsetX = faceWidth > 0 ? (noseTip.x - (leftCheek.x + rightCheek.x) / 2) / faceWidth : 0;

    const faceHeight = Math.abs(chin.y - forehead.y);
    const noseOffsetY = faceHeight > 0 ? (noseTip.y - (forehead.y + chin.y) / 2) / faceHeight : 0;

    const newHistory = [...headPoseHistory, { yaw: noseOffsetX, pitch: noseOffsetY }].slice(-60);

    if (newHistory.length < 5) return { score: 70, history: newHistory };

    // Compute variance — lower variance = more stable
    const yawValues = newHistory.map((h) => h.yaw);
    const pitchValues = newHistory.map((h) => h.pitch);

    const yawMean = yawValues.reduce((a, b) => a + b, 0) / yawValues.length;
    const pitchMean = pitchValues.reduce((a, b) => a + b, 0) / pitchValues.length;

    const yawVariance = yawValues.reduce((acc, v) => acc + (v - yawMean) ** 2, 0) / yawValues.length;
    const pitchVariance = pitchValues.reduce((acc, v) => acc + (v - pitchMean) ** 2, 0) / pitchValues.length;

    const totalVariance = yawVariance + pitchVariance;

    // Map: 0 variance → 100, 0.01+ variance → 0
    const score = clamp((1 - totalVariance / 0.01) * 100, 0, 100);
    return { score: Math.round(score), history: newHistory };
}

export function useMediaPipe(
    videoRef: RefObject<HTMLVideoElement | null>,
    canvasRef: RefObject<HTMLCanvasElement | null>,
    enabled: boolean
) {
    const [metrics, setMetrics] = useState<BodyLanguageMetrics>(DEFAULT_METRICS);
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const headPoseHistoryRef = useRef<Array<{ yaw: number; pitch: number }>>([]);

    // Running averages for the whole session
    const sampleCountRef = useRef(0);
    const eyeContactAccRef = useRef(0);
    const expressionAccRef = useRef(0);
    const stabilityAccRef = useRef(0);

    const getSessionAverages = useCallback(() => {
        const n = sampleCountRef.current;
        if (n === 0) return null;
        return {
            eyeContactScore: Math.round(eyeContactAccRef.current / n),
            expressionScore: Math.round(expressionAccRef.current / n),
            headStabilityScore: Math.round(stabilityAccRef.current / n),
            confidenceScore: Math.round(
                (eyeContactAccRef.current / n * 0.35 +
                    expressionAccRef.current / n * 0.30 +
                    stabilityAccRef.current / n * 0.35)
            ),
        };
    }, []);

    const resetSessionAverages = useCallback(() => {
        sampleCountRef.current = 0;
        eyeContactAccRef.current = 0;
        expressionAccRef.current = 0;
        stabilityAccRef.current = 0;
        headPoseHistoryRef.current = [];
    }, []);

    // Initialize MediaPipe
    useEffect(() => {
        if (!enabled) return;

        let cancelled = false;

        const init = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Load WASM fileset
                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
                );

                if (cancelled) return;

                // Create FaceLandmarker
                const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath:
                            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
                        delegate: "GPU",
                    },
                    runningMode: "VIDEO",
                    numFaces: 1,
                    outputFaceBlendshapes: true,
                    outputFacialTransformationMatrixes: false,
                });

                if (cancelled) {
                    faceLandmarker.close();
                    return;
                }

                faceLandmarkerRef.current = faceLandmarker;

                // Request webcam
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 640, height: 480, facingMode: "user" },
                });

                if (cancelled) {
                    stream.getTracks().forEach((t) => t.stop());
                    faceLandmarker.close();
                    return;
                }

                streamRef.current = stream;

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    await videoRef.current.play();
                }

                setIsReady(true);
                setIsLoading(false);

                // Start detection loop
                const detect = () => {
                    if (cancelled) return;

                    const video = videoRef.current;
                    const canvas = canvasRef.current;

                    if (
                        !video ||
                        !canvas ||
                        !faceLandmarkerRef.current ||
                        video.readyState < 2
                    ) {
                        animationFrameRef.current = requestAnimationFrame(detect);
                        return;
                    }

                    const ctx = canvas.getContext("2d");
                    if (!ctx) {
                        animationFrameRef.current = requestAnimationFrame(detect);
                        return;
                    }

                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;

                    const result: FaceLandmarkerResult =
                        faceLandmarkerRef.current.detectForVideo(video, performance.now());

                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    if (result.faceLandmarks && result.faceLandmarks.length > 0) {
                        const landmarks = result.faceLandmarks[0];

                        // Draw face mesh
                        const drawingUtils = new DrawingUtils(ctx);
                        drawingUtils.drawConnectors(
                            landmarks,
                            FaceLandmarker.FACE_LANDMARKS_TESSELATION,
                            { color: "rgba(139, 92, 246, 0.15)", lineWidth: 0.5 }
                        );
                        drawingUtils.drawConnectors(
                            landmarks,
                            FaceLandmarker.FACE_LANDMARKS_FACE_OVAL,
                            { color: "rgba(139, 92, 246, 0.5)", lineWidth: 1.5 }
                        );
                        drawingUtils.drawConnectors(
                            landmarks,
                            FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS,
                            { color: "rgba(59, 130, 246, 0.8)", lineWidth: 1 }
                        );
                        drawingUtils.drawConnectors(
                            landmarks,
                            FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS,
                            { color: "rgba(59, 130, 246, 0.8)", lineWidth: 1 }
                        );

                        // Compute metrics
                        const eyeScore = computeEyeContactScore(landmarks);
                        const { score: exprScore, label: exprLabel } = computeExpressionScore(
                            result.faceBlendshapes || []
                        );
                        const { score: stabilityScore, history: newHistory } =
                            computeHeadStability(landmarks, headPoseHistoryRef.current);
                        headPoseHistoryRef.current = newHistory;

                        const confidence = Math.round(
                            eyeScore * 0.35 + exprScore * 0.30 + stabilityScore * 0.35
                        );

                        // Update running averages
                        sampleCountRef.current += 1;
                        eyeContactAccRef.current += eyeScore;
                        expressionAccRef.current += exprScore;
                        stabilityAccRef.current += stabilityScore;

                        setMetrics({
                            eyeContactScore: eyeScore,
                            expressionScore: exprScore,
                            headStabilityScore: stabilityScore,
                            confidenceScore: confidence,
                            faceDetected: true,
                            currentExpression: exprLabel,
                        });
                    } else {
                        setMetrics((prev) => ({
                            ...prev,
                            faceDetected: false,
                            currentExpression: "—",
                        }));
                    }

                    animationFrameRef.current = requestAnimationFrame(detect);
                };

                animationFrameRef.current = requestAnimationFrame(detect);
            } catch (err: any) {
                if (!cancelled) {
                    console.error("MediaPipe init error:", err);
                    if (err.name === "NotAllowedError") {
                        setError("Camera access denied. Body language analysis disabled.");
                    } else {
                        setError(err.message || "Failed to initialize body language analysis.");
                    }
                    setIsLoading(false);
                }
            }
        };

        init();

        return () => {
            cancelled = true;
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((t) => t.stop());
                streamRef.current = null;
            }
            if (faceLandmarkerRef.current) {
                faceLandmarkerRef.current.close();
                faceLandmarkerRef.current = null;
            }
            setIsReady(false);
            setMetrics(DEFAULT_METRICS);
        };
    }, [enabled, videoRef, canvasRef]);

    return {
        metrics,
        isReady,
        isLoading,
        error,
        getSessionAverages,
        resetSessionAverages,
    };
}
