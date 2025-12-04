export function truncateText({ text, maxLength = 28 }) {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '…' : text;
}
