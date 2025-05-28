import { expandIcon } from "./Icons";

export default function ToggleExpand({
  isExpanded,
  setIsExpanded,
  children,
}: {
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}) {
  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };
  return (
    <div className="bg-nord0 rounded-md">
      <button
        onClick={toggleExpand}
        className=" md:hidden w-full px-4 py-2  text-nord4 text-sm   flex  items-center justify-between"
        aria-expanded={isExpanded}
        aria-controls="collapsible-slide-settings-panel"
      >
        <span>Customization Options</span>
        <span
          className={`h-4 w-4 transform transition-transform duration-300 ${isExpanded ? "rotate-180" : "rotate-0"}`}
        >
          {expandIcon}
        </span>
      </button>
      <div
        id="collapsible-slide-settings-panel"
        className={`
          transition-all duration-300 ease-in-out 
          ${isExpanded ? "max-h-screen overflow-y-auto" : "max-h-0 overflow-hidden"} 
        `}
      >
        {children}
      </div>
    </div>
  );
}
