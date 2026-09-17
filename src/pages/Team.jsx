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
    { key: "designation", label: "Designation" },
    { key: "experience", label: "Years of Experience" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "linkedin_url", label: "LinkedIn URL" },
    { key: "instagram", label: "Instagram URL" },
    { key: "bio", label: "Bio", type: "textarea", wide: true },
    { key: "is_active", label: "Active", type: "checkbox" },
    { key: "display_order", label: "Display order", type: "number" }
  ]
};

export default function Team() { return <ContentManager config={config} />; }
