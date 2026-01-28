import { useRef } from 'react';
import {
  CodeBracketIcon,
  ChatBubbleBottomCenterTextIcon,
  PhotoIcon,
  LinkIcon,
  ListBulletIcon,
} from '@heroicons/react/24/outline';

interface EditorToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onContentChange: (content: string) => void;
  onImageUpload: (file: File) => Promise<string | null>;
}

export default function EditorToolbar({ textareaRef, onContentChange, onImageUpload }: EditorToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const insertAtCursor = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end) || placeholder;
    const newText = before + selectedText + after;

    const newValue = 
      textarea.value.substring(0, start) + 
      newText + 
      textarea.value.substring(end);

    onContentChange(newValue);

    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus();
      const cursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(cursorPos, cursorPos);
    }, 0);
  };

  const insertHeading = (level: number) => {
    insertAtCursor(`<h${level}>`, `</h${level}>`, 'Heading');
  };

  const insertCodeBlock = () => {
    insertAtCursor(
      '<pre><code class="language-javascript">\n',
      '\n</code></pre>',
      '// Your code here'
    );
  };

  const insertInlineCode = () => {
    insertAtCursor('<code>', '</code>', 'code');
  };

  const insertQuote = () => {
    insertAtCursor('<blockquote>\n<p>', '</p>\n</blockquote>', 'Your quote here');
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      insertAtCursor(`<a href="${url}">`, '</a>', 'Link text');
    }
  };

  const insertList = () => {
    insertAtCursor('<ul>\n  <li>', '</li>\n  <li>Item 2</li>\n</ul>', 'Item 1');
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = await onImageUpload(file);
    if (imageUrl) {
      insertAtCursor(`<figure>\n  <img src="${imageUrl}" alt="`, `" />\n  <figcaption>Caption (optional)</figcaption>\n</figure>`, 'Image description');
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const buttons = [
    { label: 'H2', onClick: () => insertHeading(2), title: 'Heading 2' },
    { label: 'H3', onClick: () => insertHeading(3), title: 'Heading 3' },
    { icon: CodeBracketIcon, onClick: insertCodeBlock, title: 'Code block' },
    { label: '<>', onClick: insertInlineCode, title: 'Inline code' },
    { icon: ChatBubbleBottomCenterTextIcon, onClick: insertQuote, title: 'Quote' },
    { icon: LinkIcon, onClick: insertLink, title: 'Link' },
    { icon: ListBulletIcon, onClick: insertList, title: 'List' },
    { icon: PhotoIcon, onClick: handleImageClick, title: 'Insert image' },
  ];

  return (
    <div className="flex flex-wrap gap-1 p-2 border border-[--color-border] border-b-0 rounded-t-lg bg-[--color-bg-secondary]">
      {buttons.map((btn, i) => (
        <button
          key={i}
          type="button"
          onClick={btn.onClick}
          title={btn.title}
          className="px-2 py-1 text-sm font-mono text-[--color-text-secondary] hover:text-[--color-text] hover:bg-[--color-bg-tertiary] rounded transition-colors"
        >
          {btn.icon ? <btn.icon className="h-4 w-4" /> : btn.label}
        </button>
      ))}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        className="hidden"
      />
      
      <div className="flex-1" />
      
      <a
        href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element"
        target="_blank"
        rel="noopener noreferrer"
        className="px-2 py-1 text-xs text-[--color-text-muted] hover:text-[--color-text]"
      >
        HTML Reference
      </a>
    </div>
  );
}
