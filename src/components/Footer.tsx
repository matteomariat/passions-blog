export default function Footer() {
  return (
    <footer className="border-t border-[--color-border] py-8 mt-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[--color-text-muted]">
          <p className="font-mono">
            &copy; {new Date().getFullYear()} matteo
          </p>
          <div className="flex items-center gap-6">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-[--color-text] transition-colors"
            >
              GitHub
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-[--color-text] transition-colors"
            >
              Twitter
            </a>
            <a 
              href="/rss.xml" 
              className="hover:text-[--color-text] transition-colors"
            >
              RSS
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
