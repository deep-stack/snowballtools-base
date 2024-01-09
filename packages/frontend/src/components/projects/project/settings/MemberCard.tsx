import React, { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

import {
  Select,
  Typography,
  Option,
  Chip,
  IconButton,
} from '@material-tailwind/react';

import { Member } from '../../../../types/project';
import ConfirmDialog from '../../../shared/ConfirmDialog';

const PERMISSION_OPTIONS = [
  {
    label: 'View only',
    value: 'view',
  },
  {
    label: 'View and edit',
    value: 'view+edit',
  },
];

const DROPDOWN_OPTIONS = [
  ...PERMISSION_OPTIONS,
  { label: 'Remove member', value: 'remove' },
];

interface MemberCardProps {
  member: Member;
  isFirstCard: boolean;
  isOwner: boolean;
  isPending: boolean;
  permissions: string[];
  handleDeletePendingMember: (id: number) => void;
}

const MemberCard = ({
  member,
  isFirstCard,
  isOwner,
  isPending,
  permissions,
  handleDeletePendingMember,
}: MemberCardProps) => {
  const [selectedPermission, setSelectedPermission] = useState(
    permissions.join('+'),
  );
  const [removeMemberDialogOpen, setRemoveMemberDialogOpen] = useState(false);

  const handlePermissionChange = useCallback(
    (value: string) => {
      setSelectedPermission(value);

      if (value === 'remove') {
        setRemoveMemberDialogOpen((prevVal) => !prevVal);
        // To display updated label in next render
        setTimeout(() => {
          setSelectedPermission(selectedPermission);
        });
      }
    },
    [removeMemberDialogOpen, selectedPermission],
  );

  return (
    <div
      className={`flex p-1 ${!isFirstCard && 'mt-1 border-t border-gray-300'}`}
    >
      <div>^</div>
      <div className="basis-1/2">
        <Typography variant="small">{member.name}</Typography>
        <Typography variant="small">{member.email}</Typography>
      </div>
      <div className="basis-1/2">
        {!isPending ? (
          <Select
            size="lg"
            label={isOwner ? 'Owner' : ''}
            disabled={isOwner}
            value={selectedPermission}
            onChange={(value) => handlePermissionChange(value!)}
            selected={(_, index) => (
              <span>{DROPDOWN_OPTIONS[index!]?.label}</span>
            )}
          >
            {DROPDOWN_OPTIONS.map((permission, key) => (
              <Option key={key} value={permission.value}>
                ^ {permission.label}
                {permission.value === selectedPermission && (
                  <p className="float-right">^</p>
                )}
              </Option>
            ))}
          </Select>
        ) : (
          <div className="flex justify-end gap-2">
            <div>
              <Chip
                value="Pending"
                variant="outlined"
                color="orange"
                size="sm"
                icon={'^'}
              />
            </div>
            <div>
              <IconButton
                size="sm"
                className="rounded-full"
                onClick={() => {
                  handleDeletePendingMember(member.id);
                }}
              >
                D
              </IconButton>
            </div>
          </div>
        )}
      </div>
      <ConfirmDialog
        dialogTitle="Remove member?"
        handleOpen={() => setRemoveMemberDialogOpen((preVal) => !preVal)}
        open={removeMemberDialogOpen}
        confirmButtonTitle="Yes, Remove member"
        handleConfirm={() => {
          setRemoveMemberDialogOpen((preVal) => !preVal);
          toast.success('Member removed from project');
        }}
        color="red"
      >
        <Typography variant="small">
          Once removed, {member.name} ({member.email}) will not be able to
          access this project.
        </Typography>
      </ConfirmDialog>
    </div>
  );
};

export default MemberCard;
