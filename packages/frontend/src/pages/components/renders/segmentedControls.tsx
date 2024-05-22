import { Badge } from 'components/shared/Badge';
import { SegmentedControlsOption } from 'components/shared/SegmentedControls';

export const SEGMENTED_CONTROLS_OPTIONS: SegmentedControlsOption[] = [
  { label: 'Test 1', value: 'Test 1' },
  {
    label: 'Test 2',
    value: 'Test 2',
    leftIcon: (
      <Badge size="xs" variant="tertiary">
        1
      </Badge>
    ),
  },
  {
    label: 'Test 3',
    value: 'Test 3',
    rightIcon: (
      <Badge size="xs" variant="tertiary">
        1
      </Badge>
    ),
  },
  {
    label: 'Test 4',
    value: 'Test 4',
    leftIcon: (
      <Badge size="xs" variant="tertiary">
        1
      </Badge>
    ),
    rightIcon: (
      <Badge size="xs" variant="tertiary">
        1
      </Badge>
    ),
  },
  {
    label: 'Test 5',
    value: 'Test 5',
    disabled: true,
  },
];
