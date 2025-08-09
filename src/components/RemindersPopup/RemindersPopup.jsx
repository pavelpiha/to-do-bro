import PropTypes from 'prop-types';
import { useState } from 'react';

import Dropdown from '../../common/components/Dropdown';
import CalendarPopup from '../CalendarPopup';
import './RemindersPopup.css';

const RemindersPopup = ({ onSelect, hasDateTime: _hasDateTime }) => {
  const [selectedType, setSelectedType] = useState('date-time');
  const [selectedTime, setSelectedTime] = useState('10 mins before');
  const [selectedDateTime, setSelectedDateTime] = useState(() => {
    const now = new Date();
    // Round to next 15-minute interval
    const minutes = Math.ceil(now.getMinutes() / 15) * 15;
    now.setMinutes(minutes, 0, 0);
    return now;
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Generate time options in 15-minute intervals
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push({
          label: timeString,
          value: timeString,
        });
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  const beforeTaskOptions = [
    { label: 'At time of task', value: 'at-time' },
    { label: '10 mins before', value: '10-mins' },
    { label: '30 mins before', value: '30-mins' },
    { label: '45 mins before', value: '45-mins' },
    { label: '1 hour before', value: '1-hour' },
    { label: '2 hours before', value: '2-hours' },
    { label: '3 hours before', value: '3-hours' },
    { label: '1 day before', value: '1-day' },
    { label: '2 days before', value: '2-days' },
    { label: '3 days before', value: '3-days' },
    { label: '1 week before', value: '1-week' },
  ];

  const handleTimeSelect = option => {
    if (selectedType === 'date-time') {
      // For date-time type, update the time component of selectedDateTime
      const [hours, minutes] = option.value.split(':').map(Number);
      const newDateTime = new Date(selectedDateTime);
      newDateTime.setHours(hours, minutes, 0, 0);
      setSelectedDateTime(newDateTime);
    } else {
      // For before-task type, use the original logic
      setSelectedTime(option.label);
    }
  };

  const handleDateSelect = date => {
    // Update the date component of selectedDateTime while preserving time
    const newDateTime = new Date(date);
    newDateTime.setHours(
      selectedDateTime.getHours(),
      selectedDateTime.getMinutes(),
      0,
      0
    );
    setSelectedDateTime(newDateTime);
  };

  const handleCalendarOpen = () => {
    setIsCalendarOpen(true);
  };

  const handleCalendarClose = () => {
    setIsCalendarOpen(false);
  };

  const formatDate = date => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = date => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const handleAddReminder = () => {
    if (selectedType === 'date-time') {
      onSelect({
        type: selectedType,
        datetime: selectedDateTime,
        enabled: true,
      });
    } else {
      onSelect({
        type: selectedType,
        time: selectedTime,
        enabled: true,
      });
    }
  };

  return (
    <>
      <div className='reminders-popup'>
        <div className='reminders-popup__header'>
          <h3 className='reminders-popup__title'>Reminders</h3>
        </div>

        <div className='reminders-popup__content'>
          <div className='reminders-popup__options'>
            <button
              type='button'
              className={`reminders-popup__option ${
                selectedType === 'date-time'
                  ? 'reminders-popup__option--active'
                  : ''
              }`}
              onClick={() => setSelectedType('date-time')}
            >
              <span className='reminders-popup__option-text'>Date & time</span>
            </button>

            <button
              type='button'
              className={`reminders-popup__option ${
                selectedType === 'before-task'
                  ? 'reminders-popup__option--active'
                  : ''
              }`}
              onClick={() => setSelectedType('before-task')}
            >
              <span className='reminders-popup__option-text'>Before task</span>
            </button>
          </div>

          {selectedType === 'date-time' && (
            <div className='reminders-popup__time-section'>
              <div className='reminders-popup__datetime-controls'>
                <div className='reminders-popup__date-picker'>
                  <button
                    type='button'
                    className='reminders-popup__date-button'
                    onClick={handleCalendarOpen}
                  >
                    <span className='reminders-popup__date-icon'>📅</span>
                    <span className='reminders-popup__date-text'>
                      {formatDate(selectedDateTime)}
                    </span>
                  </button>
                </div>

                <div className='reminders-popup__time-picker'>
                  <Dropdown
                    options={timeOptions}
                    value={formatTime(selectedDateTime)}
                    onSelect={handleTimeSelect}
                    icon='🕐'
                    className='reminders-popup__time-dropdown'
                  />
                </div>
              </div>

              <div className='reminders-popup__description'>
                <span className='reminders-popup__description-text'>
                  Get a notification at the specified date and time.
                </span>
              </div>
            </div>
          )}

          {selectedType === 'before-task' && (
            <div className='reminders-popup__time-section'>
              <div className='reminders-popup__dropdown-wrapper'>
                <Dropdown
                  options={beforeTaskOptions}
                  value={selectedTime}
                  onSelect={handleTimeSelect}
                  icon='🕐'
                  className='reminders-popup__dropdown'
                />
              </div>

              <div className='reminders-popup__description'>
                <span className='reminders-popup__description-text'>
                  Get a notification when it's time for this task.
                </span>
              </div>
            </div>
          )}
        </div>

        <div className='reminders-popup__footer'>
          <button
            type='button'
            className='reminders-popup__add-btn'
            onClick={handleAddReminder}
          >
            Add reminder
          </button>
        </div>
      </div>

      <CalendarPopup
        selectedDate={selectedDateTime}
        onDateSelect={handleDateSelect}
        onClose={handleCalendarClose}
        isOpen={isCalendarOpen}
      />
    </>
  );
};

RemindersPopup.propTypes = {
  onSelect: PropTypes.func.isRequired,
  hasDateTime: PropTypes.bool,
};

RemindersPopup.defaultProps = {
  hasDateTime: false,
};

export default RemindersPopup;
