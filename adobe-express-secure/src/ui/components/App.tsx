// To support: theme="express" scale="medium" color="light"
// import these spectrum web components modules:
import "@spectrum-web-components/theme/express/scale-medium.js";
import "@spectrum-web-components/theme/express/theme-light.js";

// To learn more about using "swc-react" visit:
// https://opensource.adobe.com/spectrum-web-components/using-swc-react/
import React from "react";
import "./App.css";

import { DocumentSandboxApi } from "../../models/DocumentSandboxApi";
import { AddOnSDKAPI } from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";

import { Theme } from "@swc-react/theme";
import { Accordion, AccordionItem } from "@swc-react/accordion";

import Watermarker from "./Watermarker/Watermarker";

const App = ({
  addOnUISdk,
  sandboxProxy,
}: {
  addOnUISdk: AddOnSDKAPI;
  sandboxProxy: DocumentSandboxApi;
}) => {
  // function handleClick() {
  //   sandboxProxy.createRectangle();
  // }

  return (
    // Please note that the below "<Theme>" component does not react to theme changes in Express.
    // You may use "addOnUISdk.app.ui.theme" to get the current theme and react accordingly.
    <Theme theme="express" scale="medium" color="light">
      <h1 style={{ textAlign: "center", textWrap: "pretty" }}>
        Express Secure Suite
      </h1>
      <div className="container">
        {/* <Button size="m" onClick={handleClick} style={{ marginBottom: "1rem" }}>
          Add Rectangle
        </Button> */}
        <Accordion>
          <AccordionItem label="Watermarking">
            <Watermarker></Watermarker>
          </AccordionItem>
          <AccordionItem label="Encrypted Export">
            <p>Section 2 content</p>
          </AccordionItem>
          <AccordionItem label="Secure Upload">
            <p>Section 3 content</p>
          </AccordionItem>
        </Accordion>
      </div>
    </Theme>
  );
};

export default App;
