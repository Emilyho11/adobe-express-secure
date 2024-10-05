import React, { useEffect, useRef } from "react";
import "./ImageGridCanvas.css";

interface ImageGridCanvasProps {
  imageFile: File;
  width: number;
  height: number;
  rows: number;
  columns: number;
  xGap: number;
  yGap: number;
  opacity: number;
  randomness: number; // 0 is no randomness, 1 is max randomness, min is 0.1
}

const ImageGridCanvas: React.FC<ImageGridCanvasProps> = ({
  imageFile,
  width,
  height,
  rows,
  columns,
  xGap,
  yGap,
  opacity,
  randomness,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (canvas && ctx) {
      const img = new Image();
      img.src = URL.createObjectURL(imageFile);

      img.onload = () => {
        canvas.width = width;
        canvas.height = height;

        const imgWidth = (width - (columns - 1) * xGap) / columns;
        const imgHeight = (height - (rows - 1) * yGap) / rows;

        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < columns; col++) {
            const x = col * (imgWidth + xGap);
            const y = row * (imgHeight + yGap);
            ctx.drawImage(img, x, y, imgWidth, imgHeight);
          }
        }

        transformCanvasWithRandom(ctx, width, height, opacity);
      };
    }
  }, [
    imageFile,
    width,
    height,
    rows,
    columns,
    xGap,
    yGap,
    opacity,
    randomness,
  ]);

  function transformCanvasWithRandom(ctx, width, height, opacity) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
      // if pixel isn't transparent
      if (data[i + 3] > 0) {
        data[i] =
          (data[i] + Math.floor(Math.random() * 256) * randomness) % 255;
        data[i + 1] =
          (data[i + 1] + Math.floor(Math.random() * 256) * randomness) % 255;
        data[i + 2] =
          (data[i + 2] + Math.floor(Math.random() * 256) * randomness) % 255;
        // update opacity
        data[i + 3] = Math.floor(data[i + 3] * opacity);
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }

  return <canvas id="preview-canvas" ref={canvasRef}></canvas>;
};

export default ImageGridCanvas;
