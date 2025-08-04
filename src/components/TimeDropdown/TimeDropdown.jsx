import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

import './TimeDropdown.css';

const TimeDropdown = ({
  value,
  onChange,
  selectedDate,
  placeholder = 'Select time',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Generate time options in 15-minute intervals
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(timeString);
      }
    }
    return options;
  };

  // Filter options based on selected date
  const getFilteredOptions = () => {
    const allOptions = generateTimeOptions();

    // If selected date is today, filter out past times
    if (selectedDate && isToday(selectedDate)) {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      return allOptions.filter(time => time > currentTime);
    }

    return allOptions;
  };

  // Check if a date is today
  const isToday = date => {
    const today = new Date();
    const checkDate = new Date(date);
    return checkDate.toDateString() === today.toDateString();
  };

  // Validate time format (HH:MM)
  const isValidTimeFormat = time => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  };

  // Auto-correct invalid time values
  const autoCorrectTime = timeString => {
    if (!timeString) {
      return '';
    }

    // Remove any non-digit and non-colon characters
    const cleaned = timeString.replace(/[^\d:]/g, '');

    // Handle different input formats
    if (cleaned.length === 1 || cleaned.length === 2) {
      // Single or double digit: assume hours only
      let hours = parseInt(cleaned, 10);
      hours = Math.min(Math.max(hours, 0), 23);
      return `${hours.toString().padStart(2, '0')}:00`;
    }

    if (cleaned.length === 3) {
      // Three digits: assume H:MM or HH:M
      if (cleaned.includes(':')) {
        const parts = cleaned.split(':');
        let hours = parseInt(parts[0], 10) || 0;
        let minutes = parseInt(parts[1], 10) || 0;
        hours = Math.min(Math.max(hours, 0), 23);
        minutes = Math.min(Math.max(minutes, 0), 59);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      } else {
        // HMM format
        let hours = parseInt(cleaned.substring(0, 1), 10);
        let minutes = parseInt(cleaned.substring(1), 10);
        hours = Math.min(Math.max(hours, 0), 23);
        minutes = Math.min(Math.max(minutes, 0), 59);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      }
    }

    if (cleaned.length === 4) {
      // Four digits: assume HHMM
      if (cleaned.includes(':')) {
        const parts = cleaned.split(':');
        let hours = parseInt(parts[0], 10) || 0;
        let minutes = parseInt(parts[1], 10) || 0;
        hours = Math.min(Math.max(hours, 0), 23);
        minutes = Math.min(Math.max(minutes, 0), 59);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      } else {
        // HHMM format
        let hours = parseInt(cleaned.substring(0, 2), 10);
        let minutes = parseInt(cleaned.substring(2), 10);
        hours = Math.min(Math.max(hours, 0), 23);
        minutes = Math.min(Math.max(minutes, 0), 59);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      }
    }

    if (cleaned.includes(':')) {
      const parts = cleaned.split(':');
      let hours = parseInt(parts[0], 10) || 0;
      let minutes = parseInt(parts[1], 10) || 0;
      hours = Math.min(Math.max(hours, 0), 23);
      minutes = Math.min(Math.max(minutes, 0), 59);
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    // Default fallback
    return '12:00';
  };

  // Handle input change
  const handleInputChange = e => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // If it's a valid time format, call onChange immediately
    if (isValidTimeFormat(newValue)) {
      onChange(newValue);
    }
  };

  // Handle input blur
  const handleInputBlur = () => {
    if (inputValue) {
      // Auto-correct the input value
      const correctedTime = autoCorrectTime(inputValue);
      setInputValue(correctedTime);
      onChange(correctedTime);
    }
  };

  // Handle option selection
  const handleOptionSelect = time => {
    setInputValue(time);
    onChange(time);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  // Handle input focus
  const handleInputFocus = () => {
    setIsOpen(true);
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update input value when prop changes
  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  const filteredOptions = getFilteredOptions();

  return (
    <div className='time-dropdown' ref={dropdownRef}>
      <input
        ref={inputRef}
        type='text'
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder={placeholder}
        className='time-dropdown__input'
      />

      {isOpen && (
        <div className='time-dropdown__list'>
          {filteredOptions.map(time => (
            <button
              key={time}
              type='button'
              className={`time-dropdown__option ${
                time === inputValue ? 'time-dropdown__option--selected' : ''
              }`}
              onClick={() => handleOptionSelect(time)}
            >
              {time}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

TimeDropdown.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  selectedDate: PropTypes.instanceOf(Date),
  placeholder: PropTypes.string,
};

export default TimeDropdown;
