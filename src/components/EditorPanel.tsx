import React from "react";
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
  return (
    <div className="relative md:w-[47vw] w-full rounded-md overflow-y-auto flex flex-col h-full overflow-x-hidden">
      <div className="flex-1 w-full md:overflow-y-auto ">
        <CodeMirror
          value={markdownText}
          height="100%"
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
          className="h-full text-sm"
          ref={codeMirrorRef}
          id="codeMirrorRef"
        />
      </div>
    </div>
  );
}
