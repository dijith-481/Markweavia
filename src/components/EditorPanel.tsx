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
    <div className=" w-full rounded-md flex order-2 md:order-1 flex-col h-full  overflow-x-hidden  overscroll-contain   flex-1  "
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
        className="w-full h-full  text-sm"
        ref={codeMirrorRef}
      />
    </div >
  );
}
