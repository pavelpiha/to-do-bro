import { useEffect, useState } from 'react';

import useI18n from '../../hooks/useI18n';
import useTabService from '../../hooks/useTabService';
import './WebsiteForm.css';

const WebsiteForm = ({ onSubmit, onCancel }) => {
  const { t } = useI18n();
  const tabService = useTabService();
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    description: '',
  });

  useEffect(() => {
    // Auto-populate form with current tab info
    const populateForm = async () => {
      try {
        const tabInfo = await tabService.getCurrentTabInfo();
        setFormData({
          url: tabInfo.url,
          title: tabInfo.title,
          description: `Visit: ${tabInfo.title}`,
        });
      } catch (error) {
        console.error('Error getting tab info:', error);
      }
    };

    populateForm();
  }, [tabService]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.url.trim()) {
      return;
    }

    onSubmit({
      text: formData.title,
      description: formData.description,
      url: formData.url,
      type: 'website',
    });
  };

  const autoResizeTextarea = e => {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  return (
    <div className='to-do-bro__view to-do-bro__view--active'>
      <button className='to-do-bro__back-btn' onClick={onCancel}>
        Back
      </button>

      <div className='to-do-bro__header'>
        <h2 className='to-do-bro__title'>Add Website as Task</h2>
      </div>

      <form className='website-form' onSubmit={handleSubmit}>
        <div className='website-form__field'>
          <label className='website-form__label'>Website Title</label>
          <input
            type='text'
            className='website-form__input'
            value={formData.title}
            onChange={e => handleInputChange('title', e.target.value)}
            placeholder='Enter website title'
            required
          />
        </div>

        <div className='website-form__field'>
          <label className='website-form__label'>URL</label>
          <input
            type='url'
            className='website-form__input'
            value={formData.url}
            onChange={e => handleInputChange('url', e.target.value)}
            placeholder='https://example.com'
            required
          />
        </div>

        <div className='website-form__field'>
          <label className='website-form__label'>Description (optional)</label>
          <textarea
            className='website-form__textarea'
            value={formData.description}
            onChange={e => handleInputChange('description', e.target.value)}
            onInput={autoResizeTextarea}
            placeholder='Add a note about this website...'
            rows='2'
          />
        </div>

        <div className='website-form__actions'>
          <button
            type='button'
            className='to-do-bro__btn to-do-bro__btn--secondary'
            onClick={onCancel}
          >
            {t('cancel')}
          </button>
          <button
            type='submit'
            className='to-do-bro__btn to-do-bro__btn--primary'
          >
            {t('save')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WebsiteForm;
