import React, { useEffect, useState } from 'react';

import { Input } from 'components/shared/Input';
import { CrossCircleIcon, SearchIcon } from 'components/shared/CustomIcon';
import { DatePicker } from 'components/shared/DatePicker';
import { Value } from 'react-calendar/dist/cjs/shared/types';
import { Select, SelectOption } from 'components/shared/Select';

export enum StatusOptions {
  ALL_STATUS = 'All status',
  BUILDING = 'Building',
  READY = 'Ready',
  ERROR = 'Error',
}

export interface FilterValue {
  searchedBranch: string;
  status: StatusOptions;
  updateAtRange?: Value;
}

interface FilterFormProps {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
}

const FilterForm = ({ value, onChange }: FilterFormProps) => {
  const [searchedBranch, setSearchedBranch] = useState(value.searchedBranch);
  const [selectedStatus, setSelectedStatus] = useState(value.status);
  const [dateRange, setDateRange] = useState<Value>();

  useEffect(() => {
    onChange({
      searchedBranch,
      status: selectedStatus,
      updateAtRange: dateRange,
    });
  }, [searchedBranch, selectedStatus, dateRange]);

  useEffect(() => {
    setSearchedBranch(value.searchedBranch);
    setSelectedStatus(value.status);
    setDateRange(value.updateAtRange);
  }, [value]);

  const statusOptions = Object.values(StatusOptions)
    .map((status) => ({
      label: status,
      value: status,
    }))
    .filter((status) => status.value !== StatusOptions.ALL_STATUS);

  const handleReset = () => {
    setSearchedBranch('');
  };

  return (
    <div className="xl:grid xl:grid-cols-8 flex flex-col xl:gap-3 gap-0">
      <div className="col-span-4 flex items-center">
        <Input
          placeholder="Search branches"
          leftIcon={<SearchIcon />}
          rightIcon={
            searchedBranch && <CrossCircleIcon onClick={handleReset} />
          }
          value={searchedBranch}
          onChange={(e) => setSearchedBranch(e.target.value)}
        />
      </div>
      <div className="col-span-2 flex items-center">
        <DatePicker
          className="w-full"
          selectRange
          value={dateRange}
          onChange={setDateRange}
          onReset={() => setDateRange(undefined)}
        />
      </div>
      <div className="col-span-2 flex items-center">
        <Select
          options={statusOptions}
          clearable
          placeholder="All status"
          value={{ label: selectedStatus, value: selectedStatus }}
          onChange={(item) =>
            setSelectedStatus((item as SelectOption).value as StatusOptions)
          }
          onClear={() => setSelectedStatus(StatusOptions.ALL_STATUS)}
        />
      </div>
    </div>
  );
};

export default FilterForm;
