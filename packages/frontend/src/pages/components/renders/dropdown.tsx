import React, { useState } from 'react';
import { PencilIcon } from 'components/shared/CustomIcon';
import { SelectOption, Select } from 'components/shared/Select';

export const DROPDOWN_ITEMS: SelectOption[] = [
  {
    value: 'apple',
    label: 'Apple',
    description: 'Apple is fruit',
    leftIcon: <PencilIcon />,
  },
  {
    value: 'banana',
    label: 'Banana',
    description: 'Banana is fruit',
    leftIcon: <PencilIcon />,
  },
  {
    value: 'orange',
    label: 'Orange',
    description: 'Orange is fruit',
    leftIcon: <PencilIcon />,
  },
  {
    value: 'watermelon',
    label: 'Watermelon',
    description: 'Watermelon is fruit',
    disabled: true,
    leftIcon: <PencilIcon />,
  },
];

export const DropdownExample = () => {
  const [singleValue, setSingleValue] = useState<SelectOption>();
  const [multipleValue, setMultipleValue] = useState<SelectOption[]>([]);

  const handleSelect = (
    type: 'single' | 'multiple',
    value: SelectOption | SelectOption[],
  ) => {
    if (type === 'single') {
      setSingleValue(value as SelectOption);
    } else {
      setMultipleValue(value as SelectOption[]);
    }
  };

  return (
    <>
      <p className="text-sm text-center text-gray-500 -mb-8">Single – Small</p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Select
          size="sm"
          placeholder="Default"
          options={DROPDOWN_ITEMS}
          value={singleValue}
          onChange={(value) => handleSelect('single', value)}
        />
        <Select
          size="sm"
          placeholder="Clearable"
          clearable
          options={DROPDOWN_ITEMS}
          value={singleValue}
          onChange={(value) => handleSelect('single', value)}
        />
        <Select
          size="sm"
          searchable
          placeholder="Searchable"
          options={DROPDOWN_ITEMS}
          value={singleValue}
          onChange={(value) => handleSelect('single', value)}
        />
        <Select
          size="sm"
          placeholder="Vertical"
          orientation="vertical"
          options={DROPDOWN_ITEMS}
          value={singleValue}
          onChange={(value) => handleSelect('single', value)}
        />
      </div>
      <p className="text-sm text-center text-gray-500 -mb-8">Single – Medium</p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Select
          placeholder="Default"
          options={DROPDOWN_ITEMS}
          value={singleValue}
          onChange={(value) => handleSelect('single', value)}
        />
        <Select
          placeholder="Clearable"
          clearable
          options={DROPDOWN_ITEMS}
          value={singleValue}
          onChange={(value) => handleSelect('single', value)}
        />
        <Select
          searchable
          placeholder="Searchable"
          options={DROPDOWN_ITEMS}
          value={singleValue}
          onChange={(value) => handleSelect('single', value)}
        />
        <Select
          placeholder="Vertical"
          orientation="vertical"
          options={DROPDOWN_ITEMS}
          value={singleValue}
          onChange={(value) => handleSelect('single', value)}
        />
      </div>
      <p className="text-sm text-center text-gray-500 -mb-8">
        Multiple – Small
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Select
          multiple
          size="sm"
          placeholder="Default"
          options={DROPDOWN_ITEMS}
          value={multipleValue}
          onChange={(value) => handleSelect('multiple', value)}
        />
        <Select
          multiple
          size="sm"
          placeholder="Clearable"
          clearable
          options={DROPDOWN_ITEMS}
          value={multipleValue}
          onChange={(value) => handleSelect('multiple', value)}
        />
        <Select
          searchable
          multiple
          size="sm"
          placeholder="Searchable"
          options={DROPDOWN_ITEMS}
          value={multipleValue}
          onChange={(value) => handleSelect('multiple', value)}
        />
        <Select
          multiple
          size="sm"
          placeholder="Vertical"
          orientation="vertical"
          options={DROPDOWN_ITEMS}
          value={multipleValue}
          onChange={(value) => handleSelect('multiple', value)}
        />
        <Select
          multiple
          hideValues
          size="sm"
          orientation="vertical"
          placeholder="Hide values"
          options={DROPDOWN_ITEMS}
          value={multipleValue}
          onChange={(value) => handleSelect('multiple', value)}
        />
      </div>
      <p className="text-sm text-center text-gray-500 -mb-8">
        Multiple – Medium
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Select
          multiple
          placeholder="Default"
          options={DROPDOWN_ITEMS}
          value={multipleValue}
          onChange={(value) => handleSelect('multiple', value)}
        />
        <Select
          multiple
          placeholder="Clearable"
          clearable
          options={DROPDOWN_ITEMS}
          value={multipleValue}
          onChange={(value) => handleSelect('multiple', value)}
        />
        <Select
          searchable
          multiple
          placeholder="Searchable"
          options={DROPDOWN_ITEMS}
          value={multipleValue}
          onChange={(value) => handleSelect('multiple', value)}
        />
        <Select
          multiple
          placeholder="Vertical"
          orientation="vertical"
          options={DROPDOWN_ITEMS}
          value={multipleValue}
          onChange={(value) => handleSelect('multiple', value)}
        />
        <Select
          multiple
          hideValues
          orientation="vertical"
          placeholder="Hide values"
          options={DROPDOWN_ITEMS}
          value={multipleValue}
          onChange={(value) => handleSelect('multiple', value)}
        />
      </div>
      <p className="text-sm text-center text-gray-500 -mb-4">
        Single – With label, description, and helper text
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Select
          label="Default"
          description="Single select component"
          helperText="This is a helper text"
          options={DROPDOWN_ITEMS}
          value={singleValue}
          onChange={(value) => handleSelect('single', value)}
        />
        <Select
          label="Clearable"
          description="Single select component"
          helperText="This is a helper text"
          clearable
          options={DROPDOWN_ITEMS}
          value={singleValue}
          onChange={(value) => handleSelect('single', value)}
        />
        <Select
          searchable
          label="Searchable"
          description="Single select component"
          helperText="This is a helper text"
          options={DROPDOWN_ITEMS}
          value={singleValue}
          onChange={(value) => handleSelect('single', value)}
        />
        <Select
          label="Vertical"
          description="Single select component"
          helperText="This is a helper text"
          orientation="vertical"
          options={DROPDOWN_ITEMS}
          value={singleValue}
          onChange={(value) => handleSelect('single', value)}
        />
      </div>
      <p className="text-sm text-center text-gray-500 -mb-4">
        Multiple – With label, description, and helper text
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Select
          label="Default"
          description="Multiple select component"
          helperText="This is a helper text"
          multiple
          options={DROPDOWN_ITEMS}
          value={multipleValue}
          onChange={(value) => handleSelect('multiple', value)}
        />
        <Select
          label="Clearable"
          description="Multiple select component"
          helperText="This is a helper text"
          multiple
          clearable
          options={DROPDOWN_ITEMS}
          value={multipleValue}
          onChange={(value) => handleSelect('multiple', value)}
        />
        <Select
          searchable
          label="Searchable"
          description="Multiple select component"
          helperText="This is a helper text"
          multiple
          options={DROPDOWN_ITEMS}
          value={multipleValue}
          onChange={(value) => handleSelect('multiple', value)}
        />
        <Select
          label="Vertical"
          description="Multiple select component"
          helperText="This is a helper text"
          multiple
          orientation="vertical"
          options={DROPDOWN_ITEMS}
          value={multipleValue}
          onChange={(value) => handleSelect('multiple', value)}
        />
      </div>
      <p className="text-sm text-center text-gray-500 -mb-4">
        Error – With label, description, and helper text
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Select
          error
          label="Default"
          description="Multiple select component"
          helperText="This is a helper text"
          options={DROPDOWN_ITEMS}
        />
        <Select
          error
          label="Clearable"
          description="Multiple select component"
          helperText="This is a helper text"
          clearable
          options={DROPDOWN_ITEMS}
        />
        <Select
          error
          searchable
          label="Searchable"
          description="Multiple select component"
          helperText="This is a helper text"
          options={DROPDOWN_ITEMS}
        />
        <Select
          error
          label="Vertical"
          description="Multiple select component"
          helperText="This is a helper text"
          orientation="vertical"
          options={DROPDOWN_ITEMS}
        />
      </div>
    </>
  );
};
