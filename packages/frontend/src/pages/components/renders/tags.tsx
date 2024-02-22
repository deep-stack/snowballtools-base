import React from 'react';
import { Tags } from 'components/shared/Tags';
import { PlusIcon } from 'components/shared/CustomIcon';

export const renderDefaultTags = () =>
  (['default'] as const).map((style) => (
    <div key={style} className="flex gap-4 items-center">
      {(
        ['attention', 'negative', 'positive', 'emphasized', 'neutral'] as const
      ).map((type) => (
        <div key={type} className="flex flex-col gap-4">
          <Tags
            leftIcon={<PlusIcon />}
            rightIcon={<PlusIcon />}
            style={style}
            type={type}
            size="sm"
          >
            Label
          </Tags>
          <Tags
            leftIcon={<PlusIcon />}
            rightIcon={<PlusIcon />}
            size="xs"
            style={style}
            type={type}
          >
            Label
          </Tags>
        </div>
      ))}
    </div>
  ));

export const renderMinimalTags = () =>
  (['minimal'] as const).map((style) => (
    <div key={style} className="flex gap-4 items-center">
      {(
        ['attention', 'negative', 'positive', 'emphasized', 'neutral'] as const
      ).map((type) => (
        <div key={type} className="flex flex-col gap-4">
          <Tags
            leftIcon={<PlusIcon />}
            rightIcon={<PlusIcon />}
            style={style}
            type={type}
            size="sm"
          >
            Label
          </Tags>
          <Tags
            leftIcon={<PlusIcon />}
            rightIcon={<PlusIcon />}
            size="xs"
            style={style}
            type={type}
          >
            Label
          </Tags>
        </div>
      ))}
    </div>
  ));
