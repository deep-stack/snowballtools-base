import { useState } from 'react';

import { Button } from 'components/shared/Button';
import { Modal } from 'components/shared/Modal';
import { TransferProjectDialog } from 'components/projects/Dialog/TransferProjectDialog';
import { DeleteWebhookDialog } from 'components/projects/Dialog/DeleteWebhookDialog';
import { DisconnectRepositoryDialog } from 'components/projects/Dialog/DisconnectRepositoryDialog';
import { RemoveMemberDialog } from 'components/projects/Dialog/RemoveMemberDialog';
import { DeleteVariableDialog } from 'components/projects/Dialog/DeleteVariableDialog';
import { DeleteDomainDialog } from 'components/projects/Dialog/DeleteDomainDialog';
import { CancelDeploymentDialog } from 'components/projects/Dialog/CancelDeploymentDialog';
import {
  Deployment,
  DeploymentStatus,
  Domain,
  DomainStatus,
  Environment,
} from 'gql-client';
import { ChangeStateToProductionDialog } from 'components/projects/Dialog/ChangeStateToProductionDialog';

const deployment: Deployment = {
  id: '1',
  domain: {
    id: 'domain1',
    branch: 'main',
    name: 'example.com',
    status: DomainStatus.Live,
    redirectTo: null,
    createdAt: '1677609600', // 2023-02-25T12:00:00Z
    updatedAt: '1677613200', // 2023-02-25T13:00:00Z
  },
  branch: 'main',
  commitHash: 'a1b2c3d',
  commitMessage:
    'lkajsdlakjsdlaijwlkjadlksjdlaisjdlakjswdalijsdlaksdj lakjsdlasjdlaijwdel akjsdlaj sldkjaliwjdeal ksjdla ijsdlaksjd',
  url: 'https://deploy1.example.com',
  environment: Environment.Production,
  isCurrent: true,
  deployer: {
    deployerApiUrl: 'https://webapp-deployer-api.example.com',
    deployerId: 'bafyreicrtgmkir4evvvysxdqxddf2ftdq2wrzuodgvwnxr4rmubi4obdfu',
    deployerLrn: 'lrn://example/deployers/webapp-deployer-api.example.com',
    minimumPayment: '1000alnt',
    baseDomain: 'pwa.wireitin.com'
  },
  status: DeploymentStatus.Ready,
  createdBy: {
    id: 'user1',
    name: 'Alice',
    email: 'alice@example.com',
    isVerified: true,
    createdAt: '1672656000', // 2023-01-01T10:00:00Z
    updatedAt: '1672659600', // 2023-01-01T11:00:00Z
    gitHubToken: null,
  },
  createdAt: '1677676800', // 2023-03-01T12:00:00Z
  updatedAt: '1677680400', // 2023-03-01T13:00:00Z
  applicationDeploymentRequestId:
    'bafyreiaycvq6imoppnpwdve4smj6t6ql5svt5zl3x6rimu4qwyzgjorize',
};

const domains: Domain[] = [
  {
    id: '1',
    branch: 'main',
    name: 'saugat.com',
    status: DomainStatus.Live,
    redirectTo: null,
    createdAt: '1677676800', // 2023-03-01T12:00:00Z
    updatedAt: '1677680400', // 2023-03-01T13:00:00Z
  },
  {
    id: '2',
    branch: 'main',
    name: 'www.saugat.com',
    status: DomainStatus.Live,
    redirectTo: null,
    createdAt: '1677676800', // 2023-03-01T12:00:00Z
    updatedAt: '1677680400', // 2023-03-01T13:00:00Z
  },
];

const ModalsPage: React.FC = () => {
  const [openTransferDialog, setOpenTransferDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [disconnectRepoDialogOpen, setDisconnectRepoDialogOpen] =
    useState(false);
  const [removeMemberDialogOpen, setRemoveMemberDialogOpen] = useState(false);
  const [deleteVariableDialogOpen, setDeleteVariableDialogOpen] =
    useState(false);
  const [deleteDomainDialogOpen, setDeleteDomainDialogOpen] = useState(false);
  const [cancelDeploymentDialogOpen, setCancelDeploymentDialogOpen] =
    useState(false);
  const [changeProductionDialogOpen, setChangeProductionDialogOpen] =
    useState(false);
  const [redeployToProduction, setRedeployToProduction] = useState(false);
  const [rollbackDeployment, setRollbackDeployment] = useState(false);

  return (
    <div className="relative h-full min-h-full">
      <div className="flex flex-col items-center justify-center container mx-auto px-20 py-20">
        <h1 className="text-4xl font-bold">Manual Storybook</h1>
        <p className="mt-4 text-lg text-center text-gray-500">
          Get started by editing{' '}
          <code className="p-2 font-mono text-sm bg-gray-100 rounded-md">
            packages/frontend/src/pages/components/index.tsx
          </code>
        </p>

        <div className="w-full h border border-gray-200 px-20 my-10" />

        {/* Modal */}
        <div className="flex flex-col gap-10 items-center justify-between">
          <div className="flex flex-col gap-10 items-center justify-between">
            <h1 className="text-2xl font-bold">Modal</h1>
            <div className="flex gap-4 flex-wrap items-center justify-center">
              {/* Modal example */}
              <Modal>
                <Modal.Trigger asChild>
                  <Button>Open modal</Button>
                </Modal.Trigger>
                <Modal.Content>
                  <Modal.Header>Modal title</Modal.Header>
                  <Modal.Body>
                    <p>Modal content</p>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button>Close</Button>
                  </Modal.Footer>
                </Modal.Content>
              </Modal>
              {/* Transfer project */}
              <Button onClick={() => setOpenTransferDialog(true)}>
                Transfer project
              </Button>
              <TransferProjectDialog
                handleCancel={() => setOpenTransferDialog(!openTransferDialog)}
                open={openTransferDialog}
                handleConfirm={() => setOpenTransferDialog(!openTransferDialog)}
                projectName="nextjs-boilerplate"
                from="ayungavis"
                to="Airfoil"
              />
              {/* Delete webhook */}
              <Button onClick={() => setDeleteDialogOpen(true)}>
                Delete webhook
              </Button>
              <DeleteWebhookDialog
                handleCancel={() => setDeleteDialogOpen((preVal) => !preVal)}
                open={deleteDialogOpen}
                handleConfirm={() => setDeleteDialogOpen((preVal) => !preVal)}
                webhookUrl="examplehook.com"
              />
              {/* Disconnect repository */}
              <Button onClick={() => setDisconnectRepoDialogOpen(true)}>
                Disconnect repository
              </Button>
              <DisconnectRepositoryDialog
                handleCancel={() =>
                  setDisconnectRepoDialogOpen((preVal) => !preVal)
                }
                open={disconnectRepoDialogOpen}
                handleConfirm={() => {
                  setDisconnectRepoDialogOpen((preVal) => !preVal);
                }}
              />
              {/* Remove member */}
              <Button onClick={() => setRemoveMemberDialogOpen(true)}>
                Remove member
              </Button>
              <RemoveMemberDialog
                dialogTitle="Remove member?"
                handleCancel={() =>
                  setRemoveMemberDialogOpen((preVal) => !preVal)
                }
                open={removeMemberDialogOpen}
                confirmButtonTitle="Yes, Remove member"
                handleConfirm={() =>
                  setRemoveMemberDialogOpen((preVal) => !preVal)
                }
                memberName="John Doe"
                ethAddress="0x1234567890"
                emailDomain="example.com"
              />
              {/* Delete variable */}
              <Button onClick={() => setDeleteVariableDialogOpen(true)}>
                Delete variable
              </Button>
              <DeleteVariableDialog
                handleCancel={() =>
                  setDeleteVariableDialogOpen((preVal) => !preVal)
                }
                open={deleteVariableDialogOpen}
                handleConfirm={() =>
                  setDeleteVariableDialogOpen((preVal) => !preVal)
                }
                variableKey="AIUTH_TOKEN"
              />
              {/* Delete domain */}
              <Button onClick={() => setDeleteDomainDialogOpen(true)}>
                Delete domain
              </Button>
              <DeleteDomainDialog
                handleCancel={() =>
                  setDeleteDomainDialogOpen((preVal) => !preVal)
                }
                open={deleteDomainDialogOpen}
                handleConfirm={() =>
                  setDeleteDomainDialogOpen((preVal) => !preVal)
                }
                projectName="Airfoil"
                domainName="airfoil.com"
              />
              {/* Cancel deployment */}
              <Button onClick={() => setCancelDeploymentDialogOpen(true)}>
                Cancel deployment
              </Button>
              <CancelDeploymentDialog
                handleCancel={() =>
                  setCancelDeploymentDialogOpen(!cancelDeploymentDialogOpen)
                }
                open={cancelDeploymentDialogOpen}
                handleConfirm={() =>
                  setCancelDeploymentDialogOpen(!cancelDeploymentDialogOpen)
                }
              />
              {/* Change to production */}
              <Button onClick={() => setChangeProductionDialogOpen(true)}>
                Change to production
              </Button>
              <ChangeStateToProductionDialog
                dialogTitle="Change to production?"
                confirmButtonTitle="Change"
                handleCancel={() => setChangeProductionDialogOpen(false)}
                open={changeProductionDialogOpen}
                handleConfirm={() => setChangeProductionDialogOpen(false)}
                deployment={deployment}
                domains={domains}
              />
              {/* Redeploy to production */}
              <Button onClick={() => setRedeployToProduction(true)}>
                Redeploy to production
              </Button>
              <ChangeStateToProductionDialog
                dialogTitle="Redeploy to production?"
                handleCancel={() =>
                  setRedeployToProduction((preVal) => !preVal)
                }
                open={redeployToProduction}
                confirmButtonTitle="Redeploy"
                handleConfirm={async () =>
                  setRedeployToProduction((preVal) => !preVal)
                }
                deployment={deployment}
                domains={deployment.domain ? [deployment.domain] : []}
              />
              {/* Rollback to this deployment */}
              <Button onClick={() => setRollbackDeployment(true)}>
                Rollback to this deployment
              </Button>
              <ChangeStateToProductionDialog
                dialogTitle="Rollback to this deployment?"
                handleCancel={() => setRollbackDeployment((preVal) => !preVal)}
                open={rollbackDeployment}
                confirmButtonTitle="Rollback"
                handleConfirm={async () =>
                  setRollbackDeployment((preVal) => !preVal)
                }
                deployment={deployment}
                newDeployment={deployment}
                domains={deployment.domain ? [deployment.domain] : []}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalsPage;
