import React from 'react';
import * as CSS from 'csstype';

//
// Nav
//
export interface IStepDescription {
  stepContent: () => JSX.Element;
  stepStateColor?: string;
  stepStatusCircleSize?: number;
  onClickHandler?: () => void | undefined;
}

export interface IStepperNavProps {
  steps: IStepDescription[];
}

export const StepperNav = (props: IStepperNavProps): JSX.Element => {
  return (
    <nav>
      {props.steps.map(
        (
          { stepContent, stepStateColor, onClickHandler, stepStatusCircleSize },
          index,
        ) => (
          <div key={index}>
            <Step
              stepContent={stepContent}
              statusColor={stepStateColor}
              onClickHandler={onClickHandler}
              statusCircleSize={stepStatusCircleSize}
            />
            {index !== props.steps.length - 1 && (
              <div
                style={{
                  paddingLeft: `${(stepStatusCircleSize ?? 16) / 2 + 1}px`,
                }}
              >
                <Separator />
              </div>
            )}
          </div>
        ),
      )}
    </nav>
  );
};

//
// Separator
//
const separatorStyles = {
  height: '5vh',
  width: 2,
  border: '1px solid #E1E1E1',
  background: '#E1E1E1',
};

export interface ISeparator {
  height?: string | number;
}

export const Separator = ({ height }: ISeparator): JSX.Element => {
  return <div style={{ ...separatorStyles, height: height ?? '5vh' }} />;
};

//
// Step
//
export interface IStep {
  stepContent: () => JSX.Element;
  statusColor?: string;
  statusCircleSize?: number;
  onClickHandler?: (
    event?: React.MouseEvent<HTMLDivElement>,
  ) => void | undefined;
}

const buttonContainerStyles: CSS.Properties = {
  display: 'inline-flex',
  flexWrap: 'wrap',
  gap: '12px',
  padding: '2px',
  cursor: 'pointer',
};

export const Step = ({
  stepContent,
  statusColor,
  statusCircleSize,
  onClickHandler,
}: IStep): JSX.Element => {
  const circleStyles = {
    borderRadius: statusCircleSize ?? 16,
    width: statusCircleSize ?? 16,
    height: statusCircleSize ?? 16,
    border: '2px solid #E1E1E1',
    background: statusColor ?? 'white',
  };

  const keyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.keyCode === 13 || event.keyCode === 32) {
      onClickHandler?.();
    }
  };

  return (
    <div
      tabIndex={0}
      onClick={onClickHandler}
      onKeyDown={keyDownHandler}
      role="button"
      style={{ ...buttonContainerStyles }}
    >
      <div>
        <div style={circleStyles} />
      </div>
      <div style={{ paddingBottom: 2 }}>{stepContent()}</div>
    </div>
  );
};
