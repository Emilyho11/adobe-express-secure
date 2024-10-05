import React, { useEffect, useState } from "react";
import "./Watermarker.css";

import { Button } from "@swc-react/button";
import { Slider } from "@swc-react/slider";

import SingleFileUpload from "./SingleFileUpload/SingleFileUpload";
import ImagePreview from "./ImagePreview/ImagePreview";
import ImageGridCanvas from "./ImageGridCanvas/ImageGridCanvas";

function Watermarker({ addOnUISdk }: { addOnUISdk: any }) {
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [rows, setRows] = useState<number>(3);
  const [columns, setColumns] = useState<number>(5);
  const [opacity, setOpacity] = useState<number>(0.25);
  const [xGap, setXGap] = useState<number>(50);
  const [yGap, setYGap] = useState<number>(50);
  const [randomness, setRandomness] = useState<number>(0.5);

  useEffect(() => {
    async function updateDimensions() {
      const pages = await addOnUISdk.app.document.getPagesMetadata({
        range: addOnUISdk.constants.Range.currentPage,
      });
      const { width, height } = pages[0].size;
      setWidth(width);
      setHeight(height);
      console.log("dimensions : ", width, height);
    }
    updateDimensions();
  }, []);

  const addWatermarkToDocument = async () => {
    const canvas = document.getElementById(
      "preview-canvas"
    ) as HTMLCanvasElement;

    // Convert canvas to Blob and set up download
    canvas.toBlob((blob) => {
      addOnUISdk.app.document.addImage(blob);
    });
  };

  return (
    <div className="container">
      <p>Step 1: Upload an image to use as a watermark.</p>
      <SingleFileUpload
        onFileChange={(f) => {
          setFile(f);
        }}
      ></SingleFileUpload>

      <p>Step 2: Preview watermark image.</p>
      <ImagePreview file={file}></ImagePreview>

      <p>Step 3: Adjust watermark settings.</p>
      <div className="container">
        <Slider
          label="Rows"
          value={rows}
          editable={true}
          min={1}
          max={15}
          step={1}
          change={(value) => setRows((value as any).target.__value)}
        ></Slider>

        <Slider
          label="Columns"
          value={columns}
          editable={true}
          min={1}
          max={15}
          step={1}
          change={(value) => setColumns((value as any).target.__value)}
        ></Slider>

        <Slider
          label="Opacity"
          value={opacity}
          editable={true}
          min={0}
          max={1}
          step={0.01}
          format-options='{
            "style": "percent"
        }'
          change={(value) => {
            setOpacity((value as any).target.__value);
          }}
        ></Slider>

        <Slider
          label="X Gap"
          value={xGap}
          editable={true}
          min={0}
          max={500}
          step={10}
          change={(value) => setXGap((value as any).target.__value)}
        ></Slider>

        <Slider
          label="Y Gap"
          value={yGap}
          editable={true}
          min={0}
          max={500}
          step={10}
          change={(value) => setYGap((value as any).target.__value)}
        ></Slider>

        <Slider
          label="Randomness"
          value={randomness}
          editable={true}
          min={0.1}
          max={1}
          step={0.1}
          format-options='{
            "style": "percent"
        }'
          change={(value) => {
            setRandomness((value as any).target.__value);
          }}
        ></Slider>
      </div>

      <p>Step 4: Review and apply the watermark.</p>
      <Button
        variant="accent"
        onClick={() => {
          console.log("clicked");
          addWatermarkToDocument();
        }}
        disabled={!file}
      >
        Add Watermark
      </Button>

      {file ? (
        <ImageGridCanvas
          imageFile={file}
          width={width}
          height={height}
          rows={rows}
          columns={columns}
          xGap={xGap}
          yGap={yGap}
          opacity={opacity}
          randomness={randomness}
        />
      ) : (
        <p style={{ fontStyle: "italic" }}>
          No preview available. Upload an image to start!
        </p>
      )}
    </div>
  );
}

export default Watermarker;
