import ContentManager from "../components/ContentManager";

const config = {
  endpoint: "/api/testimonials",
  title: "Testimonials",
  imageField: "avatar",
  imageLabel: "Avatar",
  titleField: "client_name",
  subField: "client_role",
  fields: [
    { key: "client_name", label: "Client name", required: true },
    { key: "client_role", label: "Client role" },
    { key: "rating", label: "Rating (1-5)", type: "number" },
    { key: "is_featured", label: "Featured", type: "checkbox" },
    { key: "display_order", label: "Display order", type: "number" },
    { key: "content", label: "Testimonial", type: "textarea", required: true, wide: true }
  ]
};

export default function Testimonials() { return <ContentManager config={config} />; }
