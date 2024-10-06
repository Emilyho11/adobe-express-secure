import React from "react";

const Modal = (props) => {
	return (
		<div
			onClick={props.onClose}
			className="w-screen h-screen absolute flex items-center justify-center bg-black/50"
		>
			<div
				{...props}
				className={
					"absolute min-w-[33vw] min-h-[50vh] bg-white z-10 text-black rounded-md p-4 " +
					props.className
				}
			>
				{props.children}
			</div>
		</div>
	);
};

export default Modal;
