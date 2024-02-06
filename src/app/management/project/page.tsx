import ManagementDashBoard from '../management-dashboard';
import ProjectContainer from './_components/project-manager';

export default async function ProjectPage() {
  return (
    <ManagementDashBoard>
      <ProjectContainer />
    </ManagementDashBoard>
  );
}
