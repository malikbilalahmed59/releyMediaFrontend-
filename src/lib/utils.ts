import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to strip HTML tags from a string
export function stripHtmlTags(htmlString: string | undefined | null): string {
  if (!htmlString) {
    return '';
  }

  // Replace <br> tags with newlines
  let text = htmlString.replace(/<br\s*\/?>/gi, '\n');

  // Replace </li>, </p>, </div> with newline followed by the tag (to preserve some structure)
  text = text.replace(/<\/(li|p|div)>/gi, '\n$&');

  // Create a temporary div element to parse the HTML
  const doc = new DOMParser().parseFromString(text, 'text/html');

  // Get the text content, which strips all HTML tags
  let plainText = doc.body.textContent || '';

  // Decode HTML entities (e.g., &amp; to &)
  const tempTextArea = document.createElement('textarea');
  tempTextArea.innerHTML = plainText;
  plainText = tempTextArea.value;

  // Clean up multiple newlines and trim whitespace
  plainText = plainText.replace(/(\n\s*){2,}/g, '\n\n').trim();

  return plainText;
}
