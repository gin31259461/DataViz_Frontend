import ManagementDashBoard from '../management-dashboard';
import ProjectContainer from './_components/project-container';

export default async function ProjectPage() {
  return (
    <ManagementDashBoard>
      <ProjectContainer />
    </ManagementDashBoard>
  );
}
