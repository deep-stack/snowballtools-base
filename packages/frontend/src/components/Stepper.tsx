import React from 'react';
import { StepperNav } from 'vertical-stepper-nav';

const COLOR_COMPLETED = '#059669';
const COLOR_ACTIVE = '#CFE6FC';
const COLOR_NOT_STARTED = '#F1F5F9';

interface StepperValue {
  step: number;
  route: string;
  label: string;
}

interface StepperProps {
  activeStep: number;
  stepperValues: StepperValue[];
}

const Stepper = ({ activeStep, stepperValues }: StepperProps) => {
  return (
    <StepperNav
      steps={stepperValues.map((stepperValue: StepperValue) => {
        return {
          stepContent: () => (
            <div
              className={`text-sm ${
                activeStep === stepperValue.step
                  ? 'text-black font-semibold'
                  : 'text-gray-600'
              }`}
            >
              {stepperValue.label}
            </div>
          ),
          stepStatusCircleSize: 30,
          stepStateColor: `${
            activeStep > stepperValue.step
              ? COLOR_COMPLETED
              : activeStep === stepperValue.step
                ? COLOR_ACTIVE
                : COLOR_NOT_STARTED
          }`,
        };
      })}
    />
  );
};

export default Stepper;
