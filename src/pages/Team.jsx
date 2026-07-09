import ContentManager from "../components/ContentManager";

const config = {
  endpoint: "/api/team",
  title: "Team",
  imageField: "photo",
  imageLabel: "Photo",
  titleField: "name",
  subField: "role",
  fields: [
    { key: "name", label: "Name", required: true },
    { key: "role", label: "Role" },
    { key: "linkedin_url", label: "LinkedIn URL" },
    { key: "is_active", label: "Active", type: "checkbox" },
    { key: "display_order", label: "Display order", type: "number" },
    { key: "bio", label: "Bio", type: "textarea", wide: true }
  ]
};

export default function Team() { return <ContentManager config={config} />; }
