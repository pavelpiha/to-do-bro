import PropTypes from 'prop-types';
import { useState } from 'react';

import useI18n from '../../hooks/useI18n';
import TaskView from '../TaskView';
import './MainView.css';

const MainView = ({
  todos,
  onNavigate,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
}) => {
  const { t } = useI18n();
  const [selectedTask, setSelectedTask] = useState(null);

  const incompleteTodos = todos.filter(todo => !todo.completed);

  const getPriorityColor = priority => {
    switch (priority) {
      case 'high':
        return '#dc2626'; // red
      case 'medium':
        return '#f59e0b'; // orange/amber
      case 'low':
        return '#10b981'; // green
      default:
        return '#6b7280'; // gray
    }
  };

  const formatDueDate = dueDate => {
    if (!dueDate) {
      return null;
    }

    const date = new Date(dueDate);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const taskDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    if (taskDate.getTime() === today.getTime()) {
      return {
        text: date.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        color: '#7c3aed', // purple
        isSpecificTime: true,
      };
    } else if (taskDate.getTime() === tomorrow.getTime()) {
      return {
        text: 'Tomorrow',
        color: '#f59e0b', // orange
        isSpecificTime: false,
      };
    } else {
      const dayName = date.toLocaleDateString([], { weekday: 'long' });
      const time = date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      return {
        text: `${dayName} ${time}`,
        color: '#7c3aed', // purple
        isSpecificTime: true,
      };
    }
  };

  const handleTaskAction = (taskId, action) => {
    switch (action) {
      case 'edit':
        onEditTask && onEditTask(taskId);
        break;
      case 'delete':
        onDeleteTask && onDeleteTask(taskId);
        break;
      case 'toggle':
        onToggleComplete && onToggleComplete(taskId);
        break;
      case 'view': {
        const task = todos.find(todo => todo.id === taskId);
        if (task) {
          setSelectedTask(task);
        }
        break;
      }
      default:
        break;
    }
  };

  const handleCloseTaskView = () => {
    setSelectedTask(null);
  };

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
          {incompleteTodos.map(todo => {
            // For testing purposes, enhance todos with sample data if properties are missing
            const enhancedTodo = {
              ...todo,
              priority:
                todo.priority ||
                (todo.id % 3 === 0
                  ? 'high'
                  : todo.id % 3 === 1
                    ? 'medium'
                    : 'low'),
              hasReminder:
                todo.hasReminder ||
                todo.reminders?.length > 0 ||
                todo.id % 2 === 0,
              hasRepeat: todo.hasRepeat || !!todo.repeat || todo.id % 3 === 0,
              isRecurring:
                todo.isRecurring || !!todo.repeat || todo.id % 4 === 0,
              dueDate:
                todo.dueDate ||
                (todo.id % 2 === 0
                  ? new Date(Date.now() + 86400000)
                  : new Date(Date.now() + 3600000)),
            };

            const dateInfo = formatDueDate(enhancedTodo.dueDate);
            const priorityColor = getPriorityColor(enhancedTodo.priority);

            return (
              <div
                key={todo.id}
                className='to-do-bro__task-item'
                data-priority={enhancedTodo.priority}
              >
                {/* Drag handle - visible on hover */}
                <div className='to-do-bro__task-drag-handle'>
                  <svg width='12' height='16' viewBox='0 0 12 16' fill='none'>
                    <circle cx='3' cy='3' r='1.5' fill='currentColor' />
                    <circle cx='9' cy='3' r='1.5' fill='currentColor' />
                    <circle cx='3' cy='8' r='1.5' fill='currentColor' />
                    <circle cx='9' cy='8' r='1.5' fill='currentColor' />
                    <circle cx='3' cy='13' r='1.5' fill='currentColor' />
                    <circle cx='9' cy='13' r='1.5' fill='currentColor' />
                  </svg>
                </div>

                {/* Checkbox */}
                <button
                  className='to-do-bro__task-checkbox'
                  style={{ borderColor: priorityColor }}
                  onClick={() => handleTaskAction(todo.id, 'toggle')}
                  aria-label={`Mark "${todo.text}" as complete`}
                >
                  {todo.completed && (
                    <svg width='12' height='12' viewBox='0 0 12 12' fill='none'>
                      <path
                        d='M2 6l2.5 2.5L10 3'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  )}
                </button>

                {/* Task content */}
                <div
                  className='to-do-bro__task-content'
                  onClick={() => handleTaskAction(todo.id, 'view')}
                >
                  <div className='to-do-bro__task-text'>
                    {enhancedTodo.text}
                  </div>
                  {enhancedTodo.description && (
                    <div className='to-do-bro__task-description'>
                      {enhancedTodo.description}
                    </div>
                  )}

                  {/* Date and icons */}
                  {(dateInfo ||
                    enhancedTodo.hasReminder ||
                    enhancedTodo.hasRepeat ||
                    enhancedTodo.isRecurring) && (
                    <div className='to-do-bro__task-meta'>
                      {dateInfo && (
                        <span
                          className='to-do-bro__task-date'
                          style={{ color: dateInfo.color }}
                        >
                          📅 {dateInfo.text}
                        </span>
                      )}

                      <div className='to-do-bro__task-icons'>
                        {enhancedTodo.hasRepeat && (
                          <span
                            className='to-do-bro__task-icon'
                            title='Repeating task'
                          >
                            ↻
                          </span>
                        )}
                        {enhancedTodo.hasReminder && (
                          <span
                            className='to-do-bro__task-icon'
                            title='Has reminder'
                          >
                            🔔
                          </span>
                        )}
                        {enhancedTodo.isRecurring && (
                          <span
                            className='to-do-bro__task-icon'
                            title='Recurring task'
                          >
                            📅
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action buttons - visible on hover */}
                <div className='to-do-bro__task-actions'>
                  <button
                    className='to-do-bro__task-action-btn'
                    onClick={() => handleTaskAction(todo.id, 'edit')}
                    title='Edit task'
                  >
                    <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
                      <path
                        d='M15 3L17 5L7 15H5V13L15 3Z'
                        stroke='currentColor'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </button>

                  <button
                    className='to-do-bro__task-action-btn to-do-bro__task-more-btn'
                    onClick={() => handleTaskAction(todo.id, 'more')}
                    title='More options'
                  >
                    <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
                      <circle cx='10' cy='5' r='2' fill='currentColor' />
                      <circle cx='10' cy='10' r='2' fill='currentColor' />
                      <circle cx='10' cy='15' r='2' fill='currentColor' />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TaskView Modal */}
      {selectedTask && (
        <TaskView
          task={selectedTask}
          onClose={handleCloseTaskView}
          onToggleComplete={onToggleComplete}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
        />
      )}
    </div>
  );
};

MainView.propTypes = {
  todos: PropTypes.array.isRequired,
  onNavigate: PropTypes.func.isRequired,
  onToggleComplete: PropTypes.func,
  onEditTask: PropTypes.func,
  onDeleteTask: PropTypes.func,
};

export default MainView;
