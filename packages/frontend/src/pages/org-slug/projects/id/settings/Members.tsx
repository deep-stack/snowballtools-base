import { useCallback, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Permission, AddProjectMemberInput, ProjectMember } from 'gql-client';

import MemberCard from '../../../../../components/projects/project/settings/MemberCard';
import AddMemberDialog from '../../../../../components/projects/project/settings/AddMemberDialog';
import { useGQLClient } from '../../../../../context/GQLClientContext';
import { OutletContextType } from '../../../../../types';
import { useToast } from '../../../../../components/shared/Toast';
import { Button } from 'components/shared/Button';
import { PlusIcon } from 'components/shared/CustomIcon';
import { Badge } from 'components/shared/Badge';
import { Heading } from 'components/shared/Heading';

const FIRST_MEMBER_CARD = 0;

const MembersTabPanel = () => {
  const client = useGQLClient();
  const { toast } = useToast();
  const { project } = useOutletContext<OutletContextType>();

  const [addmemberDialogOpen, setAddMemberDialogOpen] = useState(false);

  const [projectMembers, setProjectMembers] = useState<ProjectMember[]>([]);

  const fetchProjectMembers = useCallback(async () => {
    const { projectMembers } = await client.getProjectMembers(project.id);
    setProjectMembers(projectMembers);
  }, [project.id]);

  const addMemberHandler = useCallback(
    async (data: AddProjectMemberInput) => {
      const { addProjectMember: isProjectMemberAdded } =
        await client.addProjectMember(project.id, data);

      if (isProjectMemberAdded) {
        await fetchProjectMembers();
        toast({
          id: 'member_added',
          title: 'Member added to project',
          variant: 'success',
          onDismiss() {},
        });
      } else {
        toast({
          id: 'member_not_added',
          title: 'Invitation not sent',
          variant: 'error',
          onDismiss() {},
        });
      }
    },
    [project],
  );

  const removeMemberHandler = async (projectMemberId: string) => {
    const { removeProjectMember: isMemberRemoved } =
      await client.removeProjectMember(projectMemberId);

    if (isMemberRemoved) {
      await fetchProjectMembers();
      toast({
        id: 'member_removed',
        title: 'Member removed from project',
        variant: 'success',
        onDismiss() {},
      });
    } else {
      toast({
        id: 'member_not_removed',
        title: 'Not able to remove member',
        variant: 'error',
        onDismiss() {},
      });
    }
  };

  const updateProjectMemberHandler = useCallback(
    async (projectMemberId: string, data: { permissions: Permission[] }) => {
      const { updateProjectMember: isProjectMemberUpdated } =
        await client.updateProjectMember(projectMemberId, data);

      if (isProjectMemberUpdated) {
        await fetchProjectMembers();
        toast({
          id: 'member_permission_updated',
          title: 'Project member permission updated',
          variant: 'success',
          onDismiss() {},
        });
      } else {
        toast({
          id: 'member_permission_not_updated',
          title: 'Project member permission not updated',
          variant: 'error',
          onDismiss() {},
        });
      }
    },
    [],
  );

  useEffect(() => {
    fetchProjectMembers();
  }, [project.id, fetchProjectMembers]);

  return (
    <div className="space-y-3 px-2">
      <div className="flex justify-between">
        <div className="flex space-x-2">
          <Heading className="text-sky-950 text-lg font-medium leading-normal">
            Collaborators
          </Heading>
          <Badge size="sm" variant="inset">
            {projectMembers.length + 1}
          </Badge>
        </div>
        <Button
          size="md"
          onClick={() => setAddMemberDialogOpen((preVal) => !preVal)}
          leftIcon={<PlusIcon />}
          variant="secondary"
        >
          Add member
        </Button>
      </div>
      <MemberCard
        member={project.owner}
        isFirstCard={true}
        isOwner={true}
        isPending={false}
        permissions={[]}
      />
      {projectMembers.map((projectMember, index) => {
        return (
          <MemberCard
            member={projectMember.member}
            key={projectMember.id}
            isFirstCard={index === FIRST_MEMBER_CARD}
            isOwner={projectMember.member.id === project.owner.id}
            isPending={projectMember.isPending}
            permissions={projectMember.permissions}
            onRemoveProjectMember={async () =>
              await removeMemberHandler(projectMember.id)
            }
            onUpdateProjectMember={async (data) => {
              await updateProjectMemberHandler(projectMember.id, data);
            }}
          />
        );
      })}
      <AddMemberDialog
        handleOpen={() => {
          setAddMemberDialogOpen((preVal) => !preVal);
        }}
        open={addmemberDialogOpen}
        handleAddMember={addMemberHandler}
      />
    </div>
  );
};

export default MembersTabPanel;
