import React, { useCallback, useMemo, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import { Chip, Button, Typography } from '@material-tailwind/react';

import MemberCard from './MemberCard';

import { Member } from '../../../../types/project';
import AddMemberDialog from './AddMemberDialog';

const FIRST_MEMBER_CARD = 0;

const MembersTabPanel = () => {
  const { id } = useParams();
  const [addmemberDialogOpen, setAddMemberDialogOpen] = useState(false);

  // @ts-expect-error create context type for projects
  const { projects } = useOutletContext();

  const currentProject = useMemo(() => {
    return projects.find((project: any) => project.id === id);
  }, [id]);

  const [updatedMembers, setUpdatedMembers] = useState([
    ...currentProject?.members,
  ]);

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
      {updatedMembers.map((member, index) => {
        return (
          <MemberCard
            member={member.member}
            key={member.id}
            isFirstCard={index === FIRST_MEMBER_CARD}
            isOwner={member.member.id === currentProject?.owner.id}
            isPending={member.name === ''}
            permissions={member.permissions}
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
