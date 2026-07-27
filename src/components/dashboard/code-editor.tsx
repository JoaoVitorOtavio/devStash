"use client";

import { useCallback, useRef, useState } from "react";
import Editor, { type BeforeMount, type OnMount, type OnChange } from "@monaco-editor/react";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/server/utils";
import { useEditorPreferences } from "./editor-preferences-context";
import type { EditorTheme } from "@/types/editor-preferences";

const MIN_HEIGHT = 120;
const MAX_HEIGHT = 400;

const MONACO_THEME_NAMES: Record<EditorTheme, string> = {
  "vs-dark": "devstash-dark",
  monokai: "devstash-monokai",
  "github-dark": "devstash-github-dark",
};

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
  const { preferences } = useEditorPreferences();
  const [height, setHeight] = useState(MIN_HEIGHT);
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  const updateHeight = useCallback((editor: Parameters<OnMount>[0]) => {
    const contentHeight = editor.getContentHeight();
    setHeight(Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, contentHeight)));
  }, []);

  const handleBeforeMount: BeforeMount = (monaco) => {
    monaco.editor.defineTheme(MONACO_THEME_NAMES["vs-dark"], {
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

    monaco.editor.defineTheme(MONACO_THEME_NAMES.monokai, {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "75715E", fontStyle: "italic" },
        { token: "string", foreground: "E6DB74" },
        { token: "keyword", foreground: "F92672" },
        { token: "number", foreground: "AE81FF" },
        { token: "type", foreground: "66D9EF", fontStyle: "italic" },
        { token: "function", foreground: "A6E22E" },
        { token: "variable", foreground: "F8F8F2" },
        { token: "constant", foreground: "AE81FF" },
        { token: "operator", foreground: "F92672" },
      ],
      colors: {
        "editor.background": "#272822",
        "editor.foreground": "#F8F8F2",
        "editorLineNumber.foreground": "#8F908A",
        "editorLineNumber.activeForeground": "#F8F8F2",
        "editor.lineHighlightBackground": "#3E3D32",
        "editorCursor.foreground": "#F8F8F0",
        "editor.selectionBackground": "#49483E",
        "scrollbarSlider.background": "#75715E80",
        "scrollbarSlider.hoverBackground": "#75715E99",
        "scrollbarSlider.activeBackground": "#75715EC0",
      },
    });

    monaco.editor.defineTheme(MONACO_THEME_NAMES["github-dark"], {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "8B949E", fontStyle: "italic" },
        { token: "string", foreground: "A5D6FF" },
        { token: "keyword", foreground: "FF7B72" },
        { token: "number", foreground: "79C0FF" },
        { token: "type", foreground: "FFA657" },
        { token: "function", foreground: "D2A8FF" },
        { token: "variable", foreground: "C9D1D9" },
        { token: "constant", foreground: "79C0FF" },
        { token: "operator", foreground: "FF7B72" },
      ],
      colors: {
        "editor.background": "#0D1117",
        "editor.foreground": "#C9D1D9",
        "editorLineNumber.foreground": "#6E7681",
        "editorLineNumber.activeForeground": "#C9D1D9",
        "editor.lineHighlightBackground": "#161B22",
        "editorCursor.foreground": "#C9D1D9",
        "editor.selectionBackground": "#3392FF44",
        "scrollbarSlider.background": "#6E768180",
        "scrollbarSlider.hoverBackground": "#6E768199",
        "scrollbarSlider.activeBackground": "#6E7681C0",
      },
    });
  };

  const handleMount: OnMount = (editor) => {
    editorRef.current = editor;
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
        beforeMount={handleBeforeMount}
        onMount={handleMount}
        theme={MONACO_THEME_NAMES[preferences.theme]}
        options={{
          readOnly,
          domReadOnly: readOnly,
          minimap: { enabled: preferences.minimap },
          fontSize: preferences.fontSize,
          tabSize: preferences.tabSize,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 12, bottom: 12 },
          wordWrap: preferences.wordWrap ? "on" : "off",
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
