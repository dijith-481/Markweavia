import React, { useRef, useState } from "react";
import Button from "./Button";
import DropDown from "./DropDown";

interface DropDownButtonProps {
  color?: string;
  options: Record<any, string>;
  onSelect: (option: string) => void;
  selectedOption?: string;
  children: React.ReactNode;
}

export default function DropDownButton({
  color: color,
  options,
  onSelect,
  selectedOption,
  children,
}: DropDownButtonProps) {
  const [isDropdownOpen, setIsdropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleDropdown = () => setIsdropdownOpen((prev) => !prev);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button onClick={toggleDropdown} color={color}>
        {children}

        <span
          className={`ml-1 transform transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : "rotate-0"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </Button>
      <DropDown
        options={options}
        selectedOption={selectedOption}
        onSelect={onSelect}
        triggerRef={dropdownRef}
        onClose={toggleDropdown}
        isOpen={isDropdownOpen}
      />
    </div>
  );
}
