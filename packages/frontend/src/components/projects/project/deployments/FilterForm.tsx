import { useEffect, useState } from 'react';

import { Input } from 'components/shared/Input';
import {
  CheckRadioOutlineIcon,
  CrossCircleIcon,
  LoaderIcon,
  SearchIcon,
  TrendingIcon,
  WarningTriangleIcon,
} from 'components/shared/CustomIcon';
import { DatePicker } from 'components/shared/DatePicker';
import { Select, SelectOption } from 'components/shared/Select';
import { Value } from 'types/vendor';

export enum StatusOptions {
  ALL_STATUS = 'All status',
  BUILDING = 'Building',
  READY = 'Ready',
  ERROR = 'Error',
}

export interface FilterValue {
  searchedBranch: string;
  status: StatusOptions | string;
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

  const getOptionIcon = (status: StatusOptions) => {
    switch (status) {
      case StatusOptions.BUILDING:
        return <LoaderIcon />;
      case StatusOptions.READY:
        return <CheckRadioOutlineIcon />;
      case StatusOptions.ERROR:
        return <WarningTriangleIcon />;
      case StatusOptions.ALL_STATUS:
      default:
        return <TrendingIcon />;
    }
  };

  const statusOptions = Object.values(StatusOptions).map((status) => ({
    label: status,
    value: status,
    leftIcon: getOptionIcon(status),
  }));

  const handleReset = () => {
    setSearchedBranch('');
  };

  return (
    <div className="xl:grid xl:grid-cols-8 flex flex-col xl:gap-3 gap-3">
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
          leftIcon={getOptionIcon(selectedStatus as StatusOptions)}
          options={statusOptions}
          clearable
          placeholder="All status"
          value={
            selectedStatus
              ? { label: selectedStatus, value: selectedStatus }
              : undefined
          }
          onChange={(item) =>
            setSelectedStatus((item as SelectOption).value as StatusOptions)
          }
          onClear={() => setSelectedStatus('')}
        />
      </div>
    </div>
  );
};

export default FilterForm;
