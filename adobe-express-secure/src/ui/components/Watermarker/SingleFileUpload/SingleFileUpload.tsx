import React, { useState } from "react";
import "./SingleFileUpload.css";

import { Button } from "@swc-react/button";

interface SingleFileUploadProps {
  onFileChange: (file: File | null) => void;
}

const SingleFileUpload: React.FC<SingleFileUploadProps> = ({
  onFileChange,
}) => {
  const [file, setFile] = useState<File>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    setFile(selectedFile);
    onFileChange(selectedFile);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const selectedFile = event.dataTransfer.files
      ? event.dataTransfer.files[0]
      : null;
    setFile(selectedFile);
    onFileChange(selectedFile);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(event) => event.preventDefault()}
      className="container"
      style={{
        border: "2px dashed #ccc",
        padding: "20px",
      }}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
        id="fileInput"
      />
      <label htmlFor="fileInput">
        <Button variant="accent">Upload</Button>
      </label>
      <p>or drag and drop image here</p>
    </div>
  );
};

export default SingleFileUpload;
