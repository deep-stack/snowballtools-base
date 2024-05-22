import { useMemo } from 'react';
import { CustomIconProps } from '../CustomIcon';
import { ReactNativeIcon } from './ReactNativeIcon';
import { cloneIcon } from 'utils/cloneIcon';
import { PWAIcon } from './PWAIcon';
import { WebAppIcon } from './WebAppIcon';
import { KotlinIcon } from './KotlinIcon';
import { SwitfIcon } from './SwiftIcon';

const TEMPLATE_ICONS = [
  'react-native',
  'pwa',
  'web',
  'kotlin',
  'swift',
] as const;
export type TemplateIconType = (typeof TEMPLATE_ICONS)[number];

export interface TemplateIconProps extends CustomIconProps {
  type: TemplateIconType;
}

export const TemplateIcon = ({ type, ...props }: TemplateIconProps) => {
  const renderIcon = useMemo(() => {
    switch (type) {
      case 'react-native':
        return <ReactNativeIcon />;
      case 'pwa':
        return <PWAIcon />;
      case 'web':
        return <WebAppIcon />;
      case 'kotlin':
        return <KotlinIcon />;
      case 'swift':
        return <SwitfIcon />;
      default:
        throw new Error(`Invalid template icon type: ${type}`);
    }
  }, [type]);

  return cloneIcon(renderIcon, props) as JSX.Element;
};
