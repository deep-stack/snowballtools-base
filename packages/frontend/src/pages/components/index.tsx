import React, { useState } from 'react';
import { Calendar } from 'components/shared/Calendar';
import { Value } from 'react-calendar/dist/cjs/shared/types';
import {
  renderCheckbox,
  renderCheckboxWithDescription,
} from './renders/checkbox';
import { avatars, avatarsFallback } from './renders/avatar';
import { renderBadges } from './renders/badge';
import {
  renderButtonIcons,
  renderButtons,
  renderDisabledButtons,
  renderLinks,
} from './renders/button';
import {
  renderTabWithBadges,
  renderTabs,
  renderVerticalTabs,
} from './renders/tabs';
import { RADIO_OPTIONS } from './renders/radio';
import { Radio } from 'components/shared/Radio';
import {
  renderInlineNotificationWithDescriptions,
  renderInlineNotifications,
} from './renders/inlineNotifications';
import { renderInputs } from './renders/input';
import { renderTooltips } from './renders/tooltip';

const Page = () => {
  const [singleDate, setSingleDate] = useState<Value>();
  const [dateRange, setDateRange] = useState<Value>();
  const [selectedRadio, setSelectedRadio] = useState<string>('');

  return (
    <div className="relative h-full min-h-full">
      <div className="flex flex-col items-center justify-center container mx-auto px-20 py-20">
        <h1 className="text-4xl font-bold">Manual Storybook</h1>
        <p className="mt-4 text-lg text-center text-gray-500">
          Get started by editing{' '}
          <code className="p-2 font-mono text-sm bg-gray-100 rounded-md">
            packages/frontend/src/pages/components/index.tsx
          </code>
        </p>

        <div className="w-full h border border-gray-200 px-20 my-10" />

        <div className="flex flex-col gap-10 items-center justify-between">
          <h1 className="text-2xl font-bold">Tooltip</h1>
          <div className="flex w-full flex-wrap max-w-[680px] justify-center gap-10">
            {renderTooltips()}
          </div>

          <div className="w-full h border border-gray-200 px-20 my-10" />

          {/* Input */}
          <h1 className="text-2xl font-bold">Input</h1>
          <div className="flex w-full flex-col gap-10">{renderInputs()}</div>

          <div className="w-full h border border-gray-200 px-20 my-10" />

          {/* Button */}
          <h1 className="text-2xl font-bold">Button</h1>
          <div className="flex flex-col gap-10">
            {renderButtons()}
            {renderButtonIcons()}
          </div>

          {/* Link */}
          <div className="flex flex-col gap-10 items-center justify-between">
            <h1 className="text-2xl font-bold">Link</h1>
            <div className="flex gap-4 items-center justify-center">
              {renderLinks()}
            </div>
          </div>

          {/* Disabled button, icon only, and link */}
          <div className="flex flex-col gap-10 items-center justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold text-center">Disabled</h1>
              <p className="text-lg text-center text-gray-500">
                Button – icon only – link
              </p>
            </div>
            <div className="flex gap-10 items-center justify-center">
              {renderDisabledButtons()}
            </div>
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

          <div className="w-full h border border-gray-200 px-20 my-10" />

          {/* Radio */}
          <div className="flex flex-col gap-10 items-center justify-between">
            <h1 className="text-2xl font-bold">Radio</h1>
            <div className="flex gap-20 items-start">
              <Radio
                options={RADIO_OPTIONS}
                orientation="vertical"
                value={selectedRadio}
                onValueChange={setSelectedRadio}
              />
              <Radio
                options={RADIO_OPTIONS}
                orientation="horizontal"
                value={selectedRadio}
                onValueChange={setSelectedRadio}
              />
            </div>
          </div>

          <div className="w-full h border border-gray-200 px-20 my-10" />

          {/* Inline notification */}
          <div className="flex flex-col gap-10 items-center justify-between">
            <h1 className="text-2xl font-bold">Inline Notification</h1>
            <div className="flex gap-1 flex-wrap">
              {renderInlineNotifications()}
            </div>
            <div className="flex gap-1 flex-wrap">
              {renderInlineNotificationWithDescriptions()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
