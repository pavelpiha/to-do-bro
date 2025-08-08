import PropTypes from 'prop-types';
import { useState } from 'react';

import useI18n from '../../hooks/useI18n';
import TimeDropdown from '../TimeDropdown';
import './TimePicker.css';

const TimePicker = ({
  onSave,
  onCancel,
  initialTime = '15:00',
  selectedDate,
}) => {
  const { t } = useI18n();
  const [time, setTime] = useState(initialTime);
  const [duration, setDuration] = useState('');
  const [timeZone, setTimeZone] = useState('floating');

  const handleDurationChange = value => {
    setDuration(value);
  };

  const handleTimeZoneChange = e => {
    setTimeZone(e.target.value);
  };

  const handleSave = () => {
    onSave({
      time,
      duration,
      timeZone,
    });
  };

  const durationOptions = [
    { value: '', label: t('timePicker_noDuration') },
    { value: '15', label: '15 minutes' },
    { value: '30', label: '30 minutes' },
    { value: '60', label: '1 hour' },
    { value: '120', label: '2 hours' },
    { value: '240', label: '4 hours' },
    { value: 'custom', label: 'Custom' },
  ];

  return (
    <div className='time-picker-overlay'>
      <div className='time-picker'>
        <div className='time-picker__content'>
          <div className='time-picker__field'>
            <label className='time-picker__label'>{t('timePicker_time')}</label>
            <TimeDropdown
              value={time}
              onChange={setTime}
              selectedDate={selectedDate}
              placeholder='Select time'
            />
          </div>

          <div className='time-picker__field'>
            <label className='time-picker__label'>
              {t('timePicker_duration')}
            </label>
            <div className='time-picker__duration-container'>
              <select
                value={duration}
                onChange={e => handleDurationChange(e.target.value)}
                className='time-picker__select'
              >
                {durationOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='time-picker__field'>
            <label className='time-picker__label'>
              {t('timePicker_timezone')}
            </label>
            <select
              value={timeZone}
              onChange={handleTimeZoneChange}
              className='time-picker__select'
            >
              <option value='floating'>{t('timePicker_floatingTime')}</option>
              <option value='local'>{t('timePicker_localTime')}</option>
            </select>
          </div>
        </div>

        <div className='time-picker__actions'>
          <button className='time-picker__cancel' onClick={onCancel}>
            {t('cancel')}
          </button>
          <button className='time-picker__save' onClick={handleSave}>
            {t('save')}
          </button>
        </div>
      </div>
    </div>
  );
};

TimePicker.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  initialTime: PropTypes.string,
  selectedDate: PropTypes.instanceOf(Date),
};

export default TimePicker;
