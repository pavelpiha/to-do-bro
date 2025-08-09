import PropTypes from 'prop-types';
import { useRef, useState } from 'react';

import Calendar from '../../common/components/Calendar';
import useI18n from '../../hooks/useI18n';
import RepeatDropdown from '../RepeatDropdown';
import TimePicker from '../TimePicker';
import './DatePicker.css';

const DatePicker = ({
  onSelect,
  onCancel: _onCancel,
  onUpdate,
  initialDate = null,
  initialTime = null,
  initialRepeat = null,
}) => {
  const { t } = useI18n();
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedTime, setSelectedTime] = useState(initialTime);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedRepeat, setSelectedRepeat] = useState(initialRepeat);

  // Use refs to track current values for cleanup
  const currentStateRef = useRef();
  currentStateRef.current = {
    selectedDate,
    selectedTime,
    selectedRepeat,
  };

  // Get next weekend (Saturday)
  const getNextWeekend = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const daysUntilSaturday = dayOfWeek === 0 ? 6 : 6 - dayOfWeek; // Days until next Saturday
    const nextSaturday = new Date(today);
    nextSaturday.setDate(today.getDate() + daysUntilSaturday);
    return nextSaturday;
  };

  const quickDates = [
    {
      key: 'tomorrow',
      label: t('tomorrow'),
      date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      icon: '☀️',
      dayLabel: 'Mon',
    },
    {
      key: 'nextWeekend',
      label: 'Next weekend',
      date: getNextWeekend(),
      icon: '🗓️',
      dayLabel: 'Sat 9 Aug',
    },
    {
      key: 'noDate',
      label: 'No Date',
      date: null,
      icon: '⊘',
      dayLabel: '',
    },
  ];

  const handleQuickDateSelect = date => {
    setSelectedDate(date);
    onSelect({ date, time: selectedTime, repeat: selectedRepeat });
  };

  const handleDateSelect = date => {
    setSelectedDate(date);
    onSelect({ date, time: selectedTime, repeat: selectedRepeat });
  };

  const handleTimeButtonClick = () => {
    setShowTimePicker(true);
  };

  const handleTimePickerSave = timeData => {
    setSelectedTime(timeData.time);
    setShowTimePicker(false);
    // Call onUpdate to save changes without closing DatePicker
    if (onUpdate && selectedDate) {
      onUpdate({
        date: selectedDate,
        time: timeData.time,
        repeat: selectedRepeat,
      });
    }
  };

  const handleTimePickerCancel = () => {
    setShowTimePicker(false);
  };

  const handleTimeUnset = e => {
    e.stopPropagation();
    setSelectedTime(null);
    // Call onUpdate to save changes without closing DatePicker
    if (onUpdate && selectedDate) {
      onUpdate({
        date: selectedDate,
        time: null,
        repeat: selectedRepeat,
      });
    }
  };

  const handleRepeatSelect = repeatData => {
    setSelectedRepeat(repeatData);
    // Call onUpdate to save changes without closing DatePicker
    if (onUpdate && selectedDate) {
      onUpdate({
        date: selectedDate,
        time: selectedTime,
        repeat: repeatData,
      });
    }
  };

  const handleRepeatUnset = () => {
    setSelectedRepeat(null);
    // Call onUpdate to save changes without closing DatePicker
    if (onUpdate && selectedDate) {
      onUpdate({
        date: selectedDate,
        time: selectedTime,
        repeat: null,
      });
    }
  };

  // Check if a date has tasks/events (mock data for now)
  const hasEvents = date => {
    const day = date.getDate();
    // Mock: show dots for 4th and 5th as shown in design
    return day === 4 || day === 5;
  };

  const formatHeaderDate = () => {
    const dateToShow = selectedDate || new Date();
    const formattedDate = dateToShow.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
    });

    if (selectedTime) {
      return `${formattedDate}, ${selectedTime}`;
    }

    return formattedDate;
  };

  return (
    <div className='date-picker-container'>
      <div className='date-picker-header'>
        <div className='date-picker-header__date'>{formatHeaderDate()}</div>
      </div>

      <div className='date-picker'>
        <div className='date-picker__quick-dates'>
          {quickDates.map(({ key, label, date, icon, dayLabel }) => (
            <button
              key={key}
              className='date-picker__quick-date'
              onClick={() => handleQuickDateSelect(date)}
            >
              <div className='date-picker__quick-date-content'>
                <div className='date-picker__quick-date-left'>
                  <span className='date-picker__quick-date-icon'>{icon}</span>
                  <span className='date-picker__quick-date-label'>{label}</span>
                </div>
                {dayLabel && (
                  <span className='date-picker__quick-date-day'>
                    {dayLabel}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className='date-picker__calendar'>
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            hasEvents={hasEvents}
          />
        </div>

        <div className='date-picker__actions'>
          <div
            className={`date-picker__action-btn--wrapper ${selectedTime ? 'date-picker__action-btn--active' : ''}`}
          >
            <button
              className={`date-picker__action-btn ${selectedTime ? 'date-picker__action-btn--active' : ''}`}
              onClick={handleTimeButtonClick}
            >
              <span className='date-picker__action-icon'>🕐</span>
              <span className='date-picker__action-label'>
                {selectedTime || 'Time'}
              </span>
            </button>
            {selectedTime && (
              <button
                className='date-picker__time-unset-button'
                onClick={handleTimeUnset}
                type='button'
                aria-label='Remove time'
              >
                ✕
              </button>
            )}
          </div>
          <div
            className={`date-picker__action-btn--wrapper ${selectedRepeat ? 'date-picker__action-btn--active' : ''}`}
          >
            <RepeatDropdown
              onSelect={handleRepeatSelect}
              onCancel={() => {}}
              onUnset={handleRepeatUnset}
              selectedRepeat={selectedRepeat}
              dropUp={true}
            />
          </div>
        </div>
      </div>

      {showTimePicker && (
        <TimePicker
          onSave={handleTimePickerSave}
          onCancel={handleTimePickerCancel}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
};

DatePicker.propTypes = {
  onSelect: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onUpdate: PropTypes.func,
  initialDate: PropTypes.instanceOf(Date),
  initialTime: PropTypes.string,
  initialRepeat: PropTypes.object,
};

export default DatePicker;
