import PropTypes from 'prop-types';
import { useState } from 'react';

import useI18n from '../../hooks/useI18n';
import RepeatDropdown from '../RepeatDropdown';
import TimePicker from '../TimePicker';
import './DatePicker.css';

const DatePicker = ({ onSelect, onCancel: _onCancel }) => {
  const { t } = useI18n();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedRepeat, setSelectedRepeat] = useState(null);

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
    // If we have a selected date, update the parent with all data
    if (selectedDate) {
      onSelect({
        date: selectedDate,
        time: timeData.time,
        repeat: selectedRepeat,
      });
    }
  };

  const handleTimePickerCancel = () => {
    setShowTimePicker(false);
  };

  const handleRepeatSelect = repeatData => {
    setSelectedRepeat(repeatData);
    // If we have a selected date, update the parent with all data
    if (selectedDate) {
      onSelect({
        date: selectedDate,
        time: selectedTime,
        repeat: repeatData,
      });
    }
  };

  // Generate multiple months for scrolling (current + many future months for infinite scroll)
  const generateMonths = () => {
    const today = new Date();
    const months = [];

    // Generate 60 months (5 years) for smooth infinite-like scrolling
    for (let i = 0; i < 60; i++) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() + i, 1);
      months.push(monthDate);
    }

    return months;
  };

  // Check if a date has tasks/events (mock data for now)
  const hasEvents = date => {
    const day = date.getDate();
    // Mock: show dots for 4th and 5th as shown in design
    return day === 4 || day === 5;
  };

  const renderCalendar = () => {
    const months = generateMonths();

    return months.map((monthDate, monthIndex) => {
      const year = monthDate.getFullYear();
      const month = monthDate.getMonth();
      const firstDay = new Date(year, month, 1);

      // Start from Monday (1) instead of Sunday (0)
      const startDate = new Date(firstDay);
      const firstDayOfWeek = firstDay.getDay();
      const daysToSubtract = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
      startDate.setDate(startDate.getDate() - daysToSubtract);

      const weeks = [];
      const currentDate = new Date(startDate);

      for (let week = 0; week < 6; week++) {
        const days = [];
        for (let day = 0; day < 7; day++) {
          const date = new Date(currentDate);
          const isCurrentMonth = date.getMonth() === month;
          const isSelected =
            selectedDate && date.toDateString() === selectedDate.toDateString();
          const isToday = date.toDateString() === new Date().toDateString();
          const hasEventDot = hasEvents(date);

          days.push(
            <button
              key={date.toISOString()}
              className={`date-picker__day ${
                isCurrentMonth
                  ? 'date-picker__day--current-month'
                  : 'date-picker__day--other-month'
              } ${isSelected ? 'date-picker__day--selected' : ''} ${
                isToday ? 'date-picker__day--today' : ''
              }`}
              onClick={() => handleDateSelect(date)}
            >
              <span className='date-picker__day-number'>{date.getDate()}</span>
              {hasEventDot && <span className='date-picker__day-dot'></span>}
            </button>
          );
          currentDate.setDate(currentDate.getDate() + 1);
        }
        weeks.push(
          <div key={week} className='date-picker__week'>
            {days}
          </div>
        );
      }

      return (
        <div key={monthIndex} className='date-picker__month'>
          <div className='date-picker__month-header'>
            <div className='date-picker__month-year'>
              {monthDate.toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric',
              })}
            </div>
          </div>

          <div className='date-picker__weekdays'>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
              <div key={index} className='date-picker__weekday'>
                {day}
              </div>
            ))}
          </div>

          <div className='date-picker__days'>{weeks}</div>
        </div>
      );
    });
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

        <div className='date-picker__calendar'>{renderCalendar()}</div>

        <div className='date-picker__actions'>
          <button
            className={`date-picker__action-btn ${selectedTime ? 'date-picker__action-btn--active' : ''}`}
            onClick={handleTimeButtonClick}
          >
            <span className='date-picker__action-icon'>🕐</span>
            <span className='date-picker__action-label'>Time</span>
          </button>
          <div
            className={`date-picker__action-btn--wrapper ${selectedRepeat ? 'date-picker__action-btn--active' : ''}`}
          >
            <RepeatDropdown
              onSelect={handleRepeatSelect}
              onCancel={() => {}}
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
};

export default DatePicker;
