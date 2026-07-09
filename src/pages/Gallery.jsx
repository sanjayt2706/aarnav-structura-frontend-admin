import ContentManager from "../components/ContentManager";

const config = {
  endpoint: "/api/gallery",
  title: "Gallery",
  imageField: "image_url",
  imageLabel: "Image",
  titleField: "title",
  subField: "category",
  fields: [
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    { key: "project_id", label: "Project ID (optional)", type: "number" },
    { key: "display_order", label: "Display order", type: "number" }
  ]
};

export default function Gallery() { return <ContentManager config={config} />; }
