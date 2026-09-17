import ContentManager from "../components/ContentManager";

const config = {
  endpoint: "/api/projects",
  title: "Projects",
  imageField: "cover_image",
  imageLabel: "Cover image",
  titleField: "title",
  subField: "category",
  multipleFiles: [
    { name: "media_files", label: "Gallery Media (Photos/Videos)", accept: "image/*,video/*" },
    { name: "document_files", label: "Project Documents (PDF/Docx/DWG)", accept: ".pdf,.docx,.dwg" }
  ],
  fields: [
    { key: "title", label: "Title", required: true },
    { key: "category", label: "Category" },
    { key: "location", label: "Location" },
    { key: "year", label: "Year" },
    { key: "area_sqft", label: "Area (sqft)" },
    { key: "status", label: "Status", type: "select", options: ["draft", "published"] },
    { key: "is_featured", label: "Featured", type: "checkbox" },
    { key: "display_order", label: "Display order", type: "number" },
    { key: "description", label: "Description", type: "textarea", wide: true },
    { key: "brief", label: "Brief (Short summary)", type: "textarea", wide: true },
    { key: "detailed_plan", label: "Detailed Engineering Plan", type: "textarea", wide: true },
    { key: "video_url", label: "Video URL (YouTube/Vimeo/Direct)", type: "text" }
  ]
};

export default function Projects() { return <ContentManager config={config} />; }
