import React from "react";
import "./ImagePreview.css";

interface ImagePreviewProps {
  file: File | null;
}

function ImagePreview({ file }: ImagePreviewProps) {
  return (
    <div className="container">
      {file && (
        <img
          src={file ? URL.createObjectURL(file) : ""}
          style={{
            width: "80%",
            height: "auto",
            placeSelf: "center",
          }}
        />
      )}
      <p style={file ? { fontWeight: "bold" } : { fontStyle: "italic" }}>
        {file ? file.name : "No file selected"}
      </p>
    </div>
  );
}

export default ImagePreview;
