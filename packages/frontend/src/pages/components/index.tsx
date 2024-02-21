import React, { useState } from 'react';
import { Avatar, AvatarVariants } from 'components/shared/Avatar';
import { Badge, BadgeProps } from 'components/shared/Badge';
import { Button, ButtonOrLinkProps } from 'components/shared/Button';
import { Calendar } from 'components/shared/Calendar';
import { Checkbox } from 'components/shared/Checkbox';
import { SearchIcon, CrossIcon, PlusIcon } from 'components/shared/CustomIcon';
import { Input } from 'components/shared/Input';
import { Value } from 'react-calendar/dist/cjs/shared/types';
import {
  renderCheckbox,
  renderCheckboxWithDescription,
} from './renders/checkbox';
import { avatars, avatarsFallback } from './renders/avatar';
import { renderBadges } from './renders/badge';
import { renderButtonIcons, renderButtons } from './renders/button';
import {
  renderTabWithBadges,
  renderTabs,
  renderVerticalTabs,
} from './renders/tabs';

const Page = () => {
  const [singleDate, setSingleDate] = useState<Value>();
  const [dateRange, setDateRange] = useState<Value>();

  return (
    <div className="relative h-full min-h-full">
      <div className="flex flex-col items-center justify-center max-w-7xl mx-auto px-20 py-20">
        <h1 className="text-4xl font-bold">Manual Storybook</h1>
        <p className="mt-4 text-lg text-center text-gray-500">
          Get started by editing{' '}
          <code className="p-2 font-mono text-sm bg-gray-100 rounded-md">
            packages/frontend/src/pages/components/index.tsx
          </code>
        </p>

        <div className="w-full h border border-gray-200 px-20 my-10" />

        {/* Button */}
        <div className="flex flex-col gap-10 items-center justify-between">
          <h1 className="text-2xl font-bold">Input</h1>
          <div className="flex w-full flex-col gap-10">
            <div className="flex w-full gap-10">
              <Input
                label="Label"
                description="Additional information or context"
                leftIcon={<SearchIcon />}
                rightIcon={<CrossIcon />}
                placeholder="Placeholder text"
              />
              <Input
                disabled
                label="Label"
                description="Additional information or context"
                placeholder="Placeholder text"
              />
              <Input
                state="error"
                label="Label"
                description="Additional information or context"
                placeholder="Placeholder text"
                helperText="The error goes here"
              />
            </div>
            <div className="flex w-full gap-10">
              <Input
                label="Label"
                leftIcon={<SearchIcon />}
                rightIcon={<CrossIcon />}
                description="Additional information or context"
                placeholder="Placeholder text"
                size="sm"
              />
              <Input
                disabled
                label="Label"
                description="Additional information or context"
                placeholder="Placeholder text"
                size="sm"
              />
              <Input
                state="error"
                label="Label"
                description="Additional information or context"
                placeholder="Placeholder text"
                size="sm"
                helperText="The error goes here"
              />
            </div>
          </div>

          <div className="w-full h border border-gray-200 px-20 my-10" />

          <h1 className="text-2xl font-bold">Button</h1>
          <div className="flex flex-col gap-10">
            {renderButtons()}
            {renderButtonIcons()}
          </div>

          <div className="w-full h border border-gray-200 px-20 my-10" />

          {/* Badge */}
          <div className="flex flex-col gap-10 items-center justify-between">
            <h1 className="text-2xl font-bold">Badge</h1>
            <div className="space-y-5">{renderBadges()}</div>
          </div>

          <div className="w-full h border border-gray-200 px-20 my-10" />

          {/* Checkbox */}
          <div className="flex flex-col gap-10 items-center justify-between">
            <h1 className="text-2xl font-bold">Checkbox</h1>
            <div className="flex gap-10 flex-wrap">{renderCheckbox()}</div>
            <div className="flex gap-10 flex-wrap">
              {renderCheckboxWithDescription()}
            </div>
          </div>

          <div className="w-full h border border-gray-200 px-20 my-10" />

          {/* Calendar */}
          <div className="flex flex-col gap-10 items-center justify-between">
            <h1 className="text-2xl font-bold">Calendar</h1>
            <div className="flex flex-col gap-10">
              <div className="space-y-5 flex flex-col items-center">
                <p>Selected date: {singleDate?.toString()}</p>
                <Calendar
                  value={singleDate}
                  onChange={setSingleDate}
                  onSelect={setSingleDate}
                />
              </div>
              <div className="space-y-5 flex flex-col items-center">
                <p>
                  Start date:{' '}
                  {dateRange instanceof Array ? dateRange[0]?.toString() : ''}{' '}
                  <br />
                  End date:{' '}
                  {dateRange instanceof Array ? dateRange[1]?.toString() : ''}
                </p>
                <Calendar
                  selectRange
                  value={dateRange}
                  onChange={setDateRange}
                />
              </div>
            </div>
          </div>

          <div className="w-full h border border-gray-200 px-20 my-10" />

          {/* Avatar */}
          <div className="flex flex-col gap-10 items-center justify-between">
            <h1 className="text-2xl font-bold">Avatar</h1>
            <div className="flex gap-10 flex-wrap max-w-[522px]">
              {avatars}
              {avatarsFallback}
            </div>
          </div>

          <div className="w-full h border border-gray-200 px-20 my-10" />

          {/* Tabs */}
          <div className="flex flex-col gap-10 items-center justify-between">
            <h1 className="text-2xl font-bold">Tabs</h1>
            <div className="flex flex-col gap-10 items-center justify-center">
              {renderTabs()}
              {renderTabWithBadges()}
            </div>
            <h1 className="text-2xl font-bold">Vertical Tabs</h1>
            {renderVerticalTabs()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
