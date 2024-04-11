import React, { useMemo } from 'react';
import { SegmentedControls } from 'components/shared/SegmentedControls';
import { useState } from 'react';
import {
  GithubIcon,
  LockIcon,
  TemplateIcon,
  TemplateIconType,
} from 'components/shared/CustomIcon';
import { relativeTimeISO } from 'utils/time';
import { useMediaQuery } from 'usehooks-ts';

export const MockConnectGitCard = () => {
  const [segmentedControlsValue, setSegmentedControlsValue] =
    useState<string>('import');

  const isDesktopView = useMediaQuery('(min-width: 960px)'); // lg:
  const segmentedControlsProps = isDesktopView ? {} : { size: 'sm' as const };

  const fiveMinutesAgo = new Date(Date.now() - 1000 * 300).toISOString();

  const SEGMENTED_CONTROLS_OPTIONS = [
    {
      label: 'Import a repository',
      value: 'import',
    },
    {
      label: 'Start with a template',
      value: 'template',
    },
  ];

  const IMPORT_CONTENT = [
    {
      full_name: 'snowball/igloo',
      updated_at: fiveMinutesAgo,
    },
    {
      full_name: 'snowball/android-sdk',
      updated_at: fiveMinutesAgo,
      visibility: 'private',
    },
    {
      full_name: 'snowball/landing-page',
      updated_at: fiveMinutesAgo,
    },
  ];

  const TEMPLATE_CONTENT = [
    {
      name: 'Web app',
      icon: 'web',
    },
    {
      name: 'Progressive Web App (PWA)',
      icon: 'pwa',
    },
    {
      name: 'React Native',
      icon: 'react-native',
    },
    {
      name: 'Kotlin',
      icon: 'kotlin',
    },
    {
      name: 'Swift',
      icon: 'swift',
    },
  ];

  const renderContent = useMemo(() => {
    if (segmentedControlsValue === 'import') {
      return (
        <div className="flex flex-col gap-2 relative z-0">
          {IMPORT_CONTENT.map((repo, index) => (
            <React.Fragment key={index}>
              <MockProjectCard {...repo} />
              {index !== IMPORT_CONTENT.length - 1 && (
                <div className="border-b border-base-border" />
              )}
            </React.Fragment>
          ))}
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 relative z-0">
        {TEMPLATE_CONTENT.map((template, index) => (
          <MockTemplateCard key={index} {...template} />
        ))}
      </div>
    );
  }, [segmentedControlsValue]);

  return (
    <div className="relative bg-base-bg shadow-card rounded-2xl px-2 py-2 w-full max-w-[560px] flex flex-col gap-2">
      {/* Content */}
      <SegmentedControls
        value={segmentedControlsValue}
        onChange={setSegmentedControlsValue}
        options={SEGMENTED_CONTROLS_OPTIONS}
        type="full-width"
        {...segmentedControlsProps}
      />
      {renderContent}

      {/* Shade */}
      <div className="pointer-events-none z-99 absolute inset-0 rounded-2xl bg-gradient-to-t from-white to-transparent" />
    </div>
  );
};

const MockProjectCard = ({
  full_name,
  updated_at,
  visibility,
}: {
  full_name: string;
  updated_at?: string;
  visibility?: string;
}) => {
  return (
    <div className="group flex items-start sm:items-center gap-3 pl-3 py-3 cursor-pointer rounded-xl hover:bg-base-bg-emphasized relative">
      {/* Icon container */}
      <div className="w-10 h-10 bg-base-bg rounded-md justify-center items-center flex">
        <GithubIcon />
      </div>
      {/* Content */}
      <div className="flex flex-1 gap-3 flex-wrap">
        <div className="flex flex-col items-start gap-1">
          <p className="text-elements-high-em text-sm font-medium tracking-[-0.006em]">
            {full_name}
          </p>
          <p className="text-elements-low-em text-xs">
            {updated_at && relativeTimeISO(updated_at)}
          </p>
        </div>
        {visibility === 'private' && (
          <div className="bg-orange-50 border border-orange-200 px-2 py-1 flex items-center gap-1 rounded-lg text-xs text-orange-600 h-fit">
            <LockIcon />
            Private
          </div>
        )}
      </div>
    </div>
  );
};

const MockTemplateCard = ({ icon, name }: { icon: string; name: string }) => {
  return (
    <div className="flex items-center gap-3 px-3 py-3 hover:bg-base-bg-emphasized rounded-2xl group relative cursor-default">
      {/* Icon */}
      <div className="px-1 py-1 rounded-xl bg-base-bg border border-border-interactive/10 shadow-card-sm">
        <TemplateIcon type={icon as TemplateIconType} />
      </div>
      {/* Name */}
      <p className="flex-1 text-left text-sm tracking-tighter text-elements-high-em">
        {name}
      </p>
    </div>
  );
};
