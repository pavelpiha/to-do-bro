import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

import './Dropdown.css';

const Dropdown = ({
  trigger,
  options,
  value,
  onSelect,
  placeholder = 'Select an option',
  disabled = false,
  className = '',
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

  const selectedOption = options.find(
    opt => opt.value === value || opt.label === value
  );
  const displayText = selectedOption ? selectedOption.label : placeholder;

  return (
    <div className={`dropdown ${className}`} ref={dropdownRef}>
      {trigger ? (
        <div onClick={handleToggle}>{trigger}</div>
      ) : (
        <button
          type='button'
          className={`dropdown__trigger ${disabled ? 'dropdown__trigger--disabled' : ''}`}
          onClick={handleToggle}
          aria-expanded={isOpen}
          disabled={disabled}
        >
          <span className='dropdown__text'>{displayText}</span>
          <span
            className={`dropdown__arrow ${isOpen ? 'dropdown__arrow--open' : ''}`}
          >
            ▼
          </span>
        </button>
      )}

      {isOpen && (
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
              <span className='dropdown__option-text'>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

Dropdown.propTypes = {
  trigger: PropTypes.node,
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
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default Dropdown;
