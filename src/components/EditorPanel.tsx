import React, { useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { Extension } from "@codemirror/state";

interface EditorPanelProps {
  markdownText: string;
  onMarkdownChange: (value: string) => void;
  extensions: Extension[];
  codeMirrorRef: React.RefObject<any>;
  theme: Extension;
}

export default function EditorPanel({
  markdownText,
  onMarkdownChange,
  extensions,
  codeMirrorRef,
  theme,
}: EditorPanelProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative md:w-[47vw] w-full rounded-md flex flex-col h-full overflow-x-hidden">
      <div
        ref={scrollContainerRef}
        className="flex-1 w-full overflow-y-auto"
        style={{ maxHeight: "100%", minHeight: "0", overscrollBehavior: "contain" }}
      >
        <CodeMirror
          value={markdownText}
          height="auto"
          minHeight="100%"
          extensions={extensions}
          onChange={onMarkdownChange}
          theme={theme}
          basicSetup={{
            lineNumbers: true,
            foldGutter: false,
            autocompletion: true,
            highlightActiveLine: true,
            highlightActiveLineGutter: true,
          }}
          autoFocus
          className="w-full text-sm"
          ref={codeMirrorRef}
          id="codeMirrorRef"
        />
      </div>
    </div>
  );
}
