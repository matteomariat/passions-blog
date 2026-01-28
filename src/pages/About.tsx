export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-8">
        About
      </h1>

      <div className="prose prose-invert max-w-none
        prose-p:text-[--color-text-secondary] prose-p:leading-relaxed
        prose-headings:text-[--color-text]
        prose-a:text-[--color-text] prose-a:underline prose-a:underline-offset-4
        prose-strong:text-[--color-text]
        prose-ul:text-[--color-text-secondary]
        prose-li:marker:text-[--color-text-muted]
      ">
        <p className="text-lg">
          Hi, I'm <strong>Matteo</strong>. Welcome to my digital corner of the internet.
        </p>

        <p>
          This blog is my personal space to document and share my many passions. 
          I've always been curious about a lot of things, and instead of focusing on 
          just one area, I embrace the chaos of having hundreds of interests.
        </p>

        <h2>What I write about</h2>
        
        <ul>
          <li><strong>Retrogaming & Collection</strong> — Preserving gaming history, one console at a time</li>
          <li><strong>Modding</strong> — Hardware and software modifications, hacking consoles</li>
          <li><strong>Vibecoding</strong> — Building things with AI, creative coding experiments</li>
          <li><strong>Music</strong> — Production, discovery, playlists</li>
          <li><strong>Self-improvement</strong> — Productivity, habits, personal development</li>
          <li><strong>Sports</strong> — Hiking, bikepacking, outdoor adventures</li>
          <li><strong>AI</strong> — Tools, experiments, thoughts on the future</li>
          <li><strong>Digital Marketing</strong> — Acquisition, growth, strategies</li>
          <li><strong>Books</strong> — Reviews, notes, recommendations</li>
          <li><strong>And much more...</strong></li>
        </ul>

        <h2>Why this blog?</h2>

        <p>
          Three reasons:
        </p>

        <ol className="list-decimal">
          <li><strong>For myself</strong> — To remember what I did, learned, and built</li>
          <li><strong>To share</strong> — Maybe someone finds value in my experiments</li>
          <li><strong>To help</strong> — Tutorials, guides, and how-tos for those who want to do the same</li>
        </ol>

        <h2>Get in touch</h2>

        <p>
          Feel free to reach out on <a href="https://twitter.com">Twitter</a> or{' '}
          <a href="https://github.com">GitHub</a>. Always happy to chat about shared interests.
        </p>
      </div>
    </div>
  );
}
