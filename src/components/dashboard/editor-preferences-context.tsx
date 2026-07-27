"use client";

import { createContext, useContext, useState } from "react";
import { toast } from "sonner";
import { updateEditorPreferences } from "@/actions/editor-preferences";
import { DEFAULT_EDITOR_PREFERENCES } from "@/server/constants";
import type { EditorPreferences } from "@/types/editor-preferences";

interface EditorPreferencesContextValue {
  preferences: EditorPreferences;
  updatePreference: <K extends keyof EditorPreferences>(key: K, value: EditorPreferences[K]) => void;
}

const EditorPreferencesContext = createContext<EditorPreferencesContextValue>({
  preferences: DEFAULT_EDITOR_PREFERENCES,
  updatePreference: () => {},
});

export function EditorPreferencesProvider({
  initialPreferences,
  children,
}: {
  initialPreferences: EditorPreferences;
  children: React.ReactNode;
}) {
  const [preferences, setPreferences] = useState(initialPreferences);

  function updatePreference<K extends keyof EditorPreferences>(key: K, value: EditorPreferences[K]) {
    const previous = preferences;
    const next = { ...preferences, [key]: value };
    setPreferences(next);

    updateEditorPreferences(next).then((result) => {
      if (result.success) {
        toast.success("Editor preferences saved.");
      } else {
        setPreferences(previous);
        toast.error(result.error ?? "Failed to save editor preferences.");
      }
    });
  }

  return (
    <EditorPreferencesContext.Provider value={{ preferences, updatePreference }}>
      {children}
    </EditorPreferencesContext.Provider>
  );
}

export function useEditorPreferences() {
  return useContext(EditorPreferencesContext);
}
