import { codeToHtml } from "shiki";

export async function highlightJs(code: string): Promise<string> {
  return codeToHtml(code, {
    lang: "javascript",
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  });
}
