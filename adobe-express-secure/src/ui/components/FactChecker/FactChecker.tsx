import React, { useEffect } from "react";
import "./FactChecker.css";

import { Button } from "@swc-react/button";
import { RenditionFormat } from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";

interface FactCheckerProps {
  addOnUISdk: any;
  sandboxProxy: any;
}

const BACKEND_FEEDBACK_ENDPOINT = "";

function FactChecker({ addOnUISdk, sandboxProxy }: FactCheckerProps) {
  const [feedback, setFeedback] = React.useState<string>("");

  const getFeedback = async () => {
    const rendition = await addOnUISdk.app.document.createRenditions({
      range: addOnUISdk.constants.Range.currentPage,
      format: RenditionFormat.png,
    });

    const blob = rendition[0].blob;

    // send the image to the backend
    const formData = new FormData();
    formData.append("file", blob, "image.png");

    // placeholder
    if (!BACKEND_FEEDBACK_ENDPOINT) {
      console.error("Please set the BACKEND_FEEDBACK_ENDPOINT variable.");
      setFeedback("Not yet implemented.");
      return;
    }

    fetch(BACKEND_FEEDBACK_ENDPOINT, {
      method: "POST",
      body: formData,
    }).then(async (res) => {
      const data = await res.json();
      setFeedback(data);
    });
  };

  return (
    <div className="container">
      <Button variant="accent" onClick={async () => getFeedback()}>
        Get feedback
      </Button>
      <p>{feedback}</p>
    </div>
  );
}

export default FactChecker;
