"use client";

import { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/server/utils";

const MAX_HEIGHT = 400;

interface MarkdownEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  className?: string;
}

function MarkdownPreview({ value }: { value: string }) {
  return (
    <div
      className="markdown-preview overflow-y-auto p-3 text-sm"
      style={{ maxHeight: MAX_HEIGHT }}
    >
      {value ? (
        <Markdown remarkPlugins={[remarkGfm]}>{value}</Markdown>
      ) : (
        <p className="text-muted-foreground">Nothing to preview.</p>
      )}
    </div>
  );
}

export function MarkdownEditor({ value, onChange, readOnly = false, className }: MarkdownEditorProps) {
  const [tab, setTab] = useState<"write" | "preview">("write");

  async function handleCopy() {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard.");
  }

  const copyButton = (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="h-6 w-6 text-muted-foreground hover:text-foreground"
      onClick={handleCopy}
      disabled={!value}
      aria-label="Copy content"
    >
      <Copy className="h-3.5 w-3.5" />
    </Button>
  );

  if (readOnly) {
    return (
      <div className={cn("overflow-hidden rounded-lg border border-[#2d2d2d] bg-[#1e1e1e]", className)}>
        <div className="flex items-center justify-between border-b border-[#2d2d2d] bg-[#2d2d2d] px-3 py-2">
          <span className="text-xs font-medium text-muted-foreground">Preview</span>
          {copyButton}
        </div>
        <MarkdownPreview value={value} />
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden rounded-lg border border-[#2d2d2d] bg-[#1e1e1e]", className)}>
      <Tabs value={tab} onValueChange={(next) => setTab(next as "write" | "preview")}>
        <div className="flex items-center justify-between border-b border-[#2d2d2d] bg-[#2d2d2d] px-3 py-1.5">
          <TabsList className="h-7 bg-transparent p-0">
            <TabsTrigger value="write" className="h-7 px-2 text-xs data-[state=active]:bg-[#1e1e1e] data-[state=active]:shadow-none">
              Write
            </TabsTrigger>
            <TabsTrigger value="preview" className="h-7 px-2 text-xs data-[state=active]:bg-[#1e1e1e] data-[state=active]:shadow-none">
              Preview
            </TabsTrigger>
          </TabsList>
          {copyButton}
        </div>
        <TabsContent value="write" className="m-0">
          <Textarea
            value={value}
            onChange={(event) => onChange?.(event.target.value)}
            placeholder="Write markdown..."
            rows={8}
            className="min-h-[120px] resize-none overflow-y-auto rounded-none border-0 bg-transparent font-mono text-xs text-foreground focus-visible:ring-0"
            style={{ maxHeight: MAX_HEIGHT }}
          />
        </TabsContent>
        <TabsContent value="preview" className="m-0">
          <MarkdownPreview value={value} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
