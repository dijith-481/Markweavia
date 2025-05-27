import React, { useRef, useEffect, useMemo } from "react";
import { EditorView } from "@codemirror/view";
import CodeMirror from "@uiw/react-codemirror";
import { useEditor } from "@/hooks/useEditor";
import { languages } from "@codemirror/language-data";
import { vim } from "@replit/codemirror-vim";
import { nord } from "@uiw/codemirror-theme-nord";
import { markdown as markdownLang } from "@codemirror/lang-markdown";



interface EditorPanelProps {
  fileUploadRef: React.RefObject<{ triggerFileUpload: () => void } | null>;
}

export default function EditorPanel({
  fileUploadRef

}: EditorPanelProps) {
  const codeMirrorRef = useRef<any>(null);
  const { markdownText, handleMarkdownChange, setIsEditorReady, editorUpdateListener } = useEditor(codeMirrorRef, fileUploadRef);

  useEffect(() => {
    if (codeMirrorRef.current && codeMirrorRef.current.view) {
      setIsEditorReady(true)
    }
  }, [codeMirrorRef.current, setIsEditorReady]);

  const extensions = useMemo(
    () => [
      vim(),
      markdownLang({ codeLanguages: languages }),
      EditorView.lineWrapping,
      editorUpdateListener,
    ],
    [editorUpdateListener],
  );
  return (
    <div className=" w-full rounded-md flex order-2 md:order-1 flex-col h-full  overflow-x-hidden  overscroll-contain   flex-1  "
    >
      <CodeMirror
        value={markdownText}
        height="auto"
        minHeight="100%"
        extensions={extensions}
        onChange={handleMarkdownChange}
        theme={nord}
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
        onCreateEditor={() => {
          setIsEditorReady(true);
        }}
      />
    </div >
  );
}
