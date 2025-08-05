import PropTypes from 'prop-types';
import { useState } from 'react';

import Dropdown from '../../common/components/Dropdown';
import './RemindersPopup.css';

const RemindersPopup = ({ onSelect, hasDateTime }) => {
  const [selectedType, setSelectedType] = useState('date-time');
  const [selectedTime, setSelectedTime] = useState('10 mins before');

  const timeOptions = [
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
    setSelectedTime(option.label);
  };

  const handleAddReminder = () => {
    onSelect({
      type: selectedType,
      time: selectedTime,
      enabled: true,
    });
  };

  return (
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
            <div className='reminders-popup__description'>
              <span className='reminders-popup__description-text'>
                Get a notification when it's time for this task.
              </span>
            </div>
          </div>
        )}

        {selectedType === 'before-task' && (
          <div className='reminders-popup__time-section'>
            <div className='reminders-popup__dropdown-wrapper'>
              <Dropdown
                options={timeOptions}
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
