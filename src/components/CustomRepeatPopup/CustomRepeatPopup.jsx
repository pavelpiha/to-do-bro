import PropTypes from 'prop-types';
import { useState } from 'react';

import './CustomRepeatPopup.css';

const CustomRepeatPopup = ({ onSave, onCancel }) => {
  const [basedOn, setBasedOn] = useState('scheduled');
  const [everyNumber, setEveryNumber] = useState(1);
  const [everyUnit, setEveryUnit] = useState('Day');
  const [endsOption, setEndsOption] = useState('never');
  const [endDate, setEndDate] = useState('02/09/2025');

  const unitOptions = ['Day', 'Week', 'Month', 'Year'];

  const handleNumberChange = e => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    setEveryNumber(value);
  };

  const incrementNumber = () => {
    setEveryNumber(prev => prev + 1);
  };

  const decrementNumber = () => {
    setEveryNumber(prev => Math.max(1, prev - 1));
  };

  const handleSave = () => {
    const repeatData = {
      basedOn,
      every: {
        number: everyNumber,
        unit: everyUnit.toLowerCase(),
      },
      ends: {
        option: endsOption,
        date: endsOption === 'onDate' ? endDate : null,
      },
    };
    onSave(repeatData);
  };

  const formatDateForInput = dateString => {
    // Convert MM/DD/YYYY to YYYY-MM-DD for input
    const [month, day, year] = dateString.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const formatDateForDisplay = inputDate => {
    // Convert YYYY-MM-DD to MM/DD/YYYY for display
    const date = new Date(inputDate);
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const handleDateChange = e => {
    const inputDate = e.target.value;
    const displayDate = formatDateForDisplay(inputDate);
    setEndDate(displayDate);
  };

  return (
    <div className='custom-repeat-popup'>
      <div className='custom-repeat-popup__header'>
        <h3 className='custom-repeat-popup__title'>Custom repeat</h3>
        <button
          type='button'
          className='custom-repeat-popup__close'
          onClick={onCancel}
        >
          ×
        </button>
      </div>

      <div className='custom-repeat-popup__content'>
        <div className='custom-repeat-popup__section'>
          <h4 className='custom-repeat-popup__section-title'>Based on</h4>
          <div className='custom-repeat-popup__radio-group'>
            <label className='custom-repeat-popup__radio-option'>
              <input
                type='radio'
                name='basedOn'
                value='scheduled'
                checked={basedOn === 'scheduled'}
                onChange={e => setBasedOn(e.target.value)}
                className='custom-repeat-popup__radio'
              />
              <span className='custom-repeat-popup__radio-label'>
                Scheduled date
              </span>
            </label>
            <label className='custom-repeat-popup__radio-option'>
              <input
                type='radio'
                name='basedOn'
                value='completed'
                checked={basedOn === 'completed'}
                onChange={e => setBasedOn(e.target.value)}
                className='custom-repeat-popup__radio'
              />
              <span className='custom-repeat-popup__radio-label'>
                Completed date
              </span>
            </label>
          </div>
        </div>

        <div className='custom-repeat-popup__section'>
          <h4 className='custom-repeat-popup__section-title'>Every</h4>
          <div className='custom-repeat-popup__every-controls'>
            <div className='custom-repeat-popup__number-input'>
              <input
                type='number'
                min='1'
                value={everyNumber}
                onChange={handleNumberChange}
                className='custom-repeat-popup__number-field'
              />
              <div className='custom-repeat-popup__number-arrows'>
                <button
                  type='button'
                  className='custom-repeat-popup__arrow custom-repeat-popup__arrow--up'
                  onClick={incrementNumber}
                >
                  ▲
                </button>
                <button
                  type='button'
                  className='custom-repeat-popup__arrow custom-repeat-popup__arrow--down'
                  onClick={decrementNumber}
                >
                  ▼
                </button>
              </div>
            </div>
            <select
              value={everyUnit}
              onChange={e => setEveryUnit(e.target.value)}
              className='custom-repeat-popup__unit-select'
            >
              {unitOptions.map(unit => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className='custom-repeat-popup__section'>
          <h4 className='custom-repeat-popup__section-title'>Ends</h4>
          <div className='custom-repeat-popup__radio-group'>
            <label className='custom-repeat-popup__radio-option'>
              <input
                type='radio'
                name='ends'
                value='never'
                checked={endsOption === 'never'}
                onChange={e => setEndsOption(e.target.value)}
                className='custom-repeat-popup__radio'
              />
              <span className='custom-repeat-popup__radio-label'>Never</span>
            </label>
            <label className='custom-repeat-popup__radio-option custom-repeat-popup__radio-option--with-input'>
              <input
                type='radio'
                name='ends'
                value='onDate'
                checked={endsOption === 'onDate'}
                onChange={e => setEndsOption(e.target.value)}
                className='custom-repeat-popup__radio'
              />
              <span className='custom-repeat-popup__radio-label'>On date</span>
              <div className='custom-repeat-popup__date-input-wrapper'>
                <input
                  type='date'
                  value={formatDateForInput(endDate)}
                  onChange={handleDateChange}
                  className='custom-repeat-popup__date-input'
                  onClick={() => setEndsOption('onDate')}
                />
                <span className='custom-repeat-popup__calendar-icon'>📅</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className='custom-repeat-popup__footer'>
        <button type='button' className='custom-repeat-popup__feedback'>
          💬 Send feedback
        </button>
        <div className='custom-repeat-popup__actions'>
          <button
            type='button'
            className='custom-repeat-popup__cancel'
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type='button'
            className='custom-repeat-popup__save'
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

CustomRepeatPopup.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default CustomRepeatPopup;
