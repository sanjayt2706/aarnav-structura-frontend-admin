import ContentManager from "../components/ContentManager";

// Field names match the backend Service model.
const config = {
  endpoint: "/api/services",
  title: "Services",
  imageField: "image",
  imageLabel: "Photo (wide/landscape works best)",
  titleField: "title",
  subField: "status",
  defaults: { status: "Published" },
  fields: [
    { key: "title", label: "Title", required: true },
    { key: "status", label: "Show on website", type: "select", options: ["Published", "Draft"], noEmpty: true },
    { key: "order", label: "Order (smaller shows first)", type: "number" },
    { key: "featured", label: "Featured", type: "checkbox" },
    { key: "description", label: "Description", type: "textarea", wide: true }
  ]
};

export default function Services() { return <ContentManager config={config} />; }
