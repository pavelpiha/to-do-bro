import PropTypes from 'prop-types';
import { useState } from 'react';

import './TaskView.css';

const TaskView = ({
  task,
  onClose,
  _onEditTask,
  _onDeleteTask,
  onToggleComplete,
}) => {
  const [comment, setComment] = useState('');

  if (!task) {
    return null;
  }

  const formatDueDate = dueDate => {
    if (!dueDate) {
      return null;
    }

    const date = new Date(dueDate);
    const dayName = date.toLocaleDateString([], { weekday: 'long' });
    const time = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${dayName} ${time}`;
  };

  const getPriorityText = priority => {
    switch (priority) {
      case 'high':
        return 'Priority 1';
      case 'medium':
        return 'Priority 2';
      case 'low':
        return 'Priority 3';
      default:
        return 'No Priority';
    }
  };

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

  const handleCommentSubmit = e => {
    e.preventDefault();
    // TODO: Implement comment functionality
    setComment('');
  };

  const handleAddSubTask = () => {
    // TODO: Implement add sub-task functionality
  };

  const handleAddLabels = () => {
    // TODO: Implement add labels functionality
  };

  const handleAddLocation = () => {
    // TODO: Implement add location functionality
  };

  const handleAddReminder = () => {
    // TODO: Implement add reminder functionality
  };

  return (
    <div className='task-view'>
      <div className='task-view__overlay' onClick={onClose} />

      <div className='task-view__content'>
        {/* Header */}
        <div className='task-view__header'>
          <div className='task-view__header-left'>
            <svg
              className='task-view__inbox-icon'
              width='20'
              height='20'
              viewBox='0 0 20 20'
              fill='none'
            >
              <path
                d='M3 4a1 1 0 011-1h12a1 1 0 011 1v3H3V4zM3 9h4l1 2h4l1-2h4v7a1 1 0 01-1 1H4a1 1 0 01-1-1V9z'
                stroke='currentColor'
                strokeWidth='1.5'
                fill='none'
              />
            </svg>
            <span className='task-view__inbox-label'>Inbox</span>
          </div>

          <div className='task-view__header-right'>
            <button className='task-view__nav-btn' title='Previous task'>
              <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                <path
                  d='M10 12L6 8l4-4'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </button>

            <button className='task-view__nav-btn' title='Next task'>
              <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                <path
                  d='M6 4l4 4-4 4'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </button>

            <button className='task-view__menu-btn' title='More options'>
              <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                <circle cx='8' cy='3' r='1.5' fill='currentColor' />
                <circle cx='8' cy='8' r='1.5' fill='currentColor' />
                <circle cx='8' cy='13' r='1.5' fill='currentColor' />
              </svg>
            </button>

            <button
              className='task-view__close-btn'
              onClick={onClose}
              title='Close'
            >
              <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                <path
                  d='M12 4L4 12M4 4l8 8'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Task Title */}
        <div className='task-view__title-section'>
          <button
            className='task-view__checkbox'
            style={{ borderColor: getPriorityColor(task.priority) }}
            onClick={() => onToggleComplete && onToggleComplete(task.id)}
            aria-label={`Mark "${task.text}" as complete`}
          >
            {task.completed && (
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

          <div className='task-view__title-content'>
            <h1 className='task-view__title'>{task.text}</h1>
            {task.description && (
              <p className='task-view__description'>{task.description}</p>
            )}
          </div>
        </div>

        {/* Task Details */}
        <div className='task-view__details'>
          {/* Inbox */}
          <div className='task-view__detail-item'>
            <svg
              className='task-view__detail-icon'
              width='16'
              height='16'
              viewBox='0 0 16 16'
              fill='none'
            >
              <path
                d='M2 3a1 1 0 011-1h10a1 1 0 011 1v2H2V3zM2 7h3l1 1.5h4L11 7h3v6a1 1 0 01-1 1H3a1 1 0 01-1-1V7z'
                stroke='currentColor'
                strokeWidth='1.5'
                fill='none'
              />
            </svg>
            <span className='task-view__detail-text'>Inbox</span>
          </div>

          {/* Schedule */}
          {task.dueDate && (
            <div className='task-view__detail-item'>
              <svg
                className='task-view__detail-icon task-view__detail-icon--purple'
                width='16'
                height='16'
                viewBox='0 0 16 16'
                fill='none'
              >
                <rect
                  x='2'
                  y='3'
                  width='12'
                  height='10'
                  rx='1'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  fill='none'
                />
                <path
                  d='M5 1v2M11 1v2M2 6h12'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                />
              </svg>
              <span className='task-view__detail-text'>
                {formatDueDate(task.dueDate)}
              </span>
              {task.repeat && (
                <svg
                  className='task-view__repeat-icon'
                  width='14'
                  height='14'
                  viewBox='0 0 14 14'
                  fill='none'
                >
                  <path
                    d='M11 4L7 8l-4-4'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    transform='rotate(90 7 7)'
                  />
                </svg>
              )}
            </div>
          )}

          {/* Deadline */}
          <div className='task-view__detail-item'>
            <svg
              className='task-view__detail-icon'
              width='16'
              height='16'
              viewBox='0 0 16 16'
              fill='none'
            >
              <circle
                cx='8'
                cy='8'
                r='6'
                stroke='currentColor'
                strokeWidth='1.5'
                fill='none'
              />
              <path
                d='M8 4v4l3 3'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            <span className='task-view__detail-text'>Deadline</span>
            <span className='task-view__premium-star'>★</span>
          </div>

          {/* Priority */}
          {task.priority && (
            <div className='task-view__detail-item'>
              <svg
                className='task-view__detail-icon task-view__detail-icon--orange'
                width='16'
                height='16'
                viewBox='0 0 16 16'
                fill='none'
              >
                <path
                  d='M8 2l1.5 4.5h4.5l-3.5 2.5 1.5 4.5L8 11l-3.5 2.5L6 9 2.5 6.5h4.5L8 2z'
                  fill='currentColor'
                />
              </svg>
              <span className='task-view__detail-text'>
                {getPriorityText(task.priority)}
              </span>
            </div>
          )}

          {/* Add Labels */}
          <div
            className='task-view__detail-item task-view__detail-item--action'
            onClick={handleAddLabels}
          >
            <svg
              className='task-view__detail-icon'
              width='16'
              height='16'
              viewBox='0 0 16 16'
              fill='none'
            >
              <path
                d='M2 8l6-6h6v6l-6 6-6-6z'
                stroke='currentColor'
                strokeWidth='1.5'
                fill='none'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <circle cx='11' cy='5' r='1' fill='currentColor' />
            </svg>
            <span className='task-view__detail-text task-view__detail-text--action'>
              Add labels
            </span>
          </div>

          {/* Reminders */}
          <div className='task-view__detail-section'>
            <div className='task-view__detail-item'>
              <svg
                className='task-view__detail-icon'
                width='16'
                height='16'
                viewBox='0 0 16 16'
                fill='none'
              >
                <path
                  d='M8 2a4 4 0 014 4c0 2-1 3-1 3H5s-1-1-1-3a4 4 0 014-4zM6 13h4'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  fill='none'
                />
              </svg>
              <span className='task-view__detail-text'>At time of task</span>
            </div>
            <button className='task-view__add-btn' onClick={handleAddReminder}>
              <svg width='12' height='12' viewBox='0 0 12 12' fill='none'>
                <path
                  d='M6 2v8M2 6h8'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                />
              </svg>
              Add
            </button>
          </div>

          {/* Add Location */}
          <div
            className='task-view__detail-item task-view__detail-item--action'
            onClick={handleAddLocation}
          >
            <svg
              className='task-view__detail-icon'
              width='16'
              height='16'
              viewBox='0 0 16 16'
              fill='none'
            >
              <path
                d='M8 2a4 4 0 014 4c0 3-4 8-4 8s-4-5-4-8a4 4 0 014-4z'
                stroke='currentColor'
                strokeWidth='1.5'
                fill='none'
              />
              <circle cx='8' cy='6' r='1.5' fill='currentColor' />
            </svg>
            <span className='task-view__detail-text task-view__detail-text--action'>
              Add location
            </span>
            <span className='task-view__premium-star'>★</span>
          </div>

          {/* Add Sub-task */}
          <div
            className='task-view__detail-item task-view__detail-item--action'
            onClick={handleAddSubTask}
          >
            <svg
              className='task-view__detail-icon'
              width='16'
              height='16'
              viewBox='0 0 16 16'
              fill='none'
            >
              <path
                d='M8 3v10M3 8h10'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
              />
            </svg>
            <span className='task-view__detail-text task-view__detail-text--action'>
              Add sub-task
            </span>
          </div>
        </div>

        {/* Comment Section */}
        <div className='task-view__comment-section'>
          <div className='task-view__comment-avatar'>
            <span>C</span>
          </div>
          <form
            className='task-view__comment-form'
            onSubmit={handleCommentSubmit}
          >
            <input
              type='text'
              className='task-view__comment-input'
              placeholder='Comment'
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
            <button
              type='button'
              className='task-view__attachment-btn'
              title='Add attachment'
            >
              <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                <path
                  d='M7 9l3-3a2 2 0 00-3-3L3 7a4 4 0 004 4l4-4a6 6 0 00-8-8'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  fill='none'
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

TaskView.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    text: PropTypes.string.isRequired,
    description: PropTypes.string,
    completed: PropTypes.bool,
    priority: PropTypes.oneOf(['high', 'medium', 'low']),
    dueDate: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
    repeat: PropTypes.string,
    reminders: PropTypes.array,
  }),
  onClose: PropTypes.func.isRequired,
  _onEditTask: PropTypes.func,
  _onDeleteTask: PropTypes.func,
  onToggleComplete: PropTypes.func,
};

export default TaskView;
