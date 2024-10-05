import React from "react";
import "./Watermarker.css";

import SingleFileUpload from "./SingleFileUpload/SingleFileUpload";
import ImagePreview from "./ImagePreview/ImagePreview";

function Watermarker() {
  const [file, setFile] = React.useState<File | null>(null);

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
    </div>
  );
}

export default Watermarker;
