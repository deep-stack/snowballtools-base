import React from 'react';
import { Button } from 'components/shared/Button';
import { Tooltip } from 'components/shared/Tooltip';
import { ContentProps } from 'components/shared/Tooltip/TooltipContent';

const alignments: ContentProps['align'][] = ['start', 'center', 'end'];
const sides: ContentProps['side'][] = ['left', 'top', 'bottom', 'right'];

export const renderTooltips = () => {
  const tooltips = sides.map((side) => {
    return alignments.map((align) => {
      return (
        <Tooltip
          key={`${side}-${align}`}
          content="tooltip content"
          contentProps={{ align, side }}
        >
          <Button
            variant="ghost"
            key={`${side}-${align}`}
            className="h-16 self-center"
          >
            Tooltip ({side} - {align})
          </Button>
        </Tooltip>
      );
    });
  });
  return tooltips;
};
