import React, { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import { Chip, Button, Typography } from '@material-tailwind/react';

import MemberCard from './MemberCard';
import membersData from '../../../../assets/members.json';
import projectData from '../../../../assets/projects.json';

import { Member } from '../../../../types/project';
import AddMemberDialog from './AddMemberDialog';

const FIRST_MEMBER_CARD = 0;

const MembersTabPanel = () => {
  const { id } = useParams();
  const [addmemberDialogOpen, setAddMemberDialogOpen] = useState(false);

  const currProject = useMemo(() => {
    return projectData.find((data) => data.id === Number(id));
  }, [id]);

  const members = useMemo(() => {
    return membersData.filter(
      (member) =>
        currProject?.members.some(
          (projectMember) => projectMember.id === member.id,
        ),
    );
  }, [currProject]);

  const [updatedMembers, setUpdatedMembers] = useState([...members]);

  const getMemberPermissions = useCallback(
    (id: number) => {
      return (
        currProject?.members.find((projectMember) => projectMember.id === id)
          ?.permissions || []
      );
    },
    [updatedMembers],
  );

  const addMemberHandler = useCallback((member: Member) => {
    setUpdatedMembers((val) => [...val, member]);
    toast.success('Invitation sent');
  }, []);

  return (
    <div className="p-2 mb-20">
      <div className="flex justify-between mb-2">
        <div className="flex">
          <Typography variant="h6">Members</Typography>
          <div>
            <Chip
              className="normal-case ml-3 font-normal"
              size="sm"
              value={updatedMembers.length}
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
      {(updatedMembers as Member[]).map((member, index) => {
        return (
          <MemberCard
            member={member}
            key={member.id}
            isFirstCard={index === FIRST_MEMBER_CARD}
            isOwner={member.id === currProject?.ownerId}
            isPending={member.name === ''}
            permissions={getMemberPermissions(member.id)}
            handleDeletePendingMember={(id: number) => {
              setUpdatedMembers(
                updatedMembers.filter((member) => member.id !== id),
              );
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
