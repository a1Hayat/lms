export function toPlainText(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")    // Remove tags
    .replace(/\s+/g, " ")       // Clean spaces
    .trim()
}
