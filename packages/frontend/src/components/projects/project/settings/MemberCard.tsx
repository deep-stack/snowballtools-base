import React, { useCallback, useState } from 'react';
import { Permission, User } from 'gql-client';

import {
  Select,
  Option,
  Chip,
  IconButton,
  Tooltip,
} from '@material-tailwind/react';

import { formatAddress } from 'utils/format';
import { RemoveMemberDialog } from 'components/projects/Dialog/RemoveMemberDialog';

const PERMISSION_OPTIONS = [
  {
    label: 'View only',
    value: 'View',
  },
  {
    label: 'View and edit',
    value: 'View+Edit',
  },
];

const DROPDOWN_OPTIONS = [
  ...PERMISSION_OPTIONS,
  { label: 'Remove member', value: 'remove' },
];

interface MemberCardProps {
  member: User;
  isFirstCard: boolean;
  isOwner: boolean;
  isPending: boolean;
  permissions: string[];
  onRemoveProjectMember?: () => Promise<void>;
  onUpdateProjectMember?: (data: {
    permissions: Permission[];
  }) => Promise<void>;
}

const MemberCard = ({
  member,
  isFirstCard,
  isOwner,
  isPending,
  permissions,
  onRemoveProjectMember,
  onUpdateProjectMember,
}: MemberCardProps) => {
  const [ethAddress, emailDomain] = member.email.split('@');
  const [selectedPermission, setSelectedPermission] = useState(
    permissions.join('+'),
  );
  const [removeMemberDialogOpen, setRemoveMemberDialogOpen] = useState(false);

  const handlePermissionChange = useCallback(
    async (value: string) => {
      setSelectedPermission(value);

      if (value === 'remove') {
        setRemoveMemberDialogOpen((prevVal) => !prevVal);
        // To display updated label in next render
        setTimeout(() => {
          setSelectedPermission(selectedPermission);
        });
      } else {
        if (onUpdateProjectMember) {
          const permissions = value.split('+') as Permission[];
          await onUpdateProjectMember({ permissions });
        }
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
        {member.name && (
          <Tooltip content={member.name}>
            {formatAddress(member.name ?? '')}
          </Tooltip>
        )}
        <Tooltip content={member.email}>
          <p>
            {formatAddress(ethAddress)}@{emailDomain}
          </p>
        </Tooltip>
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
            placeholder={''}
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
                  setRemoveMemberDialogOpen((prevVal) => !prevVal);
                }}
                placeholder={''}
              >
                D
              </IconButton>
            </div>
          </div>
        )}
      </div>
      <RemoveMemberDialog
        handleCancel={() => setRemoveMemberDialogOpen((preVal) => !preVal)}
        open={removeMemberDialogOpen}
        handleConfirm={() => {
          setRemoveMemberDialogOpen((preVal) => !preVal);
          if (onRemoveProjectMember) {
            onRemoveProjectMember();
          }
        }}
        memberName={member.name ?? ''}
        ethAddress={ethAddress}
        emailDomain={emailDomain}
      />
    </div>
  );
};

export default MemberCard;
