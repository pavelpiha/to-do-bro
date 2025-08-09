import PropTypes from 'prop-types';
import './Calendar.css';

const Calendar = ({
  selectedDate,
  onDateSelect,
  hasEvents,
  monthsToShow = 60,
}) => {
  // Generate multiple months for scrolling
  const generateMonths = () => {
    const today = new Date();
    const months = [];

    // Generate months for smooth infinite-like scrolling
    for (let i = 0; i < monthsToShow; i++) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() + i, 1);
      months.push(monthDate);
    }

    return months;
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
          const hasEventDot = hasEvents ? hasEvents(date) : false;

          days.push(
            <button
              key={date.toISOString()}
              className={`calendar__day ${
                isCurrentMonth
                  ? 'calendar__day--current-month'
                  : 'calendar__day--other-month'
              } ${isSelected ? 'calendar__day--selected' : ''} ${
                isToday ? 'calendar__day--today' : ''
              }`}
              onClick={() => onDateSelect(date)}
            >
              <span className='calendar__day-number'>{date.getDate()}</span>
              {hasEventDot && <span className='calendar__day-dot'></span>}
            </button>
          );
          currentDate.setDate(currentDate.getDate() + 1);
        }
        weeks.push(
          <div key={week} className='calendar__week'>
            {days}
          </div>
        );
      }

      return (
        <div key={monthIndex} className='calendar__month'>
          <div className='calendar__month-header'>
            <div className='calendar__month-year'>
              {monthDate.toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric',
              })}
            </div>
          </div>

          <div className='calendar__weekdays'>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
              <div key={index} className='calendar__weekday'>
                {day}
              </div>
            ))}
          </div>

          <div className='calendar__days'>{weeks}</div>
        </div>
      );
    });
  };

  return <div className='calendar'>{renderCalendar()}</div>;
};

Calendar.propTypes = {
  selectedDate: PropTypes.instanceOf(Date),
  onDateSelect: PropTypes.func.isRequired,
  hasEvents: PropTypes.func,
  monthsToShow: PropTypes.number,
};

export default Calendar;
