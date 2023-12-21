export interface ProjectDetails {
  icon: string;
  name: string;
  title: string;
  organization: string;
  url: string;
  domain: string | null;
  id: number;
  createdAt: string;
  createdBy: string;
  deployment: string;
  source: string;
  latestCommit: {
    message: string;
    createdAt: string;
    branch: string;
  };
}
