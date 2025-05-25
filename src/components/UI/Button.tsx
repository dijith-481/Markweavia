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
      className={`px-2 py-1   ${color} backdrop-blur-3xl whitespace-nowrap   text-nord0 text-sm  rounded-md hover:rounded transition-all duration-200 ease-in-out justify-around     flex items-center w-full max-w-40 `}
      title={title || ""}
    >
      {children}
    </button>
  );
}
