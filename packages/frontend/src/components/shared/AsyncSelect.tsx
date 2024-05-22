// https://github.com/creativetimofficial/material-tailwind/issues/419#issuecomment-1760474312
import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectProps,
} from '@snowballtools/material-tailwind-react-fork';

// TODO: Use correct type for ref
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AsyncSelect = React.forwardRef((props: SelectProps, ref: any) => {
  const [key, setKey] = useState(0);

  useEffect(() => setKey((preVal) => preVal + 1), [props]);

  return <Select key={key} ref={ref} {...props} />;
});

AsyncSelect.displayName = 'AsyncSelect';

export default AsyncSelect;
