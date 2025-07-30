// /app/projects/[slug]/page.tsx

import FullstackProjects from "../../../components/projects/FullstackProjects";
import LandingPages from "../../../components/projects/LandingPages";
import FunctionalSoftwares from "../../../components/projects/FunctionalSoftwares";
import CreativeProjects from "../../../components/projects/CreativeProjects";

// Use Next.js PageProps type for dynamic routes
export default function ProjectPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  switch (slug) {
    case "fullstack":
      return <FullstackProjects />;
    case "landing":
      return <LandingPages />;
    case "functional":
      return <FunctionalSoftwares />;
    case "creative":
      return <CreativeProjects />;
    default:
      return (
        <div className="text-center text-red-500 p-10">
          Project not found
        </div>
      );
  }
}
