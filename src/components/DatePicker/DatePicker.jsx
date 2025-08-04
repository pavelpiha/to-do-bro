import { useState } from 'react';

import useI18n from '../../hooks/useI18n';
import './DatePicker.css';

const DatePicker = ({ onSelect, onCancel }) => {
  const { t } = useI18n();
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const quickDates = [
    { key: 'today', label: t('today'), date: new Date() },
    {
      key: 'tomorrow',
      label: t('tomorrow'),
      date: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
    {
      key: 'nextWeek',
      label: t('nextWeek'),
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  ];

  const handleQuickDateSelect = date => {
    setSelectedDate(date);
    onSelect(date);
  };

  const handleDateSelect = date => {
    setSelectedDate(date);
  };

  const handleConfirm = () => {
    if (selectedDate) {
      onSelect(selectedDate);
    }
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

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
            {date.getDate()}
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

    return weeks;
  };

  const navigateMonth = direction => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  return (
    <div className='to-do-bro__view to-do-bro__view--active'>
      <button className='to-do-bro__back-btn' onClick={onCancel}>
        Back
      </button>

      <div className='to-do-bro__header'>
        <h2 className='to-do-bro__title'>{t('pickDate')}</h2>
      </div>

      <div className='date-picker'>
        <div className='date-picker__quick-dates'>
          {quickDates.map(({ key, label, date }) => (
            <button
              key={key}
              className='date-picker__quick-date'
              onClick={() => handleQuickDateSelect(date)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className='date-picker__calendar'>
          <div className='date-picker__header'>
            <button
              className='date-picker__nav-btn'
              onClick={() => navigateMonth(-1)}
            >
              ‹
            </button>
            <div className='date-picker__month-year'>
              {currentMonth.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </div>
            <button
              className='date-picker__nav-btn'
              onClick={() => navigateMonth(1)}
            >
              ›
            </button>
          </div>

          <div className='date-picker__weekdays'>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className='date-picker__weekday'>
                {day}
              </div>
            ))}
          </div>

          <div className='date-picker__days'>{renderCalendar()}</div>
        </div>

        <div className='date-picker__actions'>
          <button
            className='to-do-bro__btn to-do-bro__btn--secondary'
            onClick={onCancel}
          >
            {t('cancel')}
          </button>
          <button
            className='to-do-bro__btn to-do-bro__btn--primary'
            onClick={handleConfirm}
            disabled={!selectedDate}
          >
            {t('save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
