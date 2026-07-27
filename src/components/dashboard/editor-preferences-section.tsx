"use client";

import { Code2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useEditorPreferences } from "./editor-preferences-context";
import {
  EDITOR_FONT_SIZE_OPTIONS,
  EDITOR_TAB_SIZE_OPTIONS,
  EDITOR_THEME_OPTIONS,
} from "@/server/constants";
import type { EditorTheme } from "@/types/editor-preferences";

export function EditorPreferencesSection() {
  const { preferences, updatePreference } = useEditorPreferences();

  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Code2 className="w-5 h-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Editor Preferences</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Customize how the code editor looks and behaves. Changes save automatically.
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Font Size</label>
          <Select
            value={String(preferences.fontSize)}
            onValueChange={(value) => updatePreference("fontSize", Number(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EDITOR_FONT_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}px
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tab Size</label>
          <Select
            value={String(preferences.tabSize)}
            onValueChange={(value) => updatePreference("tabSize", Number(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EDITOR_TAB_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size} spaces
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Theme</label>
          <Select
            value={preferences.theme}
            onValueChange={(value) => updatePreference("theme", value as EditorTheme)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EDITOR_THEME_OPTIONS.map((theme) => (
                <SelectItem key={theme.value} value={theme.value}>
                  {theme.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-4 py-3">
          <label htmlFor="word-wrap" className="text-sm font-medium">
            Word Wrap
          </label>
          <Switch
            id="word-wrap"
            checked={preferences.wordWrap}
            onCheckedChange={(checked) => updatePreference("wordWrap", checked)}
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-4 py-3">
          <label htmlFor="minimap" className="text-sm font-medium">
            Minimap
          </label>
          <Switch
            id="minimap"
            checked={preferences.minimap}
            onCheckedChange={(checked) => updatePreference("minimap", checked)}
          />
        </div>
      </div>
    </div>
  );
}
