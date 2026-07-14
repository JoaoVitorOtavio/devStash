"use client";

import { useCallback, useRef, useState } from "react";
import Editor, { type OnMount, type OnChange } from "@monaco-editor/react";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/server/utils";

const MIN_HEIGHT = 120;
const MAX_HEIGHT = 400;
const THEME_NAME = "devstash-dark";

// Monaco cancels in-flight worker requests (tokenizer, bracket matching) when an editor
// unmounts, which surfaces as an unhandled "Canceled" rejection. It's benign upstream
// noise (github.com/suren-atoyan/monaco-react issues), so we swallow just that one case,
// once per page load.
if (typeof window !== "undefined") {
  const win = window as typeof window & { __monacoCancellationHandlerInstalled?: boolean };
  if (!win.__monacoCancellationHandlerInstalled) {
    win.__monacoCancellationHandlerInstalled = true;
    window.addEventListener("unhandledrejection", (event) => {
      if (event.reason?.message === "Canceled") {
        event.preventDefault();
      }
    });
  }
}

const LANGUAGE_ALIASES: Record<string, string> = {
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
  py: "python",
  rb: "ruby",
  sh: "shell",
  bash: "shell",
  zsh: "shell",
  yml: "yaml",
  cs: "csharp",
  "c++": "cpp",
  md: "markdown",
};

export function toMonacoLanguage(language: string | undefined | null): string {
  if (!language) return "plaintext";
  const normalized = language.trim().toLowerCase();
  return LANGUAGE_ALIASES[normalized] ?? normalized;
}

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: string | null;
  readOnly?: boolean;
  className?: string;
}

export function CodeEditor({ value, onChange, language, readOnly = false, className }: CodeEditorProps) {
  const [height, setHeight] = useState(MIN_HEIGHT);
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  const updateHeight = useCallback((editor: Parameters<OnMount>[0]) => {
    const contentHeight = editor.getContentHeight();
    setHeight(Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, contentHeight)));
  }, []);

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    monaco.editor.defineTheme(THEME_NAME, {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#171717",
        "editor.foreground": "#fafafa",
        "editorLineNumber.foreground": "#71717a",
        "editorLineNumber.activeForeground": "#d4d4d8",
        "editor.lineHighlightBackground": "#27272a",
        "editorCursor.foreground": "#fafafa",
        "editor.selectionBackground": "#3f3f46",
        "scrollbarSlider.background": "#3f3f4680",
        "scrollbarSlider.hoverBackground": "#52525b99",
        "scrollbarSlider.activeBackground": "#71717ac0",
      },
    });
    monaco.editor.setTheme(THEME_NAME);

    updateHeight(editor);
    editor.onDidContentSizeChange(() => updateHeight(editor));
  };

  const handleChange: OnChange = (nextValue) => {
    onChange?.(nextValue ?? "");
  };

  async function handleCopy() {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard.");
  }

  return (
    <div className={cn("overflow-hidden rounded-lg border border-border", className)}>
      <div className="flex items-center justify-between border-b border-border bg-muted px-3 py-2">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
        </div>
        <div className="flex items-center gap-2">
          {language && (
            <span className="text-xs font-medium text-muted-foreground">{language}</span>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleCopy}
            disabled={!value}
            aria-label="Copy content"
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      <Editor
        height={height}
        language={toMonacoLanguage(language)}
        value={value}
        onChange={handleChange}
        onMount={handleMount}
        theme={THEME_NAME}
        options={{
          readOnly,
          domReadOnly: readOnly,
          minimap: { enabled: false },
          fontSize: 13,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 12, bottom: 12 },
          wordWrap: "on",
          renderLineHighlight: readOnly ? "none" : "line",
          overviewRulerLanes: 0,
          scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
        }}
        loading={
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            Loading editor...
          </div>
        }
      />
    </div>
  );
}
