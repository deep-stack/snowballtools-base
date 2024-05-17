import { useCallback, useState } from 'react';

import { RemoveMemberDialog } from 'components/projects/Dialog/RemoveMemberDialog';
import { Select, SelectOption } from 'components/shared/Select';
import { LoaderIcon } from 'components/shared/CustomIcon';
import { Tooltip } from 'components/shared/Tooltip';
import { Button } from 'components/shared/Button';
import { Permission, User } from 'gql-client';
import { formatAddress } from 'utils/format';
import { Tag } from 'components/shared/Tag';
import { Input } from 'components/shared/Input';

const PERMISSION_OPTIONS: SelectOption[] = [
  {
    label: 'View only',
    value: 'View',
  },
  {
    label: 'View and edit',
    value: 'View+Edit',
  },
];

const DROPDOWN_OPTIONS: SelectOption[] = [
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
  const [selectedPermission, setSelectedPermission] = useState<SelectOption>(
    PERMISSION_OPTIONS.map((value) => {
      permissions.join('+') === value.value;
    }).pop() ?? {
      label: 'View only',
      value: 'View',
    },
  );
  const [removeMemberDialogOpen, setRemoveMemberDialogOpen] = useState(false);

  const handlePermissionChange = useCallback(
    async (value: SelectOption) => {
      setSelectedPermission(value);

      if (value.value === 'remove') {
        setRemoveMemberDialogOpen((prevVal) => !prevVal);
        // To display updated label in next render
        setTimeout(() => {
          setSelectedPermission(selectedPermission);
        });
      } else {
        if (onUpdateProjectMember) {
          const permissions = value.value.split('+') as Permission[];
          await onUpdateProjectMember({ permissions });
        }
      }
    },
    [removeMemberDialogOpen, selectedPermission],
  );

  return (
    <div
      className={`flex py-1 items-center ${!isFirstCard && 'mt-1 border-t border-gray-300'}`}
    >
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
          isOwner ? (
            <Input size="md" value="Owner" disabled />
          ) : (
            <Select
              options={DROPDOWN_OPTIONS}
              size="md"
              placeholder="Select permission"
              value={selectedPermission}
              onChange={(value) =>
                handlePermissionChange(value as SelectOption)
              }
            />
          )
        ) : (
          <div className="flex justify-end gap-2">
            <div>
              <Tag type="positive" size="sm" leftIcon={<LoaderIcon />}>
                Pending
              </Tag>
            </div>
            <div>
              <Button
                size="md"
                iconOnly
                onClick={() => {
                  setRemoveMemberDialogOpen((prevVal) => !prevVal);
                }}
              >
                D
              </Button>
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
