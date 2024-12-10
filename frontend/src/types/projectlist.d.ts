interface Project {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  members: string[];
}

interface ProjectListProps {
  projects: Project[];
}
