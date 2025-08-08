import useI18n from '../../hooks/useI18n';
import './PriorityPopup.css';

const PriorityPopup = ({ currentPriority, onSelect }) => {
  const { t } = useI18n();

  const priorities = [
    { level: 1, label: 'Priority 1', icon: '🔴' },
    { level: 2, label: 'Priority 2', icon: '🟠' },
    { level: 3, label: 'Priority 3', icon: '🟡' },
    { level: 4, label: 'Priority 4', icon: '🟢' },
  ];

  const handlePriorityClick = level => {
    onSelect(level);
  };

  return (
    <div className='priority-popup'>
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
          >
            <span className='priority-popup__icon'>{priority.icon}</span>
            <span className='priority-popup__label'>{priority.label}</span>
            {currentPriority === priority.level && (
              <span className='priority-popup__check'>✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PriorityPopup;
