import React from "react";

const Card = (props) => {
  return (
    <div {...props} className={"bg-white rounded-md p-2 text-black " + props.className}>{props.children}</div>
  );
};

export default Card;