import ContentManager from "../components/ContentManager";

// Field names match the backend Testimonial model.
const config = {
  endpoint: "/api/testimonials",
  title: "Testimonials",
  imageField: "avatar",
  imageLabel: "Client photo (optional, square)",
  titleField: "clientName",
  subField: "company",
  defaults: { status: "Published", rating: 5 },
  fields: [
    { key: "clientName", label: "Client name", required: true },
    { key: "designation", label: "Client role (e.g. Home owner)" },
    { key: "company", label: "Company / location" },
    { key: "rating", label: "Rating (1–5)", type: "number" },
    { key: "status", label: "Show on website", type: "select", options: ["Published", "Draft"], noEmpty: true },
    { key: "order", label: "Order (smaller shows first)", type: "number" },
    { key: "review", label: "Testimonial", type: "textarea", required: true, wide: true }
  ]
};

export default function Testimonials() { return <ContentManager config={config} />; }
