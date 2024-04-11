import { Steps } from 'components/shared/Steps';

export const renderVerticalSteps = () => {
  return (
    <Steps
      currentIndex={1}
      steps={[
        {
          label: 'Create repository',
        },
        {
          label: 'Deploy',
        },
        {
          label: `What's next?`,
        },
      ]}
    />
  );
};

export const renderHorizontalSteps = () => {
  return (
    <Steps
      orientation="horizontal"
      currentIndex={1}
      steps={[
        {
          label: 'Create repository',
        },
        {
          label: 'Deploy',
        },
        {
          label: `What's next?`,
        },
      ]}
    />
  );
};
