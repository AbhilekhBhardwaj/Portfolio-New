import FullstackProjects from "../../../components/projects/FullstackProjects";
import LandingPages from "../../../components/projects/LandingPages";
import FunctionalSoftwares from "../../../components/projects/FunctionalSoftwares";
import CreativeProjects from "../../../components/projects/CreativeProjects";

type Props = {
  params: {
    slug: string;
  };
};

export default async function ProjectPage({ params }: Props) {
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