import { useState } from 'react';

import useI18n from '../../hooks/useI18n';
import PriorityPopup from '../PriorityPopup';
import './TaskForm.css';

const TaskForm = ({ onSubmit, onCancel }) => {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    text: '',
    description: '',
    priority: null,
    dueDate: null,
    reminders: false,
  });
  const [attributes, setAttributes] = useState({
    today: true,
    priority: false,
    reminders: false,
  });
  const [showPriorityPopup, setShowPriorityPopup] = useState(false);

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

  const handleSubmit = e => {
    e.preventDefault();
    if (!formData.text.trim()) {
      return;
    }

    onSubmit({
      ...formData,
      dueDate: attributes.today ? new Date().toISOString() : formData.dueDate,
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

  return (
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
              attributes.today ? 'task-form__attribute--active' : ''
            }`}
            onClick={() => handleAttributeToggle('today')}
          >
            <span className='task-form__attribute-icon'>📅</span>
            <span>{t('today')}</span>
            {attributes.today && (
              <span
                className='task-form__remove-btn'
                onClick={e => {
                  e.stopPropagation();
                  handleAttributeToggle('today');
                }}
              >
                ×
              </span>
            )}
          </button>

          <div className='task-form__attribute-container'>
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
            </button>

            {showPriorityPopup && (
              <PriorityPopup
                currentPriority={formData.priority}
                onSelect={handlePrioritySelect}
                onClose={() => setShowPriorityPopup(false)}
              />
            )}
          </div>

          <button
            type='button'
            className={`task-form__attribute ${
              attributes.reminders ? 'task-form__attribute--active' : ''
            }`}
            onClick={() => handleAttributeToggle('reminders')}
          >
            <span className='task-form__attribute-icon'>⏰</span>
            <span>Reminders</span>
          </button>

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
  );
};

export default TaskForm;
