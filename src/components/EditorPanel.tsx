import React, { useRef, useEffect, useMemo, useState } from "react";
import { EditorView } from "@codemirror/view";
import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { useEditor } from "@/hooks/useEditor";
import { languages } from "@codemirror/language-data";
import { vim } from "@replit/codemirror-vim";
import { nord } from "@uiw/codemirror-theme-nord";
import { markdown as markdownLang } from "@codemirror/lang-markdown";
import { VimIcon } from "./UI/Icons";
import Button from "./UI/Button";

interface EditorPanelProps {
  fileUploadRef: React.RefObject<{ triggerFileUpload: () => void } | null>;
  isMobile: boolean;
}

export default function EditorPanel({ fileUploadRef, isMobile }: EditorPanelProps) {
  const codeMirrorRef = useRef<ReactCodeMirrorRef>(null);
  const [isVimMode, setIsVimMode] = useState(true);
  const { markdownText, handleMarkdownChange, setIsEditorReady, editorUpdateListener } = useEditor(
    codeMirrorRef,
    fileUploadRef,
  );
  useEffect(() => {
    if (codeMirrorRef.current && codeMirrorRef.current.view) {
      setIsEditorReady(true);
    }
  }, [setIsEditorReady]);

  useEffect(() => {
    if (isMobile) {
      setIsVimMode(false);
    }
  }, [isMobile]);

  const extensions = useMemo(
    () => [
      isVimMode ? vim() : [],
      markdownLang({ codeLanguages: languages }),
      EditorView.lineWrapping,
      editorUpdateListener,
    ],
    [editorUpdateListener, isVimMode],
  );

  return (
    <div className="order-2 relative md:w-1/2 w-full rounded-md md:order-1 bg-nord0 h-full min-h-48   overscroll-contain overflow-x-hidden">
      <div className="sticky top-2 right-2 z-10 w-full   pointer-events-none flex items-end justify-end  ">
        <div className="w-10 mr-2">
          <Button
            onClick={() => {
              setIsVimMode((prev) => !prev);
            }}
            title="toggle vim mode"
            color={`${isVimMode ? "bg-nord9 text-nord0  hover:text-nord0 " : "bg-nord1  text-nord4/80  "} pointer-events-auto    opacity-50 hover:opacity-100`}
          >
            <VimIcon />
          </Button>
        </div>
      </div>
      <CodeMirror
        value={markdownText}
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
        className="text-sm overflow-y-auto w-full h-full absolute top-0 left-0"
        ref={codeMirrorRef}
        onCreateEditor={() => {
          setIsEditorReady(true);
        }}
      />
    </div>
  );
}
