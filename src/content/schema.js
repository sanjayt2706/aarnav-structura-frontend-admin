/**
 * Describes every editable section of the public website.
 * The "Website Content" page builds its forms from this list.
 *
 * Field types: text | textarea | number | image | video | list
 * A "list" has `item` (its own fields) and `itemLabel` (how each row is titled).
 * Keys must match backend/config/contentDefaults.js.
 */

const link = (key = "buttonLink", label = "Button link") => ({
  key,
  label,
  type: "text",
  help: "A page on this site like /contact or /projects, or a full https:// address."
});

export const SECTIONS = [
  {
    key: "hero",
    label: "Home — Hero slideshow",
    group: "Home page",
    preview: "/",
    help: "The full-screen slideshow at the top of the home page. Each slide also becomes a tab along the bottom.",
    fields: [
      { key: "intervalSeconds", label: "Seconds per slide", type: "number", min: 3, max: 30 },
      {
        key: "slides",
        label: "Slides",
        type: "list",
        itemLabel: (s, i) => s.tab || s.title || `Slide ${i + 1}`,
        newItem: { tab: "New tab", title: "New headline", subtitle: "", image: "", video: "", buttonLabel: "Explore", buttonLink: "/projects" },
        item: [
          { key: "tab", label: "Tab name (bottom bar)", type: "text" },
          { key: "title", label: "Headline", type: "text", help: "Keep it short — 2 to 4 words look best. Use | to force a line break." },
          { key: "subtitle", label: "Sub-headline", type: "text" },
          { key: "image", label: "Background image", type: "image", help: "Landscape, at least 2000px wide. Dark or busy photos work best behind white text." },
          { key: "video", label: "Background video (optional)", type: "video", help: "MP4, under 20 MB, no sound needed. If set, it plays instead of the image (the image is shown while it loads)." },
          { key: "buttonLabel", label: "Button text", type: "text", help: "Leave empty to hide the button." },
          link(),
          { key: "isBrandTab", label: "Show logo mark instead of tab name", type: "checkbox" }
        ]
      }
    ]
  },
  {
    key: "intro",
    label: "Home — Who we are",
    group: "Home page",
    preview: "/",
    fields: [
      { key: "eyebrow", label: "Small label", type: "text" },
      { key: "statement", label: "Big statement", type: "textarea", rows: 3, help: "Words light up one by one as visitors scroll." },
      { key: "body", label: "Paragraph", type: "textarea", rows: 4 },
      { key: "linkLabel", label: "Link text", type: "text" },
      link("linkHref", "Link goes to"),
      { key: "image", label: "Photo", type: "image" }
    ]
  },
  {
    key: "stats",
    label: "Numbers (stats)",
    group: "Home page",
    preview: "/",
    help: "Shown under “Who we are” and on the About page. Numbers count up when they scroll into view.",
    fields: [
      {
        key: "items",
        label: "Stats",
        type: "list",
        itemLabel: (s) => `${s.value || ""}${s.suffix || ""} ${s.label || ""}`.trim() || "Stat",
        newItem: { value: "10", suffix: "+", label: "New stat" },
        item: [
          { key: "value", label: "Number", type: "text", help: "Digits only, e.g. 120" },
          { key: "suffix", label: "After the number", type: "text", help: "e.g. +, %, L+" },
          { key: "label", label: "Label", type: "text" }
        ]
      }
    ]
  },
  {
    key: "whatWeDo",
    label: "What we do (headings)",
    group: "Home page",
    preview: "/what-we-do",
    help: "The services themselves are edited under “Services” in the sidebar. Here you set the section heading and the photos used for services that don't have their own image.",
    fields: [
      { key: "eyebrow", label: "Small label", type: "text" },
      { key: "heading", label: "Heading", type: "text" },
      { key: "intro", label: "Intro text", type: "textarea", rows: 3 },
      {
        key: "fallbackImages",
        label: "Fallback service photos",
        type: "list",
        primitive: "image",
        itemLabel: (_, i) => `Photo ${i + 1}`,
        newItem: ""
      }
    ]
  },
  {
    key: "sectors",
    label: "Sectors",
    group: "Home page",
    preview: "/",
    fields: [
      { key: "eyebrow", label: "Small label", type: "text" },
      { key: "heading", label: "Heading", type: "text" },
      {
        key: "items",
        label: "Sectors",
        type: "list",
        itemLabel: (s) => s.name || "Sector",
        newItem: { name: "New sector", text: "", image: "" },
        item: [
          { key: "name", label: "Name", type: "text" },
          { key: "text", label: "Description", type: "textarea", rows: 2 },
          { key: "image", label: "Photo", type: "image" }
        ]
      }
    ]
  },
  {
    key: "projectsSection",
    label: "Featured projects (heading)",
    group: "Home page",
    preview: "/",
    help: "Projects are added under “Projects” in the sidebar. Tick “Featured” on a project to show it here (needs at least 3 featured, otherwise all projects are shown).",
    fields: [
      { key: "eyebrow", label: "Small label", type: "text" },
      { key: "heading", label: "Heading", type: "text" },
      { key: "linkLabel", label: "Link text", type: "text" },
      link("linkHref", "Link goes to")
    ]
  },
  {
    key: "gallerySection",
    label: "Gallery & videos (headings)",
    group: "Home page",
    preview: "/gallery",
    help: "The photos and videos themselves are managed under “Gallery” in the sidebar. Tick “Show on home page” on a photo to put it in the home page mosaic (5 are shown).",
    fields: [
      { key: "eyebrow", label: "Gallery — small label", type: "text" },
      { key: "heading", label: "Gallery — heading", type: "text" },
      { key: "intro", label: "Gallery — intro", type: "textarea", rows: 2 },
      { key: "linkLabel", label: "Gallery — link text", type: "text" },
      { key: "videosEyebrow", label: "Videos — small label", type: "text" },
      { key: "videosHeading", label: "Videos — heading", type: "text" },
      { key: "videosIntro", label: "Videos — intro", type: "textarea", rows: 2 }
    ]
  },
  {
    key: "about",
    label: "About us",
    group: "About",
    preview: "/about",
    fields: [
      { key: "eyebrow", label: "Small label", type: "text" },
      { key: "heading", label: "Heading", type: "text" },
      { key: "body", label: "Text", type: "textarea", rows: 7, help: "Leave an empty line between paragraphs." },
      { key: "image", label: "Photo", type: "image", help: "Portrait (tall) photos fit best." },
      {
        key: "values",
        label: "Values",
        type: "list",
        itemLabel: (v) => v.title || "Value",
        newItem: { title: "New value", text: "" },
        item: [
          { key: "title", label: "Title", type: "text" },
          { key: "text", label: "Text", type: "textarea", rows: 2 }
        ]
      }
    ]
  },
  {
    key: "process",
    label: "How we work (steps)",
    group: "About",
    preview: "/about",
    fields: [
      { key: "eyebrow", label: "Small label", type: "text" },
      { key: "heading", label: "Heading", type: "text" },
      {
        key: "steps",
        label: "Steps",
        type: "list",
        itemLabel: (s, i) => `${i + 1}. ${s.title || ""}`,
        newItem: { title: "New step", text: "" },
        item: [
          { key: "title", label: "Title", type: "text" },
          { key: "text", label: "Text", type: "textarea", rows: 2 }
        ]
      }
    ]
  },
  {
    key: "cta",
    label: "Call-to-action band",
    group: "Every page",
    preview: "/",
    help: "The maroon band near the bottom of most pages.",
    fields: [
      { key: "heading", label: "Heading", type: "text" },
      { key: "text", label: "Text", type: "text" },
      { key: "buttonLabel", label: "Button text", type: "text" },
      link(),
      { key: "image", label: "Background texture photo", type: "image", help: "Shown in black & white behind the maroon." }
    ]
  },
  {
    key: "contact",
    label: "Contact details",
    group: "Every page",
    preview: "/contact",
    help: "Used on the Contact page, in the header, the mobile menu and the footer.",
    fields: [
      { key: "heading", label: "Contact page heading", type: "text" },
      { key: "text", label: "Contact page intro", type: "textarea", rows: 2 },
      { key: "phone", label: "Phone", type: "text" },
      { key: "whatsapp", label: "WhatsApp number", type: "text", help: "With country code, e.g. +91 87623 98728" },
      { key: "email", label: "Email", type: "text" },
      { key: "address", label: "Address", type: "text" },
      { key: "hours", label: "Working hours", type: "text" },
      { key: "mapEmbedUrl", label: "Google Maps embed link", type: "text", help: "Google Maps → Share → Embed a map → copy only the https://… part inside src=\"…\"" }
    ]
  },
  {
    key: "footer",
    label: "Footer & social links",
    group: "Every page",
    preview: "/",
    fields: [
      { key: "tagline", label: "Tagline", type: "textarea", rows: 2 },
      { key: "copyright", label: "Copyright line", type: "text", help: "{year} is replaced with the current year." },
      { key: "instagram", label: "Instagram URL", type: "text" },
      { key: "facebook", label: "Facebook URL", type: "text" },
      { key: "linkedin", label: "LinkedIn URL", type: "text" },
      { key: "youtube", label: "YouTube URL", type: "text" }
    ]
  },
  {
    key: "pageHeaders",
    label: "Page banners",
    group: "Every page",
    preview: "/about",
    help: "Title and background photo at the top of each inner page.",
    fields: [
      { key: "aboutTitle", label: "About — title", type: "text" },
      { key: "aboutImage", label: "About — photo", type: "image" },
      { key: "whatWeDoTitle", label: "What we do — title", type: "text" },
      { key: "whatWeDoImage", label: "What we do — photo", type: "image" },
      { key: "projectsTitle", label: "Projects — title", type: "text" },
      { key: "projectsImage", label: "Projects — photo", type: "image" },
      { key: "galleryTitle", label: "Gallery — title", type: "text" },
      { key: "galleryImage", label: "Gallery — photo", type: "image" },
      { key: "teamTitle", label: "Team — title", type: "text" },
      { key: "teamImage", label: "Team — photo", type: "image" },
      { key: "contactTitle", label: "Contact — title", type: "text" },
      { key: "contactImage", label: "Contact — photo", type: "image" }
    ]
  },
  {
    key: "brand",
    label: "Logo & favicon",
    group: "Brand & SEO",
    preview: "/",
    fields: [
      { key: "companyName", label: "Company name", type: "text" },
      { key: "logoLight", label: "Logo for dark backgrounds (header, footer)", type: "image", help: "PNG with transparent background, white/light colours." },
      { key: "logoDark", label: "Logo for light backgrounds", type: "image", help: "PNG with transparent background." },
      { key: "favicon", label: "Browser tab icon", type: "image", help: "Square PNG, at least 256×256." }
    ]
  },
  {
    key: "seo",
    label: "Search engines (SEO)",
    group: "Brand & SEO",
    preview: "/",
    fields: [
      { key: "title", label: "Home page title", type: "text", help: "Shown in Google results and the browser tab. ~60 characters." },
      { key: "description", label: "Description", type: "textarea", rows: 3, help: "Shown under the title in Google. ~155 characters." }
    ]
  }
];
