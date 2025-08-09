import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';

import Calendar from '../../common/components/Calendar/Calendar.jsx';
import './CalendarPopup.css';

const CalendarPopup = ({ selectedDate, onDateSelect, onClose, isOpen }) => {
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = event => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = event => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  const handleDateSelect = date => {
    onDateSelect(date);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className='calendar-popup__overlay'>
      <div className='calendar-popup' ref={popupRef}>
        <div className='calendar-popup__header'>
          <h3 className='calendar-popup__title'>Select Date</h3>
          <button
            type='button'
            className='calendar-popup__close'
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className='calendar-popup__content'>
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />
        </div>
      </div>
    </div>
  );
};

CalendarPopup.propTypes = {
  selectedDate: PropTypes.instanceOf(Date),
  onDateSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default CalendarPopup;
