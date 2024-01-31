import React, { useCallback, useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Permission, Project } from 'gql-client';

import { Chip, Button, Typography } from '@material-tailwind/react';

import MemberCard from './MemberCard';
import { ProjectMember } from '../../../../types/project';
import AddMemberDialog from './AddMemberDialog';
import { useGQLClient } from '../../../../context/GQLClientContext';

const FIRST_MEMBER_CARD = 0;

const MembersTabPanel = ({ project }: { project: Project }) => {
  const client = useGQLClient();

  const [addmemberDialogOpen, setAddMemberDialogOpen] = useState(false);

  const [projectMembers, setProjectMembers] = useState<ProjectMember[]>([]);

  const addMemberHandler = useCallback((projectMember: ProjectMember) => {
    setProjectMembers((val) => [...val, projectMember]);
    toast.success('Invitation sent');
  }, []);

  const fetchProjectMembers = useCallback(async () => {
    const { projectMembers } = await client.getProjectMembers(project.id);

    setProjectMembers(projectMembers);
  }, [project.id]);

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
            isPending={projectMember.member.name === ''}
            permissions={projectMember.permissions}
            handleDeletePendingMember={(id: string) => {
              setProjectMembers(
                projectMembers.filter(
                  (projectMember) => projectMember.member.id !== id,
                ),
              );
            }}
            onRemoveProjectMember={() => removeMemberHandler(projectMember.id)}
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
      <Toaster />
    </div>
  );
};

export default MembersTabPanel;
