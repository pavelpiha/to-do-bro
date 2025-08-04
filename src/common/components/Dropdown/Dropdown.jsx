import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

import './Dropdown.css';

const Dropdown = ({
  options,
  value,
  onSelect,
  placeholder = 'Select an option',
  icon,
  className = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionSelect = option => {
    if (!option.isHeader && !option.disabled) {
      onSelect(option);
      setIsOpen(false);
    }
  };

  const getDisplayValue = () => {
    if (value) {
      const selectedOption = options.find(
        opt => opt.value === value || opt.label === value
      );
      return selectedOption ? selectedOption.label : value;
    }
    return placeholder;
  };

  return (
    <div className={`dropdown ${className}`} ref={dropdownRef}>
      <button
        type='button'
        className={`dropdown__trigger ${disabled ? 'dropdown__trigger--disabled' : ''}`}
        onClick={handleToggle}
        aria-expanded={isOpen}
        disabled={disabled}
      >
        {icon && <span className='dropdown__icon'>{icon}</span>}
        <span className='dropdown__text'>{getDisplayValue()}</span>
        <span
          className={`dropdown__arrow ${isOpen ? 'dropdown__arrow--open' : ''}`}
        >
          ▼
        </span>
      </button>

      {isOpen && !disabled && (
        <div className='dropdown__menu'>
          {options.map(option => (
            <div
              key={option.value}
              className={`dropdown__option ${
                option.isHeader ? 'dropdown__option--header' : ''
              } ${option.disabled ? 'dropdown__option--disabled' : ''} ${
                (option.value === value || option.label === value) &&
                !option.isHeader
                  ? 'dropdown__option--selected'
                  : ''
              }`}
              onClick={() => handleOptionSelect(option)}
            >
              {(option.value === value || option.label === value) &&
                !option.isHeader &&
                !option.disabled && <span className='dropdown__check'>✓</span>}
              <span className='dropdown__label'>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

Dropdown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      isHeader: PropTypes.bool,
      disabled: PropTypes.bool,
    })
  ).isRequired,
  value: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  icon: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Dropdown;
