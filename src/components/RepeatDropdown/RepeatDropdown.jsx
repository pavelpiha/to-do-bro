import PropTypes from 'prop-types';
import { useState } from 'react';

import Dropdown from '../../common/components/Dropdown';
import CustomRepeatPopup from '../CustomRepeatPopup';
import './RepeatDropdown.css';

const RepeatDropdown = ({ onSelect, onCancel: _onCancel, dropUp = false }) => {
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

  return (
    <>
      <div className='repeat-dropdown'>
        <Dropdown
          options={repeatOptions}
          onSelect={handleRepeatSelect}
          placeholder='Repeat'
          icon='🔄'
          className='repeat-dropdown__dropdown'
          dropUp={dropUp}
        />
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
  dropUp: PropTypes.bool,
};

export default RepeatDropdown;
