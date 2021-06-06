// https://fontawesome.com/how-to-use/on-the-web/using-with/react
import React from 'react';
import {
  config,
  IconName,
  SizeProp,
  IconLookup,
  IconDefinition,
  library,
  findIconDefinition,
} from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import isFunction from 'lodash/isFunction';

export type IconRef = SVGElement;

export type IconProps = Omit<FontAwesomeIconProps, 'children' | 'icon' | 'size'> & {
  name: IconName;
  /**
   * "fas" is for Solid, "far" is for Regular, and "fab" is for Brand.
   * @default 'fas'
   */
  prefix?: 'fas' | 'far' | 'fab';
  /**
   * @default '1x'
   */
  size?: SizeProp;
};

// disable font-awesome auto add css for icon component
config.autoAddCss = false;
library.add(fas, far, fab);

const Icon = React.forwardRef<IconRef, IconProps>((props, ref) => {
  const { name, prefix = 'fas', size = '1x', ...rest } = props;
  delete rest.children;

  const iconLookup: IconLookup = { prefix, iconName: name };
  const iconDefinition: IconDefinition = findIconDefinition(iconLookup);

  const getRef = (element: SVGElement) => {
    if (ref) {
      if (isFunction(ref)) {
        ref(element);
      } else {
        ref.current = element;
      }
    }
  };

  return <FontAwesomeIcon {...rest} forwardedRef={getRef} icon={iconDefinition} size={size} />;
});

export default Icon;
