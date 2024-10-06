import React from "react";

const Card = (props) => {
  return (
    <div {...props} className={"bg-white rounded-md p-2 text-black justify-center items-center" + props.className}>{props.children}</div>
  );
};

export default Card;