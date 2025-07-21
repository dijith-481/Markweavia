import React, { useRef, useCallback, forwardRef } from "react";
import { useSlideContext } from "@/context/slideContext";

export type FileUploadHandle = { triggerFileUpload: () => void };

const handleFileUpload = (
  event: React.ChangeEvent<HTMLInputElement>,
  onContentLoaded: (content: string) => void,
): void => {
  const file = event.target.files?.[0];
  if (file) {
    if (file.name.endsWith(".md") || file.type === "text/markdown") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newContent = e.target?.result as string;
        onContentLoaded(newContent);
      };
      reader.onerror = () => alert("Failed to read the file.");
      reader.readAsText(file);
    } else {
      alert("Please upload a valid Markdown file (.md).");
    }
  }
};

const FileUpload = forwardRef<FileUploadHandle>((_props, ref) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { editorViewRef, markdownText } = useSlideContext();

  const triggerFileUpload = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleFileUpload(event, (content) => {
        if (content) {
          if (
            markdownText.trim() &&
            !confirm("This will replace your current content. Are you sure?")
          ) {
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
          }
          const hashIndex = content.indexOf("# ");
          editorViewRef.current?.dispatch({
            changes: { from: 0, to: editorViewRef.current?.state.doc.length, insert: content },
            selection: { anchor: hashIndex },
          });
        }
      });
    },
    [markdownText, editorViewRef],
  );

  React.useImperativeHandle(ref, () => ({
    triggerFileUpload,
  }));

  return (
    <input
      type="file"
      accept=".md,text/markdown"
      ref={fileInputRef}
      onChange={handleFileChange}
      style={{ display: "none" }}
      aria-hidden="true"
    />
  );
});

FileUpload.displayName = "FileUpload";

export default FileUpload;
