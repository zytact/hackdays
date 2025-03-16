'use client';
import { cn } from '@/lib/utils';
import React, { useEffect, useRef, useState } from 'react';
import { createNoise3D } from 'simplex-noise';

export const WavyBackground = ({
    children,
    className,
    containerClassName,
    colors,
    waveWidth,
    backgroundFill,
    blur = 10,
    speed = 'fast',
    waveOpacity = 0.5,
    ...props
}: {
    children?: React.ReactNode;
    className?: string;
    containerClassName?: string;
    colors?: string[];
    waveWidth?: number;
    backgroundFill?: string;
    blur?: number;
    speed?: 'slow' | 'fast';
    waveOpacity?: number;
    [key: string]: unknown;
}) => {
    const noise = createNoise3D();
    let w: number,
        h: number,
        nt: number,
        i: number,
        x: number,
        ctx: CanvasRenderingContext2D | null,
        canvas: HTMLCanvasElement | null;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const getSpeed = () => {
        switch (speed) {
            case 'slow':
                return 0.001;
            case 'fast':
                return 0.002;
            default:
                return 0.001;
        }
    };

    const init = () => {
        canvas = canvasRef.current;
        if (canvas) {
            ctx = canvas.getContext('2d');
        }
        if (ctx) {
            if (ctx) {
                if (ctx) {
                    if (ctx) {
                        w = ctx.canvas.width = window.innerWidth;
                    }
                    if (ctx) {
                        if (ctx) {
                            h = ctx.canvas.height = window.innerHeight;
                        }
                    }
                    if (ctx) {
                        ctx.filter = `blur(${blur}px)`;
                    }
                }
            }
        }
        nt = 0;
        window.onresize = function () {
            if (ctx) {
                w = ctx.canvas.width = window.innerWidth;
                h = ctx.canvas.height = window.innerHeight;
                ctx.filter = `blur(${blur}px)`;
            }
        };
        render();
    };

    const waveColors = colors ?? [
        '#38bdf8',
        '#2dd4bf',
        '#22d3ee',
        '#0d9488',
        '#0f766e',
    ];
    const drawWave = (n: number) => {
        nt += getSpeed();
        for (i = 0; i < n; i++) {
            if (ctx) {
                ctx.beginPath();
                ctx.lineWidth = waveWidth || 50;
                ctx.strokeStyle = waveColors[i % waveColors.length];
                ctx.moveTo(0, h * 0.5); // Start the path at the left edge
                for (x = 0; x < w; x += 5) {
                    const y = noise(x / 800, 0.3 * i, nt) * 100;
                    ctx.lineTo(x, y + h * 0.5);
                }
                ctx.stroke();
                ctx.closePath();
            }
        }
    };

    let animationId: number;
    const render = () => {
        if (!ctx) return;
        ctx.fillStyle = backgroundFill || 'black';
        ctx.globalAlpha = waveOpacity || 0.5;
        ctx.fillRect(0, 0, w, h);
        drawWave(5);
        animationId = requestAnimationFrame(render);
    };

    useEffect(() => {
        init();
        return () => {
            cancelAnimationFrame(animationId);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [isSafari, setIsSafari] = useState(false);
    useEffect(() => {
        // I'm sorry but i have got to support it on safari.
        setIsSafari(
            typeof window !== 'undefined' &&
                navigator.userAgent.includes('Safari') &&
                !navigator.userAgent.includes('Chrome')
        );
    }, []);

    return (
        <div
            className={cn(
                'h-screen flex flex-col items-center justify-center',
                containerClassName
            )}
        >
            <canvas
                className="absolute inset-0 z-0"
                ref={canvasRef}
                id="canvas"
                style={{
                    ...(isSafari ? { filter: `blur(${blur}px)` } : {}),
                }}
            ></canvas>
            <div className={cn('relative z-10', className)} {...props}>
                {children}
            </div>
        </div>
    );
};
