import React from "react";

interface ButtonProps {
  onClick: () => void;
  color?: string;
  children: React.ReactNode;
  title?: string;
}

export default function Button({ onClick, color: color, children, title }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-2 py-1   ${color} backdrop-blur-3xl whitespace-nowrap   text-nord0 text-sm  rounded-md hover:rounded transition-all duration-200 ease-in-out justify-between     flex items-center w-full  `}
      title={title || ""}
    >
      {children}
    </button>
  );
}
