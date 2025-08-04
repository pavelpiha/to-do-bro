import useI18n from '../../hooks/useI18n';
import './MainView.css';

const MainView = ({ todos, onNavigate }) => {
  const { t } = useI18n();

  const incompleteTodos = todos.filter(todo => !todo.completed);

  return (
    <div className='to-do-bro__view to-do-bro__view--active'>
      <div className='to-do-bro__header'>
        <h1 className='to-do-bro__title'>{t('todayTitle')}</h1>
      </div>

      <div className='to-do-bro__action-menu'>
        <button
          className='to-do-bro__action-item'
          onClick={() => onNavigate('addTask')}
        >
          <span className='to-do-bro__action-icon'>+</span>
          <span className='to-do-bro__action-text'>{t('addTask')}</span>
        </button>

        <button
          className='to-do-bro__action-item'
          onClick={() => onNavigate('addWebsite')}
        >
          <span className='to-do-bro__action-icon'>🔗</span>
          <span className='to-do-bro__action-text'>
            {t('addWebsiteAsTask')}
          </span>
        </button>
      </div>

      {incompleteTodos.length > 0 && (
        <div className='to-do-bro__task-list'>
          <h3>Tasks ({incompleteTodos.length})</h3>
          {incompleteTodos.map(todo => (
            <div key={todo.id} className='to-do-bro__task-item'>
              <span className='to-do-bro__task-text'>{todo.text}</span>
              {todo.description && (
                <span className='to-do-bro__task-description'>
                  {todo.description}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MainView;
