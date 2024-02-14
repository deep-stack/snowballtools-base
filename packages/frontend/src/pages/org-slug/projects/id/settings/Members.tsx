import React, { useCallback, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Permission, AddProjectMemberInput, ProjectMember } from 'gql-client';

import { Chip, Button, Typography } from '@material-tailwind/react';

import MemberCard from '../../../../../components/projects/project/settings/MemberCard';
import AddMemberDialog from '../../../../../components/projects/project/settings/AddMemberDialog';
import { useGQLClient } from '../../../../../context/GQLClientContext';
import { OutletContextType } from '../../../../../types';

const FIRST_MEMBER_CARD = 0;

const MembersTabPanel = () => {
  const client = useGQLClient();
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
        toast.success('Invitation sent');
      } else {
        toast.error('Invitation not sent');
      }
    },
    [project],
  );

  const removeMemberHandler = async (projectMemberId: string) => {
    const { removeProjectMember: isMemberRemoved } =
      await client.removeProjectMember(projectMemberId);

    if (isMemberRemoved) {
      await fetchProjectMembers();
      toast.success('Member removed from project');
    } else {
      toast.error('Not able to remove member');
    }
  };

  const updateProjectMemberHandler = useCallback(
    async (projectMemberId: string, data: { permissions: Permission[] }) => {
      const { updateProjectMember: isProjectMemberUpdated } =
        await client.updateProjectMember(projectMemberId, data);

      if (isProjectMemberUpdated) {
        await fetchProjectMembers();
        toast.success('Project member permission updated');
      } else {
        toast.error('Project member permission not updated');
      }
    },
    [],
  );

  useEffect(() => {
    fetchProjectMembers();
  }, [project.id, fetchProjectMembers]);

  return (
    <div className="p-2 mb-20">
      <div className="flex justify-between mb-2">
        <div className="flex">
          <Typography variant="h6">Members</Typography>
          <div>
            <Chip
              className="normal-case ml-3 font-normal"
              size="sm"
              value={projectMembers.length + 1}
            />
          </div>
        </div>
        <div>
          <Button
            size="sm"
            onClick={() => setAddMemberDialogOpen((preVal) => !preVal)}
          >
            + Add member
          </Button>
        </div>
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
