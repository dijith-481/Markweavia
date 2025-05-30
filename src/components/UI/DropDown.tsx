import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

interface DropDownProps {
  options: Record<any, string>;
  selectedOption?: string;
  onSelect: (option: string) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  isOpen: boolean;
  onClose: () => void;
}

export default function DropDown({
  options,
  selectedOption,
  onSelect,
  triggerRef,
  isOpen,
  onClose,
}: DropDownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const [hasPositionBeenCalculated, setHasPositionBeenCalculated] = useState(false);
  const [shouldDropUp, setShouldDropUp] = useState(false);

  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current) {
      setHasPositionBeenCalculated(false);
      return;
    }

    const updatePosition = () => {
      const triggerRect = triggerRef.current!.getBoundingClientRect();
      const dropdownHeight = dropdownRef.current?.scrollHeight || 0;
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;
      const verticalOffset = 8;

      const shouldDropUpCalc =
        spaceBelow < dropdownHeight + verticalOffset && spaceAbove > spaceBelow + verticalOffset;

      setShouldDropUp(shouldDropUpCalc);

      setPosition({
        top: shouldDropUpCalc
          ? triggerRect.top - dropdownHeight - verticalOffset
          : triggerRect.bottom + verticalOffset,
        left: triggerRect.left,
        width: triggerRect.width,
      });

      if (!hasPositionBeenCalculated) {
        setHasPositionBeenCalculated(true);
      }
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen, triggerRef, hasPositionBeenCalculated]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, triggerRef]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const dropdownContent = (
    <div
      ref={dropdownRef}
      className="fixed bg-nord9/30 flex flex-col backdrop-blur-lg rounded-md overflow-hidden z-[9999]  shadow-nord9/40 transform-3d"
      style={{
        top: position.top,
        left: position.left,
        minWidth: position.width,
        maxHeight: "30vh",
        overflowY: "auto",
        height: hasPositionBeenCalculated ? "auto" : "0px",
        transformOrigin: shouldDropUp ? "bottom" : "top",
        transform: hasPositionBeenCalculated ? "scaleY(1)" : "scaleY(0.9)",
        transition: "transform 0.1s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {Object.keys(options).map((optionKey) => (
        <button
          key={optionKey}
          onClick={() => {
            onSelect(optionKey);
            onClose();
          }}
          className={`w-full text-left px-4 py-2 text-sm whitespace-nowrap ${
            selectedOption === optionKey
              ? "bg-nord9/80 text-nord1 font-semibold"
              : "text-nord4 hover:bg-nord9/80 hover:text-nord0"
          }`}
        >
          {options[optionKey]}
        </button>
      ))}
    </div>
  );

  return createPortal(dropdownContent, document.body);
}
