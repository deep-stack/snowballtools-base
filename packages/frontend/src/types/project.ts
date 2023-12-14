export interface ProjectDetails {
  icon: string;
  title: string;
  domain: string;
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
