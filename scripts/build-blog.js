const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'blog', 'posts');
const BLOG_DIR = path.join(ROOT, 'blog');

function escapeHtml(s) {
  if (typeof s !== 'string') return '';
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDate(dateInput) {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return dateInput;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
}

function isoDate(dateInput) {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const NAV = `
    <nav class="navbar">
        <div class="container">
            <div class="logo">
                <a href="/">Oria AI</a>
            </div>
            <div class="nav-links">
                <a href="/#problem">The Problem</a>
                <a href="/#features">Features</a>
                <a href="/#how-it-works">How It Works</a>
                <a href="/blog/">Blog</a>
                <a href="https://testflight.apple.com/join/edVXvcNq" class="cta-button" target="_blank"
                    rel="noopener noreferrer">Join Beta</a>
            </div>
            <div class="mobile-menu">
                <i class="fas fa-bars"></i>
            </div>
        </div>
    </nav>`;

const FOOTER = `
    <footer class="footer">
        <div class="container">
            <div class="footer-bottom">
                <p>&copy; 2026 TheOther Intelligence LLC. All rights reserved.</p>
                <div class="social-links">
                    <a href="https://discord.gg/nCrdPWWB" target="_blank" rel="noopener noreferrer"><i class="fab fa-discord"></i></a>
                    <a href="https://x.com/OriaAI_official" target="_blank" rel="noopener noreferrer"><i class="fab fa-x-twitter"></i></a>
                    <a href="https://www.linkedin.com/company/theother-intelligence/" target="_blank" rel="noopener noreferrer"><i class="fab fa-linkedin"></i></a>
                    <a href="https://instagram.com/oria.theother.me" target="_blank" rel="noopener noreferrer"><i class="fab fa-instagram"></i></a>
                </div>
            </div>
        </div>
    </footer>`;

function getPostTemplate() {
  return `<!DOCTYPE html>
<html lang="en">

<head>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-7YWQHLE5Q0"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-7YWQHLE5Q0');
    </script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{titleEsc}} - Oria AI Blog</title>
    <meta name="description" content="{{descriptionEsc}}">
    <link rel="icon" href="../assets/favicon.png" type="image/png">
    <link rel="stylesheet" href="../css/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
</head>

<body>
    <!-- Navigation -->
${NAV}

    <article class="blog-post">
        <div class="container container-narrow">
            <a href="/blog/" class="back-link">
                <i class="fas fa-arrow-left"></i>
                Back to Blog
            </a>
            <header class="blog-post-header">
                <time datetime="{{dateIso}}" class="blog-post-date">{{dateFormatted}}</time>
                <h1 class="blog-post-title">{{title}}</h1>
                <p class="blog-post-lead">{{lead}}</p>
            </header>
            <div class="blog-post-body">
{{body}}
            </div>
        </div>
    </article>
${FOOTER}

    <script src="../js/main.js"></script>
</body>

</html>`;
}

function getIndexTemplate() {
  return `<!DOCTYPE html>
<html lang="en">

<head>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-7YWQHLE5Q0"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-7YWQHLE5Q0');
    </script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog - Oria AI</title>
    <meta name="description" content="Insights on personal AI, well-being, and your evolvable digital self.">
    <link rel="icon" href="../assets/favicon.png" type="image/png">
    <link rel="stylesheet" href="../css/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
</head>

<body>
    <!-- Navigation -->
${NAV}

    <section class="blog-listing">
        <div class="container">
            <a href="/" class="back-link">
                <i class="fas fa-arrow-left"></i>
                Back to Home
            </a>
            <div class="section-header">
                <h1>Blog</h1>
                <p>Insights on personal AI, well-being, and your evolvable digital self</p>
            </div>
            <div class="blog-grid">
{{postsHtml}}
            </div>
        </div>
    </section>
${FOOTER}

    <script src="../js/main.js"></script>
</body>

</html>`;
}

function buildPost(post, template) {
  const titleEsc = escapeHtml(post.title);
  const descriptionEsc = escapeHtml(post.description);
  const dateFormatted = formatDate(post.date);
  const dateIso = isoDate(post.date);
  const lead = post.lead != null ? escapeHtml(post.lead) : descriptionEsc;
  const body = marked.parse(post.content);

  return template
    .replace(/\{\{titleEsc\}\}/g, titleEsc)
    .replace(/\{\{descriptionEsc\}\}/g, descriptionEsc)
    .replace(/\{\{dateFormatted\}\}/g, dateFormatted)
    .replace(/\{\{dateIso\}\}/g, dateIso)
    .replace(/\{\{lead\}\}/g, lead)
    .replace(/\{\{title\}\}/g, post.title)
    .replace(/\{\{body\}\}/g, body);
}

function buildIndex(posts, template) {
  const cards = posts.map((p) => {
    const dateFormatted = formatDate(p.date);
    const dateIso = isoDate(p.date);
    const desc = escapeHtml(p.description);
    const titleEsc = escapeHtml(p.title);
    const url = `/blog/${p.slug}.html`;
    return `                <article class="blog-card">
                    <div class="blog-card-meta">
                        <time datetime="${dateIso}">${dateFormatted}</time>
                    </div>
                    <h2><a href="${url}">${titleEsc}</a></h2>
                    <p>${desc}</p>
                    <a href="${url}" class="blog-read-more">
                        Read more <i class="fas fa-arrow-right"></i>
                    </a>
                </article>`;
  });
  return template.replace(/\{\{postsHtml\}\}/g, cards.join('\n'));
}

function main() {
  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
    console.log('Created blog/posts/ (no .md files yet)');
    return;
  }

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));
  const posts = [];

  for (const file of files) {
    const filePath = path.join(POSTS_DIR, file);
    const raw = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(raw);
    const slug = data.slug || path.basename(file, '.md');
    if (!data.title || !data.date) {
      console.warn(`Skipping ${file}: missing title or date`);
      continue;
    }
    posts.push({
      slug,
      title: data.title,
      date: data.date,
      description: data.description || '',
      lead: data.lead,
      content: content.trim(),
    });
  }

  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  const postTemplate = getPostTemplate();
  const indexTemplate = getIndexTemplate();

  for (const post of posts) {
    const html = buildPost(post, postTemplate);
    const outPath = path.join(BLOG_DIR, `${post.slug}.html`);
    fs.writeFileSync(outPath, html, 'utf8');
    console.log('Wrote', outPath);
  }

  const indexHtml = buildIndex(posts, indexTemplate);
  fs.writeFileSync(path.join(BLOG_DIR, 'index.html'), indexHtml, 'utf8');
  console.log('Wrote blog/index.html');
}

main();
