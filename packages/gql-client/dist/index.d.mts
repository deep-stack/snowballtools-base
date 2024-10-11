declare enum Role {
    Owner = "Owner",
    Maintainer = "Maintainer",
    Reader = "Reader"
}
declare enum Permission {
    View = "View",
    Edit = "Edit"
}
declare enum Environment {
    Production = "Production",
    Preview = "Preview",
    Development = "Development"
}
declare enum DeploymentStatus {
    Building = "Building",
    Ready = "Ready",
    Error = "Error",
    Deleting = "Deleting"
}
declare enum AuctionStatus {
    AuctionStatusCommitPhase = "commit",
    AuctionStatusRevealPhase = "reveal",
    AuctionStatusExpired = "expired",
    AuctionStatusCompleted = "completed"
}
type Bid = {
    auctionId: string;
    bidderAddress: string;
    status: string;
    commitHash: string;
    commitTime?: Date;
    commitFee?: string;
    revealTime?: Date;
    revealFee?: string;
    bidAmount?: string;
};
type Auction = {
    id: string;
    kind: string;
    status: string;
    ownerAddress: string;
    createTime?: Date;
    commitsEndTime?: Date;
    revealsEndTime?: Date;
    commitFee?: string;
    revealFee?: string;
    minimumBid?: string;
    winnerAddresses: string[];
    winnerBids?: string[];
    winnerPrice?: string;
    maxPrice?: string;
    numProviders: number;
    fundsReleased: boolean;
    bids: Bid[];
};
declare enum DomainStatus {
    Live = "Live",
    Pending = "Pending"
}
type EnvironmentVariable = {
    id: string;
    environment: Environment;
    key: string;
    value: string;
    createdAt: string;
    updatedAt: string;
};
type Domain = {
    id: string;
    branch: string;
    name: string;
    status: DomainStatus;
    redirectTo: Domain | null;
    createdAt: string;
    updatedAt: string;
};
type User = {
    id: string;
    name: string | null;
    email: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    gitHubToken: string | null;
};
type Deployment = {
    id: string;
    domain: Domain;
    branch: string;
    commitHash: string;
    commitMessage: string;
    url?: string;
    deployerLrn: string;
    environment: Environment;
    isCurrent: boolean;
    status: DeploymentStatus;
    createdBy: User;
    createdAt: string;
    updatedAt: string;
};
type OrganizationMember = {
    id: string;
    member: User;
    role: Role;
    createdAt: string;
    updatedAt: string;
};
type ProjectMember = {
    id: string;
    member: User;
    permissions: Permission[];
    isPending: boolean;
    createdAt: string;
    updatedAt: string;
};
type OrganizationProject = {
    id: string;
    owner: User;
    deployments: Deployment[];
    name: string;
    repository: string;
    prodBranch: string;
    description: string;
    template: string;
    framework: string;
    webhooks: string[];
    members: ProjectMember[];
    environmentVariables: EnvironmentVariable[];
    createdAt: string;
    updatedAt: string;
};
type Organization = {
    id: string;
    name: string;
    slug: string;
    projects: OrganizationProject[];
    createdAt: string;
    updatedAt: string;
    members: OrganizationMember[];
};
type Project = {
    id: string;
    owner: User;
    deployments: Deployment[];
    name: string;
    repository: string;
    prodBranch: string;
    description: string;
    template: string;
    framework: string;
    deployerLrns: string[];
    auctionId: string;
    webhooks: string[];
    members: ProjectMember[];
    environmentVariables: EnvironmentVariable[];
    createdAt: string;
    updatedAt: string;
    organization: Organization;
    icon: string;
    subDomain: string;
};
type GetProjectMembersResponse = {
    projectMembers: ProjectMember[];
};
type AddProjectMemberResponse = {
    addProjectMember: boolean;
};
type RemoveProjectMemberResponse = {
    removeProjectMember: boolean;
};
type UpdateProjectMemberResponse = {
    updateProjectMember: boolean;
};
type GetDeploymentsResponse = {
    deployments: Deployment[];
};
type GetEnvironmentVariablesResponse = {
    environmentVariables: EnvironmentVariable[];
};
type GetOrganizationsResponse = {
    organizations: Organization[];
};
type GetUserResponse = {
    user: User;
};
type GetProjectResponse = {
    project: Project | null;
};
type GetProjectsInOrganizationResponse = {
    projectsInOrganization: Project[];
};
type GetDomainsResponse = {
    domains: Domain[];
};
type SearchProjectsResponse = {
    searchProjects: Project[];
};
type AddEnvironmentVariablesResponse = {
    addEnvironmentVariables: boolean;
};
type AddEnvironmentVariableInput = {
    environments: string[];
    key: string;
    value: string;
};
type UpdateEnvironmentVariableInput = {
    key: string;
    value: string;
};
type UpdateProjectMemberInput = {
    permissions: Permission[];
};
type AddProjectMemberInput = {
    email: string;
    permissions: Permission[];
};
type UpdateEnvironmentVariableResponse = {
    updateEnvironmentVariable: boolean;
};
type RemoveEnvironmentVariableResponse = {
    removeEnvironmentVariable: boolean;
};
type UpdateDeploymentToProdResponse = {
    updateDeploymentToProd: boolean;
};
type AddProjectFromTemplateResponse = {
    addProjectFromTemplate: Project;
};
type AddProjectResponse = {
    addProject: Project;
};
type UpdateProjectResponse = {
    updateProject: boolean;
};
type UpdateDomainResponse = {
    updateDomain: boolean;
};
type DeleteProjectResponse = {
    deleteProject: boolean;
};
type DeleteDomainResponse = {
    deleteDomain: boolean;
};
type AddProjectFromTemplateInput = {
    templateOwner: string;
    templateRepo: string;
    owner: string;
    name: string;
    isPrivate: boolean;
};
type AddProjectInput = {
    name: string;
    repository: string;
    prodBranch: string;
    template?: string;
};
type UpdateProjectInput = {
    name?: string;
    description?: string;
    prodBranch?: string;
    webhooks?: string[];
    organizationId?: string;
};
type UpdateDomainInput = {
    name?: string;
    branch?: string;
    redirectToId?: string | null;
};
type RedeployToProdResponse = {
    redeployToProd: boolean;
};
type RollbackDeploymentResponse = {
    rollbackDeployment: boolean;
};
type DeleteDeploymentResponse = {
    deleteDeployment: boolean;
};
type AddDomainInput = {
    name: string;
};
type FilterDomainInput = {
    branch?: string;
    status?: DomainStatus;
};
type AddDomainResponse = {
    addDomain: true;
};
type AuthenticateGitHubResponse = {
    authenticateGitHub: {
        token: string;
    };
};
type UnauthenticateGitHubResponse = {
    unauthenticateGitHub: boolean;
};
type AuctionData = {
    maxPrice: string;
    numProviders: number;
};

interface GraphQLConfig {
    gqlEndpoint: string;
}
declare class GQLClient {
    private client;
    constructor(config: GraphQLConfig);
    getUser(): Promise<GetUserResponse>;
    getProject(projectId: string): Promise<GetProjectResponse>;
    getProjectsInOrganization(organizationSlug: string): Promise<GetProjectsInOrganizationResponse>;
    getOrganizations(): Promise<GetOrganizationsResponse>;
    getDeployments(projectId: string): Promise<GetDeploymentsResponse>;
    getEnvironmentVariables(projectId: string): Promise<GetEnvironmentVariablesResponse>;
    getProjectMembers(projectId: string): Promise<GetProjectMembersResponse>;
    addProjectMember(projectId: string, data: AddProjectMemberInput): Promise<AddProjectMemberResponse>;
    updateProjectMember(projectMemberId: string, data: UpdateProjectMemberInput): Promise<UpdateProjectMemberResponse>;
    removeProjectMember(projectMemberId: string): Promise<RemoveProjectMemberResponse>;
    searchProjects(searchText: string): Promise<SearchProjectsResponse>;
    addEnvironmentVariables(projectId: string, data: AddEnvironmentVariableInput[]): Promise<AddEnvironmentVariablesResponse>;
    updateEnvironmentVariable(environmentVariableId: string, data: UpdateEnvironmentVariableInput): Promise<UpdateEnvironmentVariableResponse>;
    removeEnvironmentVariable(environmentVariableId: string): Promise<RemoveEnvironmentVariableResponse>;
    updateDeploymentToProd(deploymentId: string): Promise<UpdateDeploymentToProdResponse>;
    addProjectFromTemplate(organizationSlug: string, data: AddProjectFromTemplateInput, lrn?: string, auctionData?: AuctionData): Promise<AddProjectFromTemplateResponse>;
    addProject(organizationSlug: string, data: AddProjectInput, lrn?: string, auctionData?: AuctionData): Promise<AddProjectResponse>;
    updateProject(projectId: string, data: UpdateProjectInput): Promise<UpdateProjectResponse>;
    updateDomain(domainId: string, data: UpdateDomainInput): Promise<UpdateDomainResponse>;
    redeployToProd(deploymentId: string): Promise<RedeployToProdResponse>;
    deleteProject(projectId: string): Promise<DeleteProjectResponse>;
    deleteDomain(domainId: string): Promise<DeleteDomainResponse>;
    rollbackDeployment(projectId: string, deploymentId: string): Promise<RollbackDeploymentResponse>;
    deleteDeployment(deploymentId: string): Promise<DeleteDeploymentResponse>;
    addDomain(projectId: string, data: AddDomainInput): Promise<AddDomainResponse>;
    getDomains(projectId: string, filter?: FilterDomainInput): Promise<GetDomainsResponse>;
    authenticateGitHub(code: string): Promise<AuthenticateGitHubResponse>;
    unauthenticateGithub(): Promise<UnauthenticateGitHubResponse>;
    getAuctionData(auctionId: string): Promise<Auction>;
}

export { type AddDomainInput, type AddDomainResponse, type AddEnvironmentVariableInput, type AddEnvironmentVariablesResponse, type AddProjectFromTemplateInput, type AddProjectFromTemplateResponse, type AddProjectInput, type AddProjectMemberInput, type AddProjectMemberResponse, type AddProjectResponse, type Auction, type AuctionData, AuctionStatus, type AuthenticateGitHubResponse, type Bid, type DeleteDeploymentResponse, type DeleteDomainResponse, type DeleteProjectResponse, type Deployment, DeploymentStatus, type Domain, DomainStatus, Environment, type EnvironmentVariable, type FilterDomainInput, GQLClient, type GetDeploymentsResponse, type GetDomainsResponse, type GetEnvironmentVariablesResponse, type GetOrganizationsResponse, type GetProjectMembersResponse, type GetProjectResponse, type GetProjectsInOrganizationResponse, type GetUserResponse, type GraphQLConfig, type Organization, type OrganizationMember, type OrganizationProject, Permission, type Project, type ProjectMember, type RedeployToProdResponse, type RemoveEnvironmentVariableResponse, type RemoveProjectMemberResponse, Role, type RollbackDeploymentResponse, type SearchProjectsResponse, type UnauthenticateGitHubResponse, type UpdateDeploymentToProdResponse, type UpdateDomainInput, type UpdateDomainResponse, type UpdateEnvironmentVariableInput, type UpdateEnvironmentVariableResponse, type UpdateProjectInput, type UpdateProjectMemberInput, type UpdateProjectMemberResponse, type UpdateProjectResponse, type User };
