export type EditorTheme = "vs-dark" | "monokai" | "github-dark";

export interface EditorPreferences {
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  minimap: boolean;
  theme: EditorTheme;
}
