import { useEffect, useState } from "react";

const Loader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [waveOffset, setWaveOffset] = useState(0);

  useEffect(() => {
    // Animate progress from 0 to 100
    const duration = 5000; // 5 seconds
    const steps = 100;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const progressInterval = setInterval(() => {
      currentStep++;
      setProgress(currentStep);

      if (currentStep >= 100) {
        clearInterval(progressInterval);
        setIsComplete(true);
        // Zoom animation then hide
        setTimeout(() => {
          setIsLoading(false);
        }, 800);
      }
    }, stepDuration);

    return () => clearInterval(progressInterval);
  }, []);

  useEffect(() => {
    const waveAnimation = setInterval(() => {
      setWaveOffset(prev => prev + 0.12);
    }, 50);
    
    return () => clearInterval(waveAnimation);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden">
      <div 
        className={`relative flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 transition-all duration-700 ease-in ${
          isComplete ? 'scale-150 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        <div className="relative mb-2 sm:mb-4 w-full max-w-full">
          {/* Container for proper sizing with descenders */}
          <div style={{ paddingTop: '10px', paddingBottom: '15px' }}>
            {/* Background text (gray) */}
            <div 
              className="font-black text-center select-none relative text-loader"
              style={{ 
                lineHeight: '1.3',
                letterSpacing: '-0.05em'
              }}
            >
              <span className="text-gray-700 block sm:inline">Talent by Design</span>
            </div>
            
            {/* Foreground text (white) with wave reveal effect */}
            <div 
              className="absolute top-0 left-0 w-full font-black text-center select-none text-loader"
              style={{
                lineHeight: '1.3',
                letterSpacing: '-0.05em',
                height: '100%',
                paddingTop: '10px',
                paddingBottom: '15px'
              }}
            >
              <div
                style={{
                  clipPath: `polygon(
                    0% ${100 - progress}%,
                    ${generateWavePoints(progress, waveOffset)}
                    100% 100%,
                    0% 100%
                  )`
                }}
              >
                <span className="text-white block sm:inline">Talent by Design</span>
              </div>
            </div>
          </div>
        </div>

        {/* Loading text with percentage */}
        <div className="text-center mt-2">
          <p className="text-xs sm:text-sm text-gray-400 tracking-wider">
            loading... {progress} %
          </p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@900&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
        }

        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* Responsive font sizes */
        .text-loader {
          font-size: 32px; /* Mobile */
        }

        @media (min-width: 480px) {
          .text-loader {
            font-size: 40px; /* Larger mobile */
          }
        }

        @media (min-width: 640px) {
          .text-loader {
            font-size: 50px; /* Tablet */
          }
        }

        @media (min-width: 768px) {
          .text-loader {
            font-size: 60px; /* Larger tablet */
          }
        }

        @media (min-width: 1024px) {
          .text-loader {
            font-size: 80px; /* Desktop */
          }
        }

        @media (min-width: 1280px) {
          .text-loader {
            font-size: 90px; /* Large desktop */
          }
        }

        /* Ensure text wraps on very small screens */
        @media (max-width: 380px) {
          .text-loader {
            font-size: 28px;
          }
        }
      `}</style>
    </div>
  );
};

// Generate wave points for polygon clip-path
function generateWavePoints(progress: number, offset: number): string {
  const points = [];
  const numPoints = 100;
  const amplitude = 4;
  const frequency = 2.5;
  
  // Scale progress to account for text height including descenders
  // At 100% progress, the wave should be at the top of the text
  const textHeightRatio = 0.7; // Adjust this to match when wave completes
  const adjustedProgress = progress * textHeightRatio;
  
  for (let i = 0; i <= numPoints; i++) {
    const x = (i / numPoints) * 100;
    const normalizedX = i / numPoints;
    
    const wave1 = Math.sin((normalizedX * Math.PI * frequency) + offset) * amplitude;
    const wave2 = Math.sin((normalizedX * Math.PI * frequency * 1.8) - offset * 1.5) * (amplitude * 0.6);
    const wave3 = Math.sin((normalizedX * Math.PI * frequency * 3.2) + offset * 0.8) * (amplitude * 0.35);
    const wave4 = Math.sin((normalizedX * Math.PI * frequency * 5) - offset * 2) * (amplitude * 0.2);
    
    const waveOffset = wave1 + wave2 + wave3 + wave4;
    const y = (100 - adjustedProgress) + waveOffset;
    
    points.push(`${x}% ${Math.max(-20, Math.min(120, y))}%`);
  }
  
  return points.join(', ') + ', 100% 120%,';
}

export default Loader;