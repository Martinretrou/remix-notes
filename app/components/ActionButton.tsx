import type { ReactNode } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import React from 'react';

import type { IconProps } from './Icon';
import Icon from './Icon';
import map from 'lodash.map';
import { useOnClickOutside } from '~/hooks';

type DropdownItem = {
  label: string;
  type?: 'edit' | 'move-to-folder' | 'delete';
  url?: string;
  onClick?: () => void;
};

type ActionButtonProps = {
  children?: ReactNode;
  dropdownItems?: DropdownItem[];
  iconPosition: 'left' | 'right';
} & IconProps;

const ActionButton = ({
  children,
  dropdownItems,
  iconPosition,
  onClick = () => null,
  ...props
}: ActionButtonProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  useOnClickOutside(ref, () => {
    if (dropdownItems) {
      setShowDropdown(false);
    }
  });

  const handleClick = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropdownItems) {
      setShowDropdown(!showDropdown);
    } else {
      onClick();
    }
  };

  return (
    <button
      ref={ref}
      className={`action-button ${
        showDropdown ? 'action-button-dropdown-opened' : ''
      }`}
      type="button"
      onClick={handleClick}
    >
      {iconPosition === 'left' && <Icon {...props} />}
      {children}
      {iconPosition === 'right' && <Icon {...props} />}
      {showDropdown && (
        <div className="dropdown">
          {map(dropdownItems, (item) => (
            <div
              className={`dropdown-item ${item?.type}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                item.onClick && item.onClick();
              }}
            >
              <p>{item.label}</p>
            </div>
          ))}
        </div>
      )}
    </button>
  );
};

export default ActionButton;
