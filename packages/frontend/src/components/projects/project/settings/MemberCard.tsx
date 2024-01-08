import React from 'react';

import { Select, Typography, Option } from '@material-tailwind/react';

import { Member } from '../../../../types/project';

const PERMISSION_OPTIONS = ['View only', 'View and edit'];

interface MemberCardProps {
  member: Member;
  isFirstCard: boolean;
}

const MemberCard = ({ member, isFirstCard }: MemberCardProps) => {
  return (
    <div
      className={`flex p-1 ${!isFirstCard && 'mt-1 border-t border-gray-300'}`}
    >
      <div>^</div>
      <div className="grow">
        <Typography variant="small">{member.name}</Typography>
        <Typography variant="small">{member.email}</Typography>
      </div>
      <div>
        <Select>
          {PERMISSION_OPTIONS.map((permission, key) => (
            <Option key={key} value={permission}>
              ^ {permission}
            </Option>
          ))}
          <Option>^ Remove member</Option>
        </Select>
      </div>
    </div>
  );
};

export default MemberCard;
