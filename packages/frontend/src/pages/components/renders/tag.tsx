import { Tag } from 'components/shared/Tag';
import { PlusIcon } from 'components/shared/CustomIcon';

export const renderDefaultTag = () =>
  (['default'] as const).map((style) => (
    <div key={style} className="flex gap-4 items-center">
      {(
        ['attention', 'negative', 'positive', 'emphasized', 'neutral'] as const
      ).map((type) => (
        <div key={type} className="flex flex-col gap-4">
          <Tag
            leftIcon={<PlusIcon />}
            rightIcon={<PlusIcon />}
            style={style}
            type={type}
            size="sm"
          >
            Label
          </Tag>
          <Tag
            leftIcon={<PlusIcon />}
            rightIcon={<PlusIcon />}
            size="xs"
            style={style}
            type={type}
          >
            Label
          </Tag>
        </div>
      ))}
    </div>
  ));

export const renderMinimalTag = () =>
  (['minimal'] as const).map((style) => (
    <div key={style} className="flex gap-4 items-center">
      {(
        ['attention', 'negative', 'positive', 'emphasized', 'neutral'] as const
      ).map((type) => (
        <div key={type} className="flex flex-col gap-4">
          <Tag
            leftIcon={<PlusIcon />}
            rightIcon={<PlusIcon />}
            style={style}
            type={type}
            size="sm"
          >
            Label
          </Tag>
          <Tag
            leftIcon={<PlusIcon />}
            rightIcon={<PlusIcon />}
            size="xs"
            style={style}
            type={type}
          >
            Label
          </Tag>
        </div>
      ))}
    </div>
  ));
