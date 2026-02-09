import React, { useRef, useEffect, useState } from 'react';
import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera as CameraIcon, Hand } from 'lucide-react';

interface FingerDetectionProps {
  onFingerCountUpdate: (count: number) => void;
}

const FingerDetection: React.FC<FingerDetectionProps> = ({ onFingerCountUpdate }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [fingerCount, setFingerCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Performance optimization refs
  const frameRequestRef = useRef<number | undefined>(undefined);
  const lastFrameTimeRef = useRef<number>(0);
  const lastFingerCountRef = useRef<number>(0);
  const lastCallbackTimeRef = useRef<number>(0);
  const targetFPS = 30; // Limit FPS for smoother performance
  const frameInterval = 1000 / targetFPS;

  const countFingers = (landmarks: any[], handedness: string): number => {
    let count = 0;
    
    // Thumb detection based on handedness with improved accuracy and threshold
    const thumbTip = landmarks[4];
    const thumbIP = landmarks[3];
    const thumbMCP = landmarks[2];
    
    // Add threshold for more reliable detection
    const thumbThreshold = 0.02;
    
    if (handedness === 'Right') {
      // For right hand, thumb extends to the right
      if ((thumbTip.x - thumbIP.x) > thumbThreshold && (thumbTip.x - thumbMCP.x) > thumbThreshold) {
        count++;
      }
    } else {
      // For left hand, thumb extends to the left
      if ((thumbIP.x - thumbTip.x) > thumbThreshold && (thumbMCP.x - thumbTip.x) > thumbThreshold) {
        count++;
      }
    }
    
    // Other fingers with improved detection using PIP joints and thresholds
    const fingerThreshold = 0.015; // Small threshold for more reliable detection
    
    // Index finger - check if tip is significantly higher than both joints
    if (landmarks[8].y < (landmarks[6].y - fingerThreshold) && landmarks[8].y < (landmarks[5].y - fingerThreshold)) {
      count++;
    }
    
    // Middle finger
    if (landmarks[12].y < (landmarks[10].y - fingerThreshold) && landmarks[12].y < (landmarks[9].y - fingerThreshold)) {
      count++;
    }
    
    // Ring finger  
    if (landmarks[16].y < (landmarks[14].y - fingerThreshold) && landmarks[16].y < (landmarks[13].y - fingerThreshold)) {
      count++;
    }
    
    // Pinky finger
    if (landmarks[20].y < (landmarks[18].y - fingerThreshold) && landmarks[20].y < (landmarks[17].y - fingerThreshold)) {
      count++;
    }

    return count;
  };

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    let hands: Hands | null = null;
    let camera: Camera | null = null;
    let isMounted = true;

    const initializeCamera = async () => {
      try {
        // Ensure video element is ready
        if (!videoRef.current || !canvasRef.current || !isMounted) return;

        hands = new Hands({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 0, // Use fastest model for smooth performance
          minDetectionConfidence: 0.5, // Balanced for responsiveness and accuracy
          minTrackingConfidence: 0.3, // Lower for smoother tracking
          selfieMode: true, // Enable selfie mode for mirrored experience
        });

        hands.onResults((results) => {
          if (!isMounted || !canvasRef.current) return;
          
          // Frame rate limiting for smoother performance
          const now = performance.now();
          if (now - lastFrameTimeRef.current < frameInterval) {
            return;
          }
          lastFrameTimeRef.current = now;
          
          const canvas = canvasRef.current;
          const ctx = canvas?.getContext('2d');
          if (!canvas || !ctx) return;
          
          // Use requestAnimationFrame for smoother rendering
          if (frameRequestRef.current) {
            cancelAnimationFrame(frameRequestRef.current);
          }
          
          frameRequestRef.current = requestAnimationFrame(() => {
            if (!isMounted || !canvas || !ctx) return;
            
            // Save context state for performance
            ctx.save();
            
            // Clear canvas efficiently
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw video frame (mirrored for natural feel) with optimized scaling
            if (results.image && videoRef.current) {
              ctx.scale(-1, 1);
              ctx.drawImage(results.image, -canvas.width, 0, canvas.width, canvas.height);
            }
            
            // Restore context to avoid transform issues
            ctx.restore();

            let detectedCount = 0;

            if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
              const landmarks = results.multiHandLandmarks[0];
              const handedness = results.multiHandedness?.[0]?.label === 'Left' ? 'Right' : 'Left';
              
              // Batch drawing operations for better performance
              ctx.save();
              
              // Draw hand connections in blue with mirrored coordinates
              ctx.strokeStyle = '#4285F4';
              ctx.lineWidth = 2;
              ctx.lineCap = 'round';
              ctx.lineJoin = 'round';
              
              const connections = [
                [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
                [0, 5], [5, 6], [6, 7], [7, 8], // Index finger
                [0, 9], [9, 10], [10, 11], [11, 12], // Middle finger
                [0, 13], [13, 14], [14, 15], [15, 16], // Ring finger
                [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
                [5, 9], [9, 13], [13, 17] // Palm connections
              ];
              
              ctx.beginPath();
              connections.forEach(([startIdx, endIdx]) => {
                const start = landmarks[startIdx];
                const end = landmarks[endIdx];
                // Mirror the x coordinates to match the mirrored video
                const startX = canvas.width - (start.x * canvas.width);
                const startY = start.y * canvas.height;
                const endX = canvas.width - (end.x * canvas.width);
                const endY = end.y * canvas.height;
                
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
              });
              ctx.stroke();
              
              // Draw landmarks as white dots with mirrored coordinates - batch operation
              ctx.fillStyle = '#ffffff';
              landmarks.forEach((landmark) => {
                const x = canvas.width - (landmark.x * canvas.width); // Mirror x coordinate
                const y = landmark.y * canvas.height;
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, 2 * Math.PI);
                ctx.fill();
              });

              detectedCount = countFingers(landmarks, handedness);
              
              // Enhanced finger count display with better performance
              ctx.fillStyle = 'rgba(66, 133, 244, 0.95)';
              ctx.fillRect(15, 15, 200, 60);
              ctx.fillStyle = '#fff';
              ctx.font = 'bold 20px Arial';
              ctx.fillText(`${detectedCount} finger${detectedCount !== 1 ? 's' : ''}`, 25, 40);
              
              if (detectedCount >= 1 && detectedCount <= 4) {
                ctx.font = 'bold 16px Arial';
                ctx.fillStyle = '#E8F0FE';
                ctx.fillText(`→ Option ${String.fromCharCode(64 + detectedCount)}`, 25, 60);
              }
              
              ctx.restore();
            }

            if (isMounted) {
              // Always update finger count to ensure selection logic works properly
              setFingerCount(detectedCount);
              
              // Only call parent callback if count actually changed to reduce parent re-renders
              if (detectedCount !== lastFingerCountRef.current) {
                lastFingerCountRef.current = detectedCount;
                onFingerCountUpdate(detectedCount);
              } else {
                // Still call callback periodically to ensure selection logic gets updates
                const now = performance.now();
                if (now - lastCallbackTimeRef.current >= 100) { // Every 100ms
                  onFingerCountUpdate(detectedCount);
                  lastCallbackTimeRef.current = now;
                }
              }
            }
          });
        });

        // Initialize camera with optimized settings for smooth performance
        camera = new Camera(videoRef.current!, {
          onFrame: async () => {
            if (hands && videoRef.current && isMounted) {
              try {
                // Throttle frame processing for smoother performance
                const now = performance.now();
                if (now - lastFrameTimeRef.current >= frameInterval) {
                  await hands.send({ image: videoRef.current });
                  lastFrameTimeRef.current = now;
                }
              } catch (err) {
                // Silently handle errors to prevent lag
              }
            }
          },
          width: 640,
          height: 480,
          facingMode: 'user', // Use front camera
        });

        await camera.start();
        
        if (isMounted) {
          setIsLoading(false);
          setError(null);
        }
      } catch (err) {
        console.error('Failed to initialize camera:', err);
        if (isMounted) {
          setError('Camera initialization failed. Please check permissions and refresh the page.');
          setIsLoading(false);
        }
      }
    };

    // Small delay to ensure DOM is ready
    const initTimer = setTimeout(initializeCamera, 100);

    return () => {
      isMounted = false;
      clearTimeout(initTimer);
      
      // Cancel any pending animation frames
      if (frameRequestRef.current) {
        cancelAnimationFrame(frameRequestRef.current);
      }
      
      if (camera) {
        try {
          camera.stop();
        } catch (err) {
          console.error('Error stopping camera:', err);
        }
      }
      
      if (hands) {
        try {
          hands.close();
        } catch (err) {
          console.error('Error closing hands:', err);
        }
      }
    };
  }, [onFingerCountUpdate]);

  const getFingerCountColor = (count: number) => {
    switch (count) {
      case 1: return 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'; // Google Blue
      case 2: return 'bg-gradient-to-r from-green-600 to-green-700 text-white'; // Google Green  
      case 3: return 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white'; // Google Yellow
      case 4: return 'bg-gradient-to-r from-red-600 to-red-700 text-white'; // Google Red
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-gray-800 text-lg">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Hand className="h-5 w-5 text-white" />
          </div>
          Hand Gesture Detection
        </CardTitle>
        <div className="flex items-center gap-3 mt-2">
          <Badge className={`px-3 py-1.5 text-sm font-medium ${getFingerCountColor(fingerCount)}`}>
            {fingerCount} {fingerCount === 1 ? 'Finger' : 'Fingers'}
          </Badge>
          {fingerCount > 0 && fingerCount <= 4 && (
            <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50 px-3 py-1.5">
              → Option {String.fromCharCode(64 + fingerCount)}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/95 rounded-lg z-10 border border-gray-200">
              <div className="text-center text-gray-700">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
                  <CameraIcon className="h-6 w-6 text-white" />
                </div>
                <p className="text-sm font-medium">Initializing camera...</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-50 border border-red-200 rounded-lg z-10">
              <div className="text-center text-red-700 p-4">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CameraIcon className="h-6 w-6 text-white" />
                </div>
                <p className="font-medium mb-1">{error}</p>
                <p className="text-xs text-red-600">Please allow camera access and refresh the page</p>
              </div>
            </div>
          )}
          
          <video ref={videoRef} className="hidden" />
          <canvas 
            ref={canvasRef} 
            width={640} 
            height={480} 
            className="w-full h-auto border border-gray-200 rounded-lg bg-gray-50"
            style={{
              transform: 'translateZ(0)', // Force hardware acceleration
              willChange: 'transform', // Hint to browser for optimization
            }}
          />
        </div>
        
        {/* Clean Gesture Guide */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-gray-800 font-medium mb-3 text-sm">Gesture Controls</h4>
          <div className="grid grid-cols-4 gap-2">
            <div className="flex flex-col items-center p-2 bg-white border border-blue-200 rounded-lg">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold mb-1">1</div>
              <span className="text-xs text-blue-700 font-medium">Option A</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-white border border-green-200 rounded-lg">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold mb-1">2</div>
              <span className="text-xs text-green-700 font-medium">Option B</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-white border border-yellow-200 rounded-lg">
              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold mb-1">3</div>
              <span className="text-xs text-yellow-700 font-medium">Option C</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-white border border-red-200 rounded-lg">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold mb-1">4</div>
              <span className="text-xs text-red-700 font-medium">Option D</span>
            </div>
          </div>
          
          <div className="mt-3 p-3 bg-white border border-gray-200 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              <span className="font-medium">Hold gesture for 2 seconds to select</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FingerDetection;