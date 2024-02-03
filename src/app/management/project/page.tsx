import ManagementDashBoard from '../management-dashboard';
import ProjectManager from './project-manager';

export default async function ProjectPage() {
  return (
    <ManagementDashBoard>
      <ProjectManager />
    </ManagementDashBoard>
  );
}
