import React, { Fragment, ComponentPropsWithoutRef } from 'react';
import { stepsTheme, StepsTheme } from './Steps.theme';
import { Step, StepProps, StepTheme } from './Step';

interface StepsProps
  extends ComponentPropsWithoutRef<'ul'>,
    StepsTheme,
    Pick<StepTheme, 'orientation'> {
  /**
   * The index of the current step
   */
  currentIndex: number;
  /**
   * The steps to render
   */
  steps: Pick<StepProps, 'label'>[];
}

export const Steps = ({
  currentIndex,
  steps = [],
  className,
  orientation,
  ...props
}: StepsProps) => {
  const theme = stepsTheme();

  return (
    <ul className={theme.root({ class: className, orientation })} {...props}>
      {steps.map((step, i) => (
        <Fragment key={i}>
          <Step
            {...step}
            orientation={orientation}
            currentIndex={currentIndex}
            index={i}
          />
        </Fragment>
      ))}
    </ul>
  );
};
