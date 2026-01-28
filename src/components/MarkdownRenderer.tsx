import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        // Custom heading styles
        h1: ({ children }) => (
          <h1 className="text-3xl font-bold mt-10 mb-4 text-[--color-text]">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-2xl font-semibold mt-8 mb-3 text-[--color-text] border-b border-[--color-border] pb-2">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl font-semibold mt-6 mb-2 text-[--color-text]">{children}</h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-lg font-medium mt-4 mb-2 text-[--color-text]">{children}</h4>
        ),
        
        // Paragraphs
        p: ({ children }) => (
          <p className="my-4 text-[--color-text-secondary] leading-relaxed">{children}</p>
        ),
        
        // Links
        a: ({ href, children }) => (
          <a 
            href={href} 
            className="text-[--color-text] underline underline-offset-4 hover:opacity-70 transition-opacity"
            target={href?.startsWith('http') ? '_blank' : undefined}
            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            {children}
          </a>
        ),
        
        // Lists
        ul: ({ children }) => (
          <ul className="my-4 ml-6 list-disc text-[--color-text-secondary] space-y-2">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="my-4 ml-6 list-decimal text-[--color-text-secondary] space-y-2">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="leading-relaxed">{children}</li>
        ),
        
        // Blockquotes
        blockquote: ({ children }) => (
          <blockquote className="my-6 pl-4 border-l-4 border-[--color-border] italic text-[--color-text-secondary]">
            {children}
          </blockquote>
        ),
        
        // Code blocks
        pre: ({ children }) => (
          <pre className="my-6 p-4 rounded-lg bg-[--color-bg-secondary] border border-[--color-border] overflow-x-auto">
            {children}
          </pre>
        ),
        code: ({ className, children, ...props }) => {
          const isInline = !className;
          if (isInline) {
            return (
              <code className="px-1.5 py-0.5 rounded bg-[--color-bg-tertiary] text-[--color-text] font-mono text-sm" {...props}>
                {children}
              </code>
            );
          }
          return (
            <code className={`${className} text-sm font-mono`} {...props}>
              {children}
            </code>
          );
        },
        
        // Images
        img: ({ src, alt }) => (
          <figure className="my-8">
            <img 
              src={src} 
              alt={alt || ''} 
              className="rounded-lg border border-[--color-border] w-full"
            />
            {alt && (
              <figcaption className="mt-2 text-center text-sm text-[--color-text-muted]">
                {alt}
              </figcaption>
            )}
          </figure>
        ),
        
        // Horizontal rule
        hr: () => (
          <hr className="my-8 border-[--color-border]" />
        ),
        
        // Tables (GFM)
        table: ({ children }) => (
          <div className="my-6 overflow-x-auto">
            <table className="w-full border-collapse border border-[--color-border]">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-[--color-bg-secondary]">{children}</thead>
        ),
        th: ({ children }) => (
          <th className="border border-[--color-border] px-4 py-2 text-left font-semibold text-[--color-text]">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border border-[--color-border] px-4 py-2 text-[--color-text-secondary]">
            {children}
          </td>
        ),
        
        // Strong and emphasis
        strong: ({ children }) => (
          <strong className="font-semibold text-[--color-text]">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic">{children}</em>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
