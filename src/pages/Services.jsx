import ContentManager from "../components/ContentManager";

const config = {
  endpoint: "/api/services",
  title: "Services",
  imageField: "image",
  imageLabel: "Image",
  titleField: "title",
  subField: "short_description",
  fields: [
    { key: "title", label: "Title", required: true },
    { key: "slug", label: "Slug", required: true },
    { key: "icon", label: "Icon (emoji/class)" },
    { key: "is_active", label: "Active", type: "checkbox" },
    { key: "display_order", label: "Display order", type: "number" },
    { key: "short_description", label: "Short description", type: "textarea", wide: true },
    { key: "full_description", label: "Full description", type: "textarea", wide: true }
  ]
};

export default function Services() { return <ContentManager config={config} />; }
