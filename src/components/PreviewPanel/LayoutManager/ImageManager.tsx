import React, { useCallback, useRef, useState, useEffect } from "react";
import { useSlideContext } from "@/context/slideContext";

export default function ImageManager() {
  const { uploadedImages, setUploadedImages } = useSlideContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  const [editingName, setEditingName] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        if (uploadedImages.some((image) => image.name === file.name)) {
          alert(`Image "${file.name}" is already uploaded.`);
          return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage = { name: file.name, data: e.target?.result as string };
          setUploadedImages((prev) => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      });
      if (event.target) {
        event.target.value = "";
      }
    }
  };

  const triggerFileUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const copyImageMarkdownToClipboard = (name: string) => {
    navigator.clipboard.writeText(`![alt text](${name})`);
    alert(`Copied "![alt text](${name})" to clipboard.`);
  };

  const removeImage = (name: string) => {
    if (editingName === name) {
      setEditingName(null);
    }
    setUploadedImages((prev) => prev.filter((img) => img.name !== name));
  };

  const handleRename = () => {
    if (!editingName || !newName.trim()) {
      setEditingName(null);
      return;
    }

    const trimmedNewName = newName.trim();
    if (trimmedNewName === editingName) {
      setEditingName(null);
      return;
    }

    if (uploadedImages.some((img) => img.name === trimmedNewName)) {
      alert(`An image with the name "${trimmedNewName}" already exists.`);
      editInputRef.current?.focus();
      return;
    }

    setUploadedImages((prev) =>
      prev.map((img) => (img.name === editingName ? { ...img, name: trimmedNewName } : img)),
    );
    setEditingName(null);
  };

  const handleEditKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleRename();
    } else if (event.key === "Escape") {
      setEditingName(null);
      setNewName("");
    }
  };

  const startEditing = (name: string) => {
    setEditingName(name);
    setNewName(name);
  };

  useEffect(() => {
    if (editingName && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingName]);

  return (
    <div className="w-full flex flex-col gap-2 bg-nord1 text-nord4 px-4 py-2 rounded">
      <div className="flex justify-between w-full">
        <span className="font-semibold text-nord4">Images</span>
        <button
          onClick={triggerFileUpload}
          className="px-2 py-1 text-nord0 rounded text-xs bg-nord9 hover:bg-nord14"
        >
          Upload
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
          style={{ display: "none" }}
          multiple
        />
      </div>
      {uploadedImages.length > 0 ? (
        <ul className="w-full list-none p-0 space-y-1 overflow-y-auto rounded-md max-h-28">
          {uploadedImages.map((image) => (
            <li
              key={image.name}
              className="flex justify-between items-center bg-nord0 p-1 px-2 text-sm"
            >
              {editingName === image.name ? (
                <input
                  ref={editInputRef}
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={handleEditKeyDown}
                  onBlur={handleRename}
                  className="text-nord4 italic rounded px-2 w-full outline-none bg-nord3 placeholder:text-nord4/30"
                />
              ) : (
                <span
                  className="truncate w-fit cursor-pointer hover:underline"
                  title={`Click to edit "${image.name}"`}
                  onClick={() => startEditing(image.name)}
                >
                  {image.name}
                </span>
              )}
              <div className="flex items-center gap-2 ml-2">
                <button
                  onClick={() => copyImageMarkdownToClipboard(image.name)}
                  className="text-xs hover:text-nord9 whitespace-nowrap"
                  title="Copy Markdown to clipboard"
                >
                  Copy MD
                </button>
                <button
                  onClick={() => removeImage(image.name)}
                  className="px-1.5 py-0.5 text-nord4 bg-nord1/50 transition-colors ease-in-out duration-300 hover:text-nord0 rounded hover:bg-nord11 text-xs"
                  title="Remove image"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-nord4/40 text-xs italic mt-1">No images uploaded.</p>
      )}
    </div>
  );
}
