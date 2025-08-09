import PropTypes from 'prop-types';
import { useState } from 'react';

import Dropdown from '../../common/components/Dropdown';
import CustomRepeatPopup from '../CustomRepeatPopup';
import './RepeatDropdown.css';

const RepeatDropdown = ({
  onSelect,
  onCancel: _onCancel,
  onUnset,
  selectedRepeat = null,
  dropUp = false,
}) => {
  const [showCustomRepeatPopup, setShowCustomRepeatPopup] = useState(false);

  const repeatOptions = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Yearly', value: 'yearly' },
    { label: 'Custom repeat', value: 'custom' },
  ];

  const handleRepeatSelect = option => {
    if (option.value === 'custom') {
      setShowCustomRepeatPopup(true);
    } else {
      onSelect({
        type: 'preset',
        value: option.value,
        label: option.label,
      });
    }
  };

  const handleCustomRepeatSave = repeatData => {
    onSelect({
      type: 'custom',
      ...repeatData,
    });
    setShowCustomRepeatPopup(false);
  };

  const handleCustomRepeatCancel = () => {
    setShowCustomRepeatPopup(false);
  };

  const handleUnsetRepeat = e => {
    e.stopPropagation();
    onUnset();
  };

  const getDisplayText = () => {
    if (selectedRepeat) {
      if (selectedRepeat.type === 'preset') {
        return selectedRepeat.label;
      } else if (selectedRepeat.type === 'custom') {
        return `Every ${selectedRepeat.interval} ${selectedRepeat.unit}${selectedRepeat.interval > 1 ? 's' : ''}`;
      }
    }
    return 'Repeat';
  };

  const getDisplayIcon = () => {
    return selectedRepeat ? '🔄' : '🔄';
  };

  return (
    <>
      <div className='repeat-dropdown'>
        {selectedRepeat ? (
          <div className='repeat-dropdown__selected'>
            <span className='repeat-dropdown__selected-icon'>
              {getDisplayIcon()}
            </span>
            <span className='repeat-dropdown__selected-text'>
              {getDisplayText()}
            </span>
            <button
              className='repeat-dropdown__unset-button'
              onClick={handleUnsetRepeat}
              type='button'
              aria-label='Remove repeat'
            >
              ✕
            </button>
          </div>
        ) : (
          <Dropdown
            options={repeatOptions}
            onSelect={handleRepeatSelect}
            placeholder='Repeat'
            icon='🔄'
            className='repeat-dropdown__dropdown'
            dropUp={dropUp}
          />
        )}
      </div>

      {showCustomRepeatPopup && (
        <div
          className='repeat-dropdown__overlay'
          onClick={handleCustomRepeatCancel}
        >
          <div onClick={e => e.stopPropagation()}>
            <CustomRepeatPopup
              onSave={handleCustomRepeatSave}
              onCancel={handleCustomRepeatCancel}
            />
          </div>
        </div>
      )}
    </>
  );
};

RepeatDropdown.propTypes = {
  onSelect: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onUnset: PropTypes.func.isRequired,
  selectedRepeat: PropTypes.shape({
    type: PropTypes.oneOf(['preset', 'custom']).isRequired,
    label: PropTypes.string,
    value: PropTypes.string,
    interval: PropTypes.number,
    unit: PropTypes.string,
  }),
  dropUp: PropTypes.bool,
};

export default RepeatDropdown;
