import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

import useI18n from '../../hooks/useI18n';
import DatePicker from '../DatePicker';
import PriorityPopup from '../PriorityPopup';
import RemindersPopup from '../RemindersPopup';
import './TaskForm.css';

const TaskForm = ({ onSubmit, onCancel }) => {
  const { t } = useI18n();
  const priorityContainerRef = useRef(null);
  const remindersContainerRef = useRef(null);
  const datePickerContainerRef = useRef(null);
  const [formData, setFormData] = useState({
    text: '',
    description: '',
    priority: null,
    dueDate: null,
    dueTime: null,
    reminders: [],
    repeat: null,
  });
  const [attributes, setAttributes] = useState({
    today: false,
    priority: false,
    reminders: false,
  });
  const [showPriorityPopup, setShowPriorityPopup] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showRemindersPopup, setShowRemindersPopup] = useState(false);

  // Handle click outside popups to close them
  useEffect(() => {
    const handleClickOutside = event => {
      // Check priority popup
      if (
        showPriorityPopup &&
        priorityContainerRef.current &&
        !priorityContainerRef.current.contains(event.target)
      ) {
        setShowPriorityPopup(false);
      }

      // Check reminders popup
      if (
        showRemindersPopup &&
        remindersContainerRef.current &&
        !remindersContainerRef.current.contains(event.target)
      ) {
        setShowRemindersPopup(false);
      }

      // Check date picker
      if (
        showDatePicker &&
        datePickerContainerRef.current &&
        !datePickerContainerRef.current.contains(event.target)
      ) {
        setShowDatePicker(false);
      }
    };

    // Only add listener if any popup is open
    if (showPriorityPopup || showRemindersPopup || showDatePicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showPriorityPopup, showRemindersPopup, showDatePicker]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAttributeToggle = attribute => {
    setAttributes(prev => ({
      ...prev,
      [attribute]: !prev[attribute],
    }));

    // If turning off today, also clear repeat data
    if (attribute === 'today' && attributes.today) {
      setFormData(prev => ({
        ...prev,
        repeat: null,
      }));
    }
  };

  const handlePrioritySelect = priority => {
    setFormData(prev => ({
      ...prev,
      priority,
    }));
    setAttributes(prev => ({
      ...prev,
      priority: priority !== null,
    }));
    setShowPriorityPopup(false);
  };

  const handleDateSelect = dateTimeData => {
    const { date, time, repeat } = dateTimeData;
    setFormData(prev => ({
      ...prev,
      dueDate: date ? date.toISOString() : null,
      dueTime: time || null,
      repeat: repeat || null,
    }));
    setAttributes(prev => ({
      ...prev,
      today: false, // Turn off today toggle when a specific date is selected
    }));
    setShowDatePicker(false);
  };

  const handleDateUpdate = dateTimeData => {
    // Handle updates without closing the DatePicker
    const { date, time, repeat } = dateTimeData;
    setFormData(prev => ({
      ...prev,
      dueDate: date ? date.toISOString() : null,
      dueTime: time || null,
      repeat: repeat || null,
    }));
    setAttributes(prev => ({
      ...prev,
      today: false,
    }));
    // Don't close the DatePicker here
  };

  const handleDatePickerCancel = () => {
    setShowDatePicker(false);
  };

  const handleReminderSelect = remindersList => {
    setFormData(prev => ({
      ...prev,
      reminders: remindersList,
    }));
    setAttributes(prev => ({
      ...prev,
      reminders: remindersList.length > 0,
    }));
  };

  const handleRemindersClick = () => {
    setShowRemindersPopup(!showRemindersPopup);
  };

  const handleTodayClick = () => {
    if (attributes.today) {
      // If today is already active, turn it off
      handleAttributeToggle('today');
    } else {
      // If today is not active, show date picker
      setShowDatePicker(true);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!formData.text.trim()) {
      return;
    }

    onSubmit({
      ...formData,
      dueDate: attributes.today ? new Date().toISOString() : formData.dueDate,
      dueTime: formData.dueTime,
      repeat: formData.repeat,
    });
  };

  const autoResizeTextarea = e => {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  const getPriorityIcon = () => {
    if (!formData.priority) {
      return '🚩';
    }

    const icons = {
      1: '🔴', // Priority 1 - Red flag
      2: '🟠', // Priority 2 - Orange flag
      3: '🟡', // Priority 3 - Yellow flag
      4: '🟢', // Priority 4 - Green flag
    };
    return icons[formData.priority] || '🚩';
  };

  const getPriorityText = () => {
    if (!formData.priority) {
      return t('priority');
    }
    return `${t('priority')} ${formData.priority}`;
  };

  const getDateDisplayText = () => {
    if (attributes.today) {
      return formData.dueTime
        ? `${t('today')}, ${formData.dueTime}`
        : t('today');
    }
    if (formData.dueDate) {
      const date = new Date(formData.dueDate);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      let dateText;
      if (date.toDateString() === today.toDateString()) {
        dateText = t('today');
      } else if (date.toDateString() === tomorrow.toDateString()) {
        dateText = t('tomorrow');
      } else {
        dateText = date.toLocaleDateString();
      }

      return formData.dueTime ? `${dateText}, ${formData.dueTime}` : dateText;
    }
    return t('todayTitle');
  };

  return (
    <>
      <div className='to-do-bro__view to-do-bro__view--active'>
        <form className='task-form' onSubmit={handleSubmit}>
          <input
            type='text'
            className='task-form__input'
            placeholder='Fix bike tire this weekend'
            maxLength='100'
            value={formData.text}
            onChange={e => handleInputChange('text', e.target.value)}
            autoFocus
            required
          />

          <textarea
            className='task-form__description'
            placeholder='Description'
            rows='1'
            value={formData.description}
            onChange={e => handleInputChange('description', e.target.value)}
            onInput={autoResizeTextarea}
          />

          <div className='task-form__attributes'>
            <button
              type='button'
              className={`task-form__attribute ${
                attributes.today || formData.dueDate
                  ? 'task-form__attribute--active'
                  : ''
              }`}
              onClick={handleTodayClick}
            >
              <span className='task-form__attribute-icon'>📅</span>

              <span>{getDateDisplayText()}</span>
              {formData.repeat && (
                <span className='task-form__attribute-icon'>🔄</span>
              )}
              {(attributes.today || formData.dueDate) && (
                <span
                  className='task-form__remove-btn'
                  onClick={e => {
                    e.stopPropagation();
                    if (attributes.today) {
                      handleAttributeToggle('today');
                    } else {
                      setFormData(prev => ({
                        ...prev,
                        dueDate: null,
                        dueTime: null,
                        repeat: null,
                      }));
                    }
                  }}
                >
                  ×
                </span>
              )}
            </button>

            <div
              className='task-form__attribute-container'
              ref={priorityContainerRef}
            >
              <button
                type='button'
                className={`task-form__attribute ${
                  attributes.priority ? 'task-form__attribute--active' : ''
                }`}
                onClick={() => setShowPriorityPopup(!showPriorityPopup)}
              >
                <span className='task-form__attribute-icon'>
                  {getPriorityIcon()}
                </span>
                <span>{getPriorityText()}</span>
                {attributes.priority && (
                  <span
                    className='task-form__remove-btn'
                    onClick={e => {
                      e.stopPropagation();
                      setFormData(prev => ({
                        ...prev,
                        priority: null,
                      }));
                      setAttributes(prev => ({
                        ...prev,
                        priority: false,
                      }));
                    }}
                  >
                    ×
                  </span>
                )}
              </button>

              {showPriorityPopup && (
                <PriorityPopup
                  currentPriority={formData.priority}
                  onSelect={handlePrioritySelect}
                />
              )}
            </div>

            <div
              className='task-form__attribute-container'
              ref={remindersContainerRef}
            >
              <button
                type='button'
                className={`task-form__attribute ${
                  attributes.reminders ? 'task-form__attribute--active' : ''
                }`}
                onClick={handleRemindersClick}
              >
                <span className='task-form__attribute-icon'>⏰</span>
                <span>Reminders</span>
                {attributes.reminders && (
                  <span
                    className='task-form__remove-btn'
                    onClick={e => {
                      e.stopPropagation();
                      setFormData(prev => ({
                        ...prev,
                        reminders: [],
                      }));
                      setAttributes(prev => ({
                        ...prev,
                        reminders: false,
                      }));
                    }}
                  >
                    ×
                  </span>
                )}
              </button>

              {showRemindersPopup && (
                <RemindersPopup
                  onSelect={handleReminderSelect}
                  hasDateTime={
                    !!(formData.dueDate || formData.dueTime || attributes.today)
                  }
                  initialReminders={formData.reminders}
                />
              )}
            </div>

            <button type='button' className='task-form__attribute'>
              <span className='task-form__attribute-icon'>⋯</span>
            </button>
          </div>

          <div className='task-form__footer'>
            <button type='button' className='task-form__inbox-selector'>
              <span className='task-form__inbox-icon'>📥</span>
              <span>Inbox</span>
              <span>▼</span>
            </button>

            <div className='task-form__footer-actions'>
              <button
                type='button'
                className='task-form__close-btn'
                onClick={onCancel}
              >
                ×
              </button>
              <button type='submit' className='task-form__submit-btn'>
                ▶
              </button>
            </div>
          </div>
        </form>
      </div>

      {showDatePicker && (
        <div className='date-picker-centered' ref={datePickerContainerRef}>
          <DatePicker
            onSelect={handleDateSelect}
            onCancel={handleDatePickerCancel}
            onUpdate={handleDateUpdate}
            initialDate={formData.dueDate ? new Date(formData.dueDate) : null}
            initialTime={formData.dueTime}
            initialRepeat={formData.repeat}
          />
        </div>
      )}
    </>
  );
};

TaskForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default TaskForm;
