import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { Chip, Button, Typography } from '@material-tailwind/react';

import MemberCard from './MemberCard';
import membersData from '../../../../assets/members.json';
import projectData from '../../../../assets/projects.json';

import { Member } from '../../../../types/project';

const FIRST_MEMBER_CARD = 0;

const MembersTabPanel = () => {
  const { id } = useParams();

  const currProject = useMemo(() => {
    return projectData.find((data) => data.id === Number(id));
  }, [id]);

  const members = useMemo(() => {
    return (
      currProject?.members.map((memberId) => {
        return membersData.find((member) => member.id === memberId);
      }) || []
    );
  }, [currProject]);

  return (
    <div className="p-2">
      <div className="flex justify-between mb-2">
        <div className="flex">
          <Typography variant="h6">Members</Typography>
          <div>
            <Chip
              className="normal-case ml-3 font-normal"
              size="sm"
              value={members.length}
            />
          </div>
        </div>
        <div>
          <Button size="sm">+ Add member</Button>
        </div>
      </div>
      {(members as Member[]).map((member, index) => {
        return (
          <MemberCard
            member={member}
            key={member.id}
            isFirstCard={index === FIRST_MEMBER_CARD}
          />
        );
      })}
    </div>
  );
};

export default MembersTabPanel;
