import useI18n from '../../hooks/useI18n';
import './PriorityPopup.css';

const PriorityPopup = ({ currentPriority, onSelect, onClose }) => {
  const { t } = useI18n();

  const priorities = [
    { level: 1, label: 'Priority 1', color: '#e74c3c', icon: '🔴' },
    { level: 2, label: 'Priority 2', color: '#f39c12', icon: '🟠' },
    { level: 3, label: 'Priority 3', color: '#f1c40f', icon: '🟡' },
    { level: 4, label: 'Priority 4', color: '#27ae60', icon: '🟢' },
  ];

  const handlePriorityClick = level => {
    onSelect(level === currentPriority ? null : level);
  };

  return (
    <div className='priority-popup'>
      <div className='priority-popup__header'>
        <h3 className='priority-popup__title'>{t('priority')}</h3>
        <button className='priority-popup__close' onClick={onClose}>
          ×
        </button>
      </div>

      <div className='priority-popup__options'>
        {priorities.map(priority => (
          <button
            key={priority.level}
            className={`priority-popup__option ${
              currentPriority === priority.level
                ? 'priority-popup__option--selected'
                : ''
            }`}
            onClick={() => handlePriorityClick(priority.level)}
            style={{ borderLeft: `4px solid ${priority.color}` }}
          >
            <span className='priority-popup__icon'>{priority.icon}</span>
            <span className='priority-popup__label'>{priority.label}</span>
            {currentPriority === priority.level && (
              <span className='priority-popup__check'>✓</span>
            )}
          </button>
        ))}

        {currentPriority && (
          <button
            className='priority-popup__option priority-popup__option--remove'
            onClick={() => onSelect(null)}
          >
            <span className='priority-popup__icon'>🚫</span>
            <span className='priority-popup__label'>Remove priority</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default PriorityPopup;
