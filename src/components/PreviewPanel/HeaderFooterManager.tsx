import React, { useState, useMemo, useEffect } from "react";
import { usePersistentSettings } from "@/hooks/usePersistentSettings";
import { PAGE_NUMBER_SLIDE_ID } from "../../../constants";
import {
  HeaderFooterItem,
  HeaderFooterPosition,
  headerFooterPositions,
} from "../../../utils/local-storage";
import { useSlideContext } from "@/context/slideContext";

interface HeaderFooterManagerProps {
  onAddItem: (text: string, position: HeaderFooterPosition) => boolean;
  onRemoveItem: (id: string) => void;
  onUpdateItemPosition: (id: string, position: HeaderFooterPosition) => void;
  newItemTextRef: React.RefObject<HTMLInputElement>;
  editingItemId: string | null;
  onSetEditingItemId: (id: string | null) => void;
}

export default function HeaderFooterManager({
  newItemTextRef,
  editingItemId,
  onSetEditingItemId,
}: HeaderFooterManagerProps) {
  const [newItemText, setNewItemText] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const { } = useSlideContext()

  const availableHeaderFooterPositions = useMemo(() => {
    const usedPositions = new Set(headerFooters.map((item) => item.position));
    return headerFooterPositions.filter((pos) => !usedPositions.has(pos.value));
  }, [headerFooters]);

  const onAddItem = (text: string, position: HeaderFooterPosition) => {
    if (!text.trim()) {
      alert("Header/Footer text cannot be empty.");
      return false;
    }
    setHeaderFooters((prev) => [...prev, { id: uuidv4(), text, position }]);
    return true;
  };



  const onRemoveItem = (id: string) => {
    if (id === PAGE_NUMBER_SLIDE_ID) {
      setShowPageNumbers(false);
    } else {
      setHeaderFooters((prev) => prev.filter((item) => item.id !== id));
    }
  };


  const onUpdateItemPosition = (id: string, newPosition: HeaderFooterPosition) => {
    setHeaderFooters((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, position: newPosition } : item)),
    );
  };

  const [newItemPosition, setNewItemPosition] = useState<HeaderFooterPosition>(
    availableHeaderFooterPositions.length > 0
      ? availableHeaderFooterPositions[0].value
      : "bottom-center",
  );



  const onToggleAddForm = () => {
    setFormOpen((prev) => !prev);
  };

  useEffect(() => {
    if (
      availableHeaderFooterPositions.length > 0 &&
      !availableHeaderFooterPositions.find((p) => p.value === newItemPosition)
    ) {
      setNewItemPosition(availableHeaderFooterPositions[0].value);
    } else if (
      availableHeaderFooterPositions.length === 0 &&
      headerFooters.length < headerFooterPositions.length
    ) {
    }
  }, [availableHeaderFooterPositions, newItemPosition, headerFooters.length]);

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

  const handleStartEdit = (itemId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onSetEditingItemId(itemId);
  };

  const handleItemPositionChangeViaSelect = (itemId: string, newPosition: HeaderFooterPosition) => {
    onUpdateItemPosition(itemId, newPosition);
    onSetEditingItemId(null);
  };

  return (
    <div className="w-full flex flex-col h-full gap-2 bg-nord1/30 px-4 py-2 overflow-y-hidden rounded">
      <div className="flex justify-between w-full">
        <span className="font-semibold sticky top-0">Headers/Footers:</span>
        {availableHeaderFooterPositions.length > 0 && (
          <button
            onClick={onToggleAddForm}
            className={`px-2 py-1 text-nord0 rounded text-xs ${formOpen ? "bg-nord11 hover:bg-nord12" : "bg-nord9 hover:bg-nord14"}`}
          >
            {formOpen ? "Cancel" : "Add New"}
          </button>
        )}
      </div>
      {formOpen && (
        <div className="w-full p-2 border-nord2 rounded bg-nord1 flex flex-col gap-2">
          <input
            type="text"
            placeholder="Header/Footer Text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            ref={newItemTextRef}
            className="w-full p-1 text-xs bg-nord0 rounded outline-none placeholder:text-nord3"
          />
          <select
            value={newItemPosition}
            onChange={(e) => setNewItemPosition(e.target.value as HeaderFooterPosition)}
            className="w-full p-1 text-xs bg-nord0 rounded"
            disabled={availableHeaderFooterPositions.length === 0}
          >
            {availableHeaderFooterPositions.length === 0 && (
              <option value="" disabled>
                All positions used
              </option>
            )}
            {availableHeaderFooterPositions.map((pos) => (
              <option key={pos.value} value={pos.value}>
                {pos.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleAdd}
            disabled={availableHeaderFooterPositions.length === 0 || !newItemText.trim()}
            className={`self-end px-2 py-0.5 bg-nord14/60 text-nord0 rounded hover:bg-nord14 text-xs ${availableHeaderFooterPositions.length === 0 || !newItemText.trim() ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Add Item
          </button>
        </div>
      )}
      {headerFooters.length > 0 && (
        <ul className="w-full list-none p-0  space-y-1 overflow-y-auto rounded-md max-h-32">
          {headerFooters.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center bg-nord1 p-1 px-2  text-sm"
            >
              <span className="truncate w-[30%]" title={item.text}>
                {item.text}
              </span>
              {editingItemId === item.id ? (
                <select
                  value={item.position}
                  onChange={(e) =>
                    handleItemPositionChangeViaSelect(
                      item.id,
                      e.target.value as HeaderFooterPosition,
                    )
                  }
                  autoFocus
                  className="p-0.5 text-xs bg-nord0 border border-nord3 rounded text-nord4 text-center w-28"
                  onBlur={() => onSetEditingItemId(null)}
                >
                  <option value={item.position} disabled hidden>
                    {headerFooterPositions.find((p) => p.value === item.position)?.label}
                  </option>
                  {[
                    headerFooterPositions.find((p) => p.value === item.position)!,
                    ...availableHeaderFooterPositions,
                  ]
                    .filter(Boolean)
                    .map((posOpt) => (
                      <option key={posOpt.value} value={posOpt.value}>
                        {posOpt.label}
                      </option>
                    ))}
                </select>
              ) : (
                <span
                  onClick={(e) => handleStartEdit(item.id, e)}
                  className="text-nord9 hover:text-nord8 underline decoration-dotted underline-offset-2 cursor-pointer rounded px-1 py-0.5 text-[0.65rem]"
                  title="Click to change position"
                >
                  {headerFooterPositions.find((p) => p.value === item.position)?.label}
                </span>
              )}
              <button
                onClick={() => onRemoveItem(item.id)}
                className="ml-2 px-1.5 py-0.5 bg-nord11/70 text-nord0 rounded hover:bg-nord11 text-xs"
                title="Remove item"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
      {headerFooters.length === 0 && !formOpen && (
        <p className="text-nord3 text-xs italic mt-1">No headers or footers added.</p>
      )}
    </div>
  );
}
