export function sanitizeCommentBody(input: string): string {
  return input
    .replace(/\u0000/g, '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .trim();
}

export function sanitizeAuthorName(input: string): string {
  return input.replace(/\s+/g, ' ').trim();
}
