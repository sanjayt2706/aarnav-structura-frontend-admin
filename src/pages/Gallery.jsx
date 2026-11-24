import ContentManager from "../components/ContentManager";

// Photos and videos shown on the website's Gallery page (and the home page preview).
// The file type is detected automatically: upload a video and it appears under "Videos".
const config = {
  endpoint: "/api/gallery",
  title: "Gallery",
  imageField: "image",
  imageLabel: "Photo or video (JPG, PNG, WEBP, MP4, WEBM)",
  imageAccept: "image/*,video/mp4,video/webm,video/quicktime",
  titleField: "title",
  subField: "category",
  fields: [
    { key: "title", label: "Title", required: true },
    { key: "category", label: "Category (photo filter)", type: "select", options: ["Exteriors", "Interiors", "Construction", "Other"] },
    { key: "display_order", label: "Order (smaller shows first)", type: "number" },
    { key: "featured", label: "Show on home page", type: "checkbox" }
  ]
};

export default function Gallery() { return <ContentManager config={config} />; }
