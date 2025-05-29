import { useState, useEffect, useRef } from "react";
import { PAGE_NUMBER_SLIDE_ID } from "@/utils/local-storage";
import { useSlideContext } from "@/context/slideContext";
import {
  headerFooterPositions,
  layoutItemPosition,
  layoutItemLabel,
  HeaderFooterPosition,
} from "@/utils/layoutOptions";
import { v4 as uuidv4 } from "uuid";
import { Vim } from "@replit/codemirror-vim";
import DropDownButton from "@/components/UI/DropDownButton";

export default function HeaderFooterManager({
  availableHeaderFooterPositions,
}: {
  availableHeaderFooterPositions: HeaderFooterPosition[];
}) {
  const [newItemText, setNewItemText] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const { slideLayoutOptions, setSlideLayoutOptions } = useSlideContext();
  const [isEditingText, setIsEditingText] = useState("");
  const newItemTextRef = useRef<HTMLInputElement>(null);

  const onAddItem = (text: string, position: layoutItemPosition) => {
    if (!text.trim()) {
      alert("Header/Footer text cannot be empty.");
      return false;
    }
    setSlideLayoutOptions((prev) => ({
      ...prev,
      headerFooters: [...prev.headerFooters, { id: uuidv4(), text, position }],
    }));
    return true;
  };

  const onRemoveItem = (id: string) => {
    setSlideLayoutOptions((prev) => ({
      ...prev,
      headerFooters: prev.headerFooters.filter((item) => item.id !== id),
    }));
  };

  const onUpdateItemPosition = (id: string, newPosition: layoutItemPosition) => {
    setSlideLayoutOptions((prev) => ({
      ...prev,
      headerFooters: prev.headerFooters.map((item) =>
        item.id === id ? { ...item, position: newPosition } : item,
      ),
    }));
  };

  const onUpdateItemText = (id: string, newText: string) => {
    setSlideLayoutOptions((prev) => ({
      ...prev,
      headerFooters: prev.headerFooters.map((item) =>
        item.id === id ? { ...item, text: newText } : item,
      ),
    }));
  };

  const [newItemPosition, setNewItemPosition] = useState<layoutItemPosition>(
    availableHeaderFooterPositions.length > 0
      ? availableHeaderFooterPositions[0].value
      : "bottom-center",
  );

  const onToggleAddForm = () => {
    if (availableHeaderFooterPositions.length === 0) {
      alert("No header/footer positions available.Try deleting some");
    } else {
      setFormOpen((prev) => !prev);
    }
  };

  useEffect(() => {
    if (
      availableHeaderFooterPositions.length > 0 &&
      !availableHeaderFooterPositions.find((p) => p.value === newItemPosition)
    ) {
      setNewItemPosition(availableHeaderFooterPositions[0].value);
    } else if (
      availableHeaderFooterPositions.length === 0 &&
      slideLayoutOptions.headerFooters.length < headerFooterPositions.length
    ) {
    }
  }, [availableHeaderFooterPositions, newItemPosition, slideLayoutOptions.headerFooters.length]);

  const handleAdd = () => {
    if (onAddItem(newItemText, newItemPosition)) {
      setNewItemText("");
      if (availableHeaderFooterPositions.length > 1) {
        setNewItemPosition(
          availableHeaderFooterPositions.filter((p) => p.value !== newItemPosition)[0]?.value ||
            "bottom-center",
        );
      } else if (availableHeaderFooterPositions.length === 0) {
      }
      onToggleAddForm();
    }
  };

  useEffect(() => {
    Vim.defineEx("header", "h", onToggleAddForm);
  }, [onToggleAddForm]);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && formOpen) {
        onToggleAddForm();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [formOpen]);

  const layoutItemMap: Record<layoutItemPosition, layoutItemLabel> =
    availableHeaderFooterPositions.reduce(
      (acc, option) => {
        acc[option.value] = option.label;
        return acc;
      },
      {} as Record<layoutItemPosition, layoutItemLabel>,
    );

  const changeItemPosition = (position: string) => {
    setNewItemPosition(position as layoutItemPosition);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (newItemTextRef.current && !newItemTextRef.current.contains(event.target as Node)) {
      setIsEditingText("");
      setNewItemText("");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  return (
    <div className="w-full flex flex-col  gap-2 bg-nord1 text-nord4 px-4 py-2 overflow-y-hidden rounded">
      <div className="flex justify-between w-full ">
        <span className="font-semibold text-nord4  sticky top-0">Headers/Footers:</span>
        {availableHeaderFooterPositions.length > 0 && (
          <button
            onClick={onToggleAddForm}
            className={`px-2 py-1 text-nord0 rounded text-xs ${formOpen ? "bg-nord11 hover:bg-nord12" : "bg-nord9 hover:bg-nord14"}`}
          >
            {formOpen ? "Cancel" : "Add New"}
          </button>
        )}
      </div>
      {formOpen ? (
        <div className="w-full p-2 border-nord2 rounded bg-nord1 text-nord4 flex flex-col gap-2">
          <input
            type="text"
            placeholder="Header/Footer Text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            // ref={newItemTextRef}
            autoFocus
            className="w-full p-1 text-xs bg-nord0 rounded outline-none placeholder:text-nord4/30"
          />
          <DropDownButton
            options={layoutItemMap}
            selectedOption={newItemPosition}
            onSelect={changeItemPosition}
            color="bg-nord0 text-nord4 text-xs  w-full"
            // className="w-full p-1 text-xs bg-nord0 rounded"
            // disabled={availableHeaderFooterPositions.length === 0}
          >
            {layoutItemMap[newItemPosition]}
          </DropDownButton>
          {newItemText.trim() && (
            <button
              onClick={handleAdd}
              disabled={availableHeaderFooterPositions.length === 0 || !newItemText.trim()}
              className={`self-end px-2 py-0.5 bg-nord14/80 text-nord0 rounded hover:bg-nord14 text-xs }`}
            >
              Add Item
            </button>
          )}
        </div>
      ) : slideLayoutOptions.headerFooters.length > 0 ? (
        <ul className="w-full list-none p-0  space-y-1 overflow-y-auto rounded-md max-h-28">
          {slideLayoutOptions.headerFooters.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center bg-nord0 p-1 px-2  text-sm"
            >
              {isEditingText === item.id && item.id !== PAGE_NUMBER_SLIDE_ID ? (
                <input
                  ref={newItemTextRef}
                  type="text"
                  value={newItemText}
                  autoFocus
                  onChange={(e) => {
                    setNewItemText(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setIsEditingText("");
                      setNewItemText("");
                    }
                    if (e.key === "Enter") {
                      onUpdateItemText(item.id, newItemText);
                      setNewItemText("");
                      setIsEditingText("");
                    }
                  }}
                  className="text-nord4/80 italic rounded px-2  outline-none w-max bg-nord3 placeholder:text-nord4/30"
                />
              ) : (
                <div className="w-[30%] flex flex-col">
                  <span
                    className={`truncate w-full ${item.id !== PAGE_NUMBER_SLIDE_ID ? " underline text-nord4/80  text-sm  hover:text-nord4/50" : ""}`}
                    onClick={() => {
                      setNewItemText(item.text);
                      setIsEditingText(item.id);
                    }}
                    title={item.text}
                  >
                    {item.text}
                  </span>
                </div>
              )}
              {availableHeaderFooterPositions.length === 0 ? (
                <span className="text-nord4/40 text-xs italic">{item.position}</span>
              ) : (
                <DropDownButton
                  color=" text-nord4/40 hover:bg-nord1  text-xs  w-full"
                  options={layoutItemMap}
                  selectedOption={item.position}
                  onSelect={(val) => {
                    onUpdateItemPosition(item.id, val as layoutItemPosition);
                  }}
                >
                  <span className="text-nord4/40 text-xs italic">{item.position}</span>
                </DropDownButton>
              )}
              <button
                onClick={() => onRemoveItem(item.id)}
                className="ml-2 px-1.5 py-0.5  text-nord4 bg-nord1/50 transition-colors ease-in-out duration-300 hover:text-nord0 rounded hover:bg-nord11 text-xs"
                title="Remove item"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-nord4/40 text-xs italic mt-1">No headers or footers added.</p>
      )}
    </div>
  );
}
