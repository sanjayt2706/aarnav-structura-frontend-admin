import ContentManager from "../components/ContentManager";

// Field names match the backend Team model. New members start visible on the website.
const config = {
  endpoint: "/api/team",
  title: "Team",
  imageField: "photo",
  imageLabel: "Photo (tall portrait works best)",
  titleField: "name",
  subField: "role",
  defaults: { is_active: true },
  fields: [
    { key: "name", label: "Name", required: true },
    { key: "role", label: "Role (e.g. Principal Structural Engineer)" },
    { key: "designation", label: "Qualification (e.g. M.Tech, MIE)" },
    { key: "experience", label: "Experience (e.g. 14+ years)" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "linkedin_url", label: "LinkedIn URL" },
    { key: "instagram", label: "Instagram URL" },
    { key: "bio", label: "Short bio", type: "textarea", wide: true },
    { key: "display_order", label: "Order (smaller shows first)", type: "number" },
    { key: "is_active", label: "Show on website", type: "checkbox" }
  ]
};

export default function Team() { return <ContentManager config={config} />; }
