import React from 'react';
import { Checkbox } from 'components/shared/Checkbox';

export const renderCheckbox = () => {
  return Array.from({ length: 5 }).map((_, index) => (
    <Checkbox
      id={`checkbox-${index + 1}`}
      key={index}
      label={`Label ${index + 1}`}
      disabled={index === 2 || index === 4 ? true : false}
      checked={index === 4 ? true : undefined}
      value={`value-${index + 1}`}
    />
  ));
};

export const renderCheckboxWithDescription = () => {
  return Array.from({ length: 2 }).map((_, index) => (
    <Checkbox
      id={`checkbox-description-${index + 1}`}
      key={index}
      label={`Label ${index + 1}`}
      description={`Description of the checkbox ${index + 1}`}
      value={`value-with-description-${index + 1}`}
    />
  ));
};
