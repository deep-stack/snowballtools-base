import React, { useCallback, ComponentPropsWithoutRef } from 'react';
import { stepTheme, StepTheme } from './Step.theme';
import { CheckRoundFilledIcon } from 'components/shared/CustomIcon';

export interface StepProps extends ComponentPropsWithoutRef<'li'>, StepTheme {
  /**
   * The label for the step
   */
  label: string;
  /**
   * The index of the step
   */
  index: number;
  /**
   * The total number of steps
   */
  currentIndex: number;
}

export const Step = ({
  label,
  index,
  currentIndex,
  orientation,
  ...props
}: StepProps) => {
  const theme = stepTheme();

  const active = currentIndex === index;
  const completed = currentIndex > index;

  const renderConnector = useCallback(
    (index: number) => {
      if (index === 1) {
        return null;
      }

      return <div aria-hidden className={theme.connector({ orientation })} />;
    },
    [theme],
  );

  return (
    <>
      {renderConnector(index)}
      <li className={theme.wrapper()} {...props}>
        {
          <div className={theme.step({ active, completed })}>
            {completed ? (
              <CheckRoundFilledIcon className="w-full h-full" />
            ) : (
              index
            )}
          </div>
        }
        <p className={theme.label()}>{label}</p>
      </li>
    </>
  );
};
