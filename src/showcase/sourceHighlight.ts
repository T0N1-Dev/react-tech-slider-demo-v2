export type SourceTokenKind =
  | "plain" | "comment" | "string" | "keyword"
  | "tag" | "attribute" | "number" | "punctuation";
export interface SourceToken { kind: SourceTokenKind; text: string }
export interface SourceLine {
  number: number;
  text: string;
  tokens: readonly SourceToken[];
}
const KEYWORDS = new Set([
  "import", "from", "type", "const", "export",
  "function", "return", "true", "false",
]);
const IDENTIFIER = /^[A-Za-z_$][\w$-]*/;
const NUMBER = /^\d+(?:\.\d+)?/;
const PUNCTUATION = /[{}[\]();,:.=<>/]/;
export function highlightGeneratedTsx(source: string): readonly SourceLine[] {
  let inBlockComment = false;
  return source.split("\n").map((text, index) => {
    const result = scanLine(text, inBlockComment);
    inBlockComment = result.inBlockComment;
    return { number: index + 1, text, tokens: result.tokens };
  });
}
function scanLine(line: string, startsInBlockComment: boolean) {
  const tokens: SourceToken[] = [];
  let inBlockComment = startsInBlockComment;
  let index = 0;
  const push = (kind: SourceTokenKind, text: string) => {
    if (!text) return;
    const previous = tokens.at(-1);
    if (previous?.kind === kind) previous.text += text;
    else tokens.push({ kind, text });
  };
  while (index < line.length) {
    if (inBlockComment) {
      const end = line.indexOf("*/", index);
      if (end < 0) {
        push("comment", line.slice(index));
        index = line.length;
      } else {
        push("comment", line.slice(index, end + 2));
        index = end + 2;
        inBlockComment = false;
      }
      continue;
    }
    if (line.startsWith("//", index)) {
      push("comment", line.slice(index));
      break;
    }
    if (line.startsWith("/*", index)) {
      const end = line.indexOf("*/", index + 2);
      if (end < 0) {
        push("comment", line.slice(index));
        inBlockComment = true;
        break;
      }
      push("comment", line.slice(index, end + 2));
      index = end + 2;
      continue;
    }
    const character = line[index]!;
    if (character === '"' || character === "'") {
      let end = index + 1;
      while (end < line.length) {
        if (line[end] === "\\") end += 2;
        else if (line[end++] === character) break;
      }
      push("string", line.slice(index, end));
      index = end;
      continue;
    }
    const tag = line.slice(index).match(/^<\/?([A-Za-z_$][\w$.-]*)/);
    if (tag) {
      push("punctuation", tag[0].startsWith("</") ? "</" : "<");
      push("tag", tag[1]!);
      index += tag[0].length;
      continue;
    }
    const identifier = line.slice(index).match(IDENTIFIER);
    if (identifier) {
      const text = identifier[0];
      const prefix = line.slice(0, index);
      const suffix = line.slice(index + text.length);
      if (KEYWORDS.has(text)) push("keyword", text);
      else if (/^\s*=/.test(suffix) && (prefix.trim() === "" || prefix.includes("<")))
        push("attribute", text);
      else push("plain", text);
      index += text.length;
      continue;
    }
    const number = line.slice(index).match(NUMBER);
    const previous = line[index - 1] ?? "";
    if (number && !/[\w$]/.test(previous)) {
      const next = line[index + number[0].length] ?? "";
      if (!/[\w$]/.test(next)) {
        push("number", number[0]);
        index += number[0].length;
        continue;
      }
    }
    push(PUNCTUATION.test(character) ? "punctuation" : "plain", character);
    index += 1;
  }
  return { tokens, inBlockComment };
}
