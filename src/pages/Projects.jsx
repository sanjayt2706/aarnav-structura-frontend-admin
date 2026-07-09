import ContentManager from "../components/ContentManager";

const config = {
  endpoint: "/api/projects",
  title: "Projects",
  imageField: "cover_image",
  imageLabel: "Cover image",
  titleField: "title",
  subField: "category",
  fields: [
    { key: "title", label: "Title", required: true },
    { key: "category", label: "Category" },
    { key: "location", label: "Location" },
    { key: "year", label: "Year" },
    { key: "area_sqft", label: "Area (sqft)" },
    { key: "status", label: "Status", type: "select", options: ["draft", "published"] },
    { key: "is_featured", label: "Featured", type: "checkbox" },
    { key: "display_order", label: "Display order", type: "number" },
    { key: "description", label: "Description", type: "textarea", wide: true }
  ]
};

export default function Projects() { return <ContentManager config={config} />; }
