import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { headerFooterPositions, HeaderFooterPosition } from "@/utils/layoutOptions";
import { Vim } from "@replit/codemirror-vim";
import DropDownButton from "@/components/UI/DropDownButton";
import useConfig from "@/hooks/useConfig";

export default function HeaderFooterManager({
  setIsEditing,
}: {
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [newItemText, setNewItemText] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [isEditingText, setIsEditingText] = useState("");
  const newItemTextRef = useRef<HTMLInputElement>(null);
  const config = useConfig();

  const unusedPositions = useMemo(() => {
    return config.unusedHeaderFooterPosition();
  }, [config]);

  const layoutItemMap: Record<HeaderFooterPosition, string> = unusedPositions.reduce(
    (acc, option) => {
      acc[option] = option;
      return acc;
    },
    {} as Record<HeaderFooterPosition, string>,
  );

  const onAddItem = (text: string, position: HeaderFooterPosition) => {
    if (!text.trim()) {
      alert("Header/Footer text cannot be empty.");
      return false;
    }
    config.modifyHeaderFooters(position, text);
    return true;
  };

  const onRemoveItem = (pos: string) => {
    config.removeHeaderFooter(pos);
  };

  const onUpdateItemPosition = (prevPos: HeaderFooterPosition, newPos: HeaderFooterPosition) => {
    const val = config.headerFooters().find((item) => item[0] === prevPos)?.[1] as string;
    config.removeHeaderFooter(prevPos);
    config.modifyHeaderFooters(newPos, val);
  };

  const onUpdateItemText = (pos: HeaderFooterPosition, newText: string) => {
    config.modifyHeaderFooters(pos, newText);
  };

  const onToggleAddForm = useCallback(() => {
    if (!unusedPositions) {
      alert("No header/footer positions available.Try deleting some");
    } else {
      setIsEditing((prev) => !prev);
      setFormOpen((prev) => !prev);
    }
  }, [setIsEditing, unusedPositions]);

  const handleAdd = () => {
    if (!unusedPositions) {
      alert("No header/footer positions available.Try deleting some");
      return;
    }

    if (onAddItem(newItemText, unusedPositions[0])) {
      setNewItemText("");
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
  }, [formOpen, onToggleAddForm]);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (newItemTextRef.current && !newItemTextRef.current.contains(event.target as Node)) {
        setIsEditing(false);
        setIsEditingText("");
        setNewItemText("");
      }
    },
    [setIsEditing, setIsEditingText, setNewItemText],
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  return (
    <div className="w-full flex flex-col  gap-2 bg-nord1 text-nord4 px-4 py-2 overflow-y-hidden rounded">
      <div className="flex justify-between w-full ">
        <span className="font-semibold text-nord4  sticky top-0">Headers/Footers:</span>
        {unusedPositions.length > 0 && (
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
            selectedOption={unusedPositions[0]}
            onSelect={onUpdateItemPosition.bind(null, unusedPositions[0])}
            color="bg-nord0 text-nord4 text-xs  w-full"
            // className="w-full p-1 text-xs bg-nord0 rounded"
            // disabled={availableHeaderFooterPositions.length === 0}
          >
            {layoutItemMap[unusedPositions[0]]}
          </DropDownButton>
          {newItemText.trim() && (
            <button
              onClick={handleAdd}
              disabled={unusedPositions.length === 0 || !newItemText.trim()}
              className={`self-end px-2 py-0.5 bg-nord14/80 text-nord0 rounded hover:bg-nord14 text-xs }`}
            >
              Add Item
            </button>
          )}
        </div>
      ) : unusedPositions.length < headerFooterPositions.length ? (
        <ul className="w-full list-none p-0  space-y-1 overflow-y-auto rounded-md max-h-28">
          {config.headerFooters().map((item) => (
            <li
              key={item[0]}
              className="flex justify-between items-center bg-nord0 p-1 px-2  text-sm"
            >
              {isEditingText === item[0] ? (
                <input
                  ref={newItemTextRef}
                  type="text"
                  value={newItemText}
                  autoFocus
                  size={newItemText.length}
                  onChange={(e) => {
                    setNewItemText(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setIsEditingText("");
                      setIsEditing(false);
                      setNewItemText("");
                    }
                    if (e.key === "Enter") {
                      onUpdateItemText(item[0], newItemText);
                      setIsEditing(false);
                      setNewItemText("");
                      setIsEditingText("");
                    }
                  }}
                  className="text-nord4/80 italic rounded px-2  outline-none  bg-nord3 placeholder:text-nord4/30"
                />
              ) : (
                <div className="w-[30%] flex flex-col">
                  <span
                    className={`truncate w-fit   underline text-nord4/80  text-sm  hover:text-nord4/50`}
                    onClick={() => {
                      setNewItemText(item[1].toString());
                      setIsEditing(true);
                      setIsEditingText(item[0]);
                    }}
                    title={item[1].toString()}
                  >
                    {item[1].toString()}
                  </span>
                </div>
              )}
              {unusedPositions.length === 0 ? (
                <span className="text-nord4/40 text-xs italic">{item[0]}</span>
              ) : (
                <DropDownButton
                  color=" text-nord4/40 hover:bg-nord1  text-xs  w-full"
                  options={layoutItemMap}
                  selectedOption={item[0]}
                  onSelect={(val) => {
                    onUpdateItemPosition(item[0], val as HeaderFooterPosition);
                  }}
                >
                  <span className="text-nord4/40 text-xs italic">{item[0]}</span>
                </DropDownButton>
              )}
              <button
                onClick={() => onRemoveItem(item[0])}
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
