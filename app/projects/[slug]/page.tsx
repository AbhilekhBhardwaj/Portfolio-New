export const dynamic = "force-dynamic";

import FullstackProjects from "../../../components/projects/FullstackProjects";
import UIProjects from "../../../components/projects/UIProjects";
import FunctionalSoftwares from "../../../components/projects/FunctionalSoftwares";
import CreativeProjects from "../../../components/projects/CreativeProjects";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;

  switch (slug) {
    case "fullstack":
      return <FullstackProjects />;
    case "ui":
      return <UIProjects />;
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