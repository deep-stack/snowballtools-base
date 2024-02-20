import { Button, ButtonOrLinkProps } from 'components/shared/Button';
import { Calendar } from 'components/shared/Calendar';
import { PlusIcon } from 'components/shared/CustomIcon';
import React, { useState } from 'react';
import { Value } from 'react-calendar/dist/cjs/shared/types';

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

        {/* Insert Components here */}
        <div className="flex flex-col gap-10 items-center justify-between">
          <h1 className="text-2xl font-bold">Button</h1>
          <div className="flex flex-col gap-10">
            {['primary', 'secondary', 'tertiary', 'danger'].map(
              (variant, index) => (
                <div className="flex gap-5 flex-wrap" key={index}>
                  {['lg', 'md', 'sm', 'xs', 'disabled'].map((size) => (
                    <Button
                      leftIcon={<PlusIcon />}
                      rightIcon={<PlusIcon />}
                      variant={variant as ButtonOrLinkProps['variant']}
                      size={
                        size !== 'disabled'
                          ? (size as ButtonOrLinkProps['size'])
                          : 'md'
                      }
                      key={`${variant}-${size}`}
                      disabled={size === 'disabled'}
                    >
                      Button
                    </Button>
                  ))}
                </div>
              ),
            )}
            {[
              'primary',
              'secondary',
              'tertiary',
              'ghost',
              'danger',
              'danger-ghost',
            ].map((variant, index) => (
              <div className="flex gap-5 flex-wrap" key={index}>
                {['lg', 'md', 'sm', 'xs', 'disabled'].map((size) => (
                  <Button
                    iconOnly
                    variant={variant as ButtonOrLinkProps['variant']}
                    size={
                      size !== 'disabled'
                        ? (size as ButtonOrLinkProps['size'])
                        : 'md'
                    }
                    key={`${variant}-${size}`}
                    disabled={size === 'disabled'}
                  >
                    <PlusIcon />
                  </Button>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="w-full h border border-gray-200 px-20 my-10" />
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
              <Calendar selectRange value={dateRange} onChange={setDateRange} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
