import React, { useEffect, useRef } from 'react';

type AmbientMode = 'idle' | 'processing' | 'resolved';

interface AmbientBackgroundProps {
  mode: AmbientMode;
}

// ----------------------------------------------------------------------
// CONFIGURATION & CONSTANTS
// ----------------------------------------------------------------------

// Strict Color Palette (R, G, B)
const COLORS = {
  sageBase: { r: 90, g: 110, b: 98 },    // #5A6E62
  ochreBase: { r: 156, g: 131, b: 98 },  // #9C8362
  sageHigh: { r: 122, g: 148, b: 134 },  // #7A9486
  ochreHigh: { r: 196, g: 168, b: 130 }, // #C4A882
};

// Helper: Linear Interpolation
const lerp = (start: number, end: number, t: number) => {
  return start * (1 - t) + end * t;
};

// ----------------------------------------------------------------------
// ORB LOGIC
// ----------------------------------------------------------------------

class Orb {
  angle: number;
  colorType: 'sage' | 'ochre';
  phaseOffset: number;
  speedMod: number;
  
  constructor(index: number, total: number) {
    // Distribute angles evenly initially
    this.angle = (index / total) * Math.PI * 2;
    this.colorType = index % 2 === 0 ? 'sage' : 'ochre';
    
    // Random offsets for organic movement variance
    this.phaseOffset = Math.random() * 1000;
    this.speedMod = 0.8 + Math.random() * 0.4; // 0.8x to 1.2x speed variance
  }

  update(ctx: CanvasRenderingContext2D, w: number, h: number, intensity: number, time: number) {
    const minDim = Math.min(w, h);
    
    // 1. DYNAMICS CALCULATIONS based on Intensity (0=Idle, 1=Processing)
    
    // Orbit Radius: Large & Loose -> Small & Tight
    const baseOrbitRadius = lerp(minDim * 0.25, minDim * 0.06, intensity);
    // Add breathing to orbit radius
    const radiusBreath = Math.sin(time * 0.02 + this.phaseOffset) * (30 * intensity);
    const orbitRadius = baseOrbitRadius + radiusBreath;
    
    // Orb Size: Large & Soft -> Small & Sharp
    // Reduced size by 50% (0.175 and 0.06)
    const orbSize = lerp(minDim * 0.175, minDim * 0.06, intensity);
    
    // Speed: Meditative -> Impossibly Fast
    // Using intensity^2 for dramatic acceleration curve
    const baseSpeed = lerp(0.001, 0.18, intensity * intensity);
    // Add individual variance so they don't move in perfect lockstep
    const variableSpeed = baseSpeed * this.speedMod;
    // Add energy exchange simulation (sine wave speed modulation)
    const energyFlux = Math.sin(time * 0.05 + this.phaseOffset) * 0.05 * intensity;
    
    this.angle += variableSpeed + energyFlux;

    // 2. POSITIONING

    // Center Drift (Idle only)
    // When processing, center locks to middle of screen
    const driftAmp = lerp(50, 0, intensity);
    const centerX = w / 2 + Math.sin(time * 0.0005 + this.phaseOffset) * driftAmp;
    const centerY = h / 2 + Math.cos(time * 0.0007 + this.phaseOffset) * driftAmp;

    let x = centerX + Math.cos(this.angle) * orbitRadius;
    let y = centerY + Math.sin(this.angle) * orbitRadius;

    // Jitter (Processing only)
    // High frequency noise for "vibrating energy"
    if (intensity > 0.01) {
      const jitterAmount = lerp(0, 12, intensity);
      x += (Math.random() - 0.5) * jitterAmount;
      y += (Math.random() - 0.5) * jitterAmount;
    }

    // 3. COLOR & RENDER

    // Color Interpolation (Base -> Highlight)
    const cBase = this.colorType === 'sage' ? COLORS.sageBase : COLORS.ochreBase;
    const cHigh = this.colorType === 'sage' ? COLORS.sageHigh : COLORS.ochreHigh;
    
    const r = Math.round(lerp(cBase.r, cHigh.r, intensity));
    const g = Math.round(lerp(cBase.g, cHigh.g, intensity));
    const b = Math.round(lerp(cBase.b, cHigh.b, intensity));
    
    // Opacity (Idle: Low, Processing: High)
    const opacity = lerp(0.35, 0.7, intensity);

    // Streaking / Deformation
    // Stretch the orb along its tangential velocity vector
    const stretchFactor = lerp(1, 2.2, intensity); // Significant stretch at high speed
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(this.angle + Math.PI / 2); // Rotate to tangent
    ctx.scale(1, stretchFactor); 
    
    ctx.beginPath();
    ctx.arc(0, 0, orbSize, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    ctx.fill();
    ctx.restore();
  }
}

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

export const AmbientBackground: React.FC<AmbientBackgroundProps> = ({ mode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Refs for animation loop stability
  const modeRef = useRef(mode);
  const intensityRef = useRef(0); // 0.0 to 1.0
  const timeRef = useRef(0);
  const reqRef = useRef<number>();
  const orbsRef = useRef<Orb[]>([]);

  // Sync prop to ref
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  // Initialize Particle System
  if (orbsRef.current.length === 0) {
    orbsRef.current = [
      new Orb(0, 3), // Sage
      new Orb(1, 3), // Ochre
      new Orb(2, 3), // Sage
    ];
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High DPI scaling (optional but good for sharpness if we weren't blurring)
    // For this blurred effect, standard 1:1 is actually more performant.

    const animate = () => {
      // 1. Resize Handling
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }

      // 2. State Transition Logic
      const targetIntensity = modeRef.current === 'processing' ? 1.0 : 0.0;
      
      // Easing: Fast spin-up, Slower spin-down
      // 0.04 per frame @ 60fps ~= 25 frames (~400ms) to 1.0
      // 0.02 per frame @ 60fps ~= 50 frames (~800ms) to 0.0
      const step = targetIntensity > intensityRef.current ? 0.04 : 0.02;
      
      // Simple linear approach to target
      if (Math.abs(targetIntensity - intensityRef.current) < step) {
        intensityRef.current = targetIntensity;
      } else {
        const dir = targetIntensity > intensityRef.current ? 1 : -1;
        intensityRef.current += step * dir;
      }
      
      // 3. Draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Handle "Resolved" state visibility (Dimmer idle)
      // If we are in 'resolved' mode and intensity is near 0 (idle physics), drop opacity
      const isResolved = modeRef.current === 'resolved' && intensityRef.current < 0.1;
      const targetGlobalAlpha = isResolved ? 0.3 : 1.0;
      // Smooth alpha transition could be added here, but direct assignment is okay for now
      ctx.globalAlpha = targetGlobalAlpha;

      orbsRef.current.forEach(orb => {
        orb.update(ctx, canvas.width, canvas.height, intensityRef.current, timeRef.current);
      });

      // 4. Loop
      timeRef.current += 1;
      reqRef.current = requestAnimationFrame(animate);
    };

    reqRef.current = requestAnimationFrame(animate);

    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, []); // Run once on mount

  return (
    <div className="fixed inset-0 z-0 bg-background pointer-events-none" aria-hidden="true">
      <canvas 
        ref={canvasRef}
        className="block w-full h-full"
        style={{ 
          filter: 'blur(80px)', // The heavy glass effect
          transform: 'translateZ(0)' // Hardware acceleration hint
        }}
      />
    </div>
  );
};