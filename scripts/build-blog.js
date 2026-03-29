const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'blog', 'posts');
const BLOG_DIR = path.join(ROOT, 'blog');
const INDEX_HTML = path.join(ROOT, 'index.html');
const BLOG_TEASER_START = '                <!-- BLOG_TEASER_START -->';
const BLOG_TEASER_END = '                <!-- BLOG_TEASER_END -->';
const BLOG_TEASER_MAX = 3;
const BASE_URL = 'https://oria.me';

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

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const NAV = `
    <!-- Minimal Navigation -->
    <nav class="navbar">
        <div class="container nav-container">
            <a href="/" class="brand-logo">ORIA AI</a>
            <div class="nav-links">
                <a href="/#vision" class="nav-item">Vision</a>
                <a href="/#ecosystem" class="nav-item">Ecosystem</a>
                <a href="/blog/" class="nav-item">Blog</a>
            </div>
            <div class="mobile-toggle"><i class="fas fa-bars"></i></div>
        </div>
    </nav>`;

const FOOTER = `
    <!-- Refined Footer -->
    <footer class="minimal-footer">
        <div class="container footer-container">
            <div class="footer-top">
                <div class="footer-brand">ORIA AI</div>
                <div class="footer-social">
                    <a href="https://discord.gg/Vxzb2NW9nx" target="_blank" rel="noopener noreferrer">Discord</a>
                    <a href="https://x.com/OriaAI_official" target="_blank" rel="noopener noreferrer">Twitter</a>
                    <a href="https://www.linkedin.com/company/theother-intelligence/" target="_blank"
                        rel="noopener noreferrer">LinkedIn</a>
                    <a href="https://instagram.com/oriaai.official" target="_blank"
                        rel="noopener noreferrer">Instagram</a>
                </div>
            </div>
            <div class="footer-bottom">
                <div class="footer-copy">&copy; 2026 TheOther Intelligence LLC.</div>
                <div class="footer-legal">
                    <a href="/privacy.html">Privacy</a>
                    <a href="/terms.html">Terms</a>
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
    <link rel="canonical" href="{{postUrl}}">
    <link rel="icon" href="../assets/favicon.png" type="image/png">
    <!-- Open Graph -->
    <meta property="og:url" content="{{postUrl}}">
    <meta property="og:title" content="{{titleEsc}}">
    <meta property="og:description" content="{{descriptionEsc}}">
    <meta property="og:image" content="{{baseUrl}}/assets/og-image.png">
    <meta property="og:type" content="article">
    <meta property="article:published_time" content="{{dateIso}}">
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{titleEsc}}">
    <meta name="twitter:description" content="{{descriptionEsc}}">
    <meta name="twitter:image" content="{{baseUrl}}/assets/og-image.png">
    <link rel="stylesheet" href="../css/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <script type="application/ld+json">{{blogPostingSchema}}</script>
</head>

<body>
    <div class="background-canvas">
        <div class="gradient-orb orb-sage"></div>
        <div class="gradient-orb orb-gold"></div>
        <div class="gradient-orb orb-blue"></div>
        <div class="noise-overlay"></div>
    </div>
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
    <link rel="canonical" href="${BASE_URL}/blog/">
    <meta property="og:url" content="${BASE_URL}/blog/">
    <meta property="og:title" content="Blog - Oria AI">
    <meta property="og:description" content="Insights on personal AI, well-being, and your evolvable digital self.">
    <meta property="og:image" content="${BASE_URL}/assets/og-image.png">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Blog - Oria AI">
    <meta name="twitter:description" content="Insights on personal AI, well-being, and your evolvable digital self.">
    <meta name="twitter:image" content="${BASE_URL}/assets/og-image.png">
    <link rel="icon" href="../assets/favicon.png" type="image/png">
    <link rel="stylesheet" href="../css/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
</head>

<body>
    <div class="background-canvas">
        <div class="gradient-orb orb-sage"></div>
        <div class="gradient-orb orb-gold"></div>
        <div class="gradient-orb orb-blue"></div>
        <div class="noise-overlay"></div>
    </div>
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
  const postUrl = `${BASE_URL}/blog/${post.slug}.html`;

  const blogPostingSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: dateIso,
    url: postUrl,
    author: { '@type': 'Organization', name: 'Oria AI' },
  });

  return template
    .replace(/\{\{titleEsc\}\}/g, titleEsc)
    .replace(/\{\{descriptionEsc\}\}/g, descriptionEsc)
    .replace(/\{\{dateFormatted\}\}/g, dateFormatted)
    .replace(/\{\{dateIso\}\}/g, dateIso)
    .replace(/\{\{lead\}\}/g, lead)
    .replace(/\{\{title\}\}/g, post.title)
    .replace(/\{\{body\}\}/g, body)
    .replace(/\{\{postUrl\}\}/g, postUrl)
    .replace(/\{\{baseUrl\}\}/g, BASE_URL)
    .replace(/\{\{blogPostingSchema\}\}/g, blogPostingSchema);
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

function buildSitemap(posts) {
  const urls = [
    { loc: `${BASE_URL}/`, changefreq: 'weekly', priority: '1.0' },
    { loc: `${BASE_URL}/blog/`, changefreq: 'weekly', priority: '0.9' },
    { loc: `${BASE_URL}/privacy.html`, changefreq: 'monthly', priority: '0.5' },
    { loc: `${BASE_URL}/terms.html`, changefreq: 'monthly', priority: '0.5' },
    { loc: `${BASE_URL}/slideshow.html`, changefreq: 'monthly', priority: '0.4' },
  ];

  for (const post of posts) {
    urls.push({
      loc: `${BASE_URL}/blog/${post.slug}.html`,
      changefreq: 'monthly',
      priority: '0.8',
      lastmod: isoDate(post.date),
    });
  }

  const urlEntries = urls
    .map((u) => {
      let entry = `  <url>\n    <loc>${escapeXml(u.loc)}</loc>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>`;
      if (u.lastmod) {
        entry += `\n    <lastmod>${u.lastmod}</lastmod>`;
      }
      return entry + '\n  </url>';
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

function buildTeaserHtml(posts) {
  const latest = posts.slice(0, BLOG_TEASER_MAX);
  return latest
    .map((p) => {
      const dateFormatted = formatDate(p.date);
      const dateIso = isoDate(p.date);
      const titleEsc = escapeHtml(p.title);
      const url = `/blog/${p.slug}.html`;
      return `                <article class="editorial-card">
                    <div class="editorial-meta">${dateFormatted}</div>
                    <h3 class="editorial-title"><a href="${url}">${titleEsc}</a></h3>
                    <a href="${url}" class="editorial-link">Read essay</a>
                </article>`;
    })
    .join('\n');
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

  const sitemapXml = buildSitemap(posts);
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemapXml, 'utf8');
  console.log('Wrote sitemap.xml');

  // Update homepage blog teaser with latest N posts
  if (fs.existsSync(INDEX_HTML)) {
    let homeHtml = fs.readFileSync(INDEX_HTML, 'utf8');
    if (homeHtml.includes(BLOG_TEASER_START) && homeHtml.includes(BLOG_TEASER_END)) {
      const teaserHtml = buildTeaserHtml(posts);
      const teaserBlock = new RegExp(
        BLOG_TEASER_START.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[\\s\\S]*?' + BLOG_TEASER_END.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        'g'
      );
      homeHtml = homeHtml.replace(teaserBlock, BLOG_TEASER_START + '\n' + teaserHtml + '\n' + BLOG_TEASER_END);
      fs.writeFileSync(INDEX_HTML, homeHtml, 'utf8');
      console.log('Updated index.html blog teaser with latest', Math.min(posts.length, BLOG_TEASER_MAX), 'posts');
    }
  }
}

main();
