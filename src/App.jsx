import { useEffect, useState } from 'react';

import DatePicker from './components/DatePicker';
import MainView from './components/MainView';
import TaskForm from './components/TaskForm';
import WebsiteForm from './components/WebsiteForm';
import useI18n from './hooks/useI18n';
import useStorageService from './hooks/useStorageService';

function App() {
  const [currentView, setCurrentView] = useState('main');
  const [todos, setTodos] = useState([]);
  const { t } = useI18n();
  const storageService = useStorageService();

  useEffect(() => {
    // Load initial data
    const loadData = async () => {
      try {
        const loadedTodos = await storageService.loadTodos();
        setTodos(loadedTodos);
      } catch (error) {
        console.error('Error loading todos:', error);
      }
    };

    loadData();
  }, [storageService]);

  const handleViewChange = viewName => {
    setCurrentView(viewName);
  };

  const handleAddTask = async taskData => {
    try {
      const newTask = {
        id: Date.now(),
        ...taskData,
        completed: false,
        createdAt: new Date().toISOString(),
        type: 'task',
      };

      const updatedTodos = [...todos, newTask];
      await storageService.saveTodos(updatedTodos);
      setTodos(updatedTodos);
      setCurrentView('main');

      // Show notification
      if (chrome.notifications) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'assets/icons/todobro_48.png',
          title: t('appName'),
          message: `${t('taskAdded')}: "${taskData.text}"`,
        });
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleAddWebsite = async websiteData => {
    try {
      const newWebsite = {
        id: Date.now(),
        ...websiteData,
        completed: false,
        createdAt: new Date().toISOString(),
        type: 'website',
      };

      const updatedTodos = [...todos, newWebsite];
      await storageService.saveTodos(updatedTodos);
      setTodos(updatedTodos);
      setCurrentView('main');

      // Show notification
      if (chrome.notifications) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'assets/icons/todobro_48.png',
          title: t('appName'),
          message: `${t('websiteAdded')}: "${websiteData.title}"`,
        });
      }
    } catch (error) {
      console.error('Error adding website:', error);
    }
  };

  const handleToggleComplete = async taskId => {
    try {
      const updatedTodos = todos.map(todo =>
        todo.id === taskId ? { ...todo, completed: !todo.completed } : todo
      );
      await storageService.saveTodos(updatedTodos);
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  const handleEditTask = taskId => {
    // For now, just log the action - you can implement edit functionality later
    console.log('Edit task:', taskId);
    // Future: setCurrentView('editTask') and pass taskId
  };

  const handleDeleteTask = async taskId => {
    try {
      const updatedTodos = todos.filter(todo => todo.id !== taskId);
      await storageService.saveTodos(updatedTodos);
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'addTask':
        return (
          <TaskForm
            onSubmit={handleAddTask}
            onCancel={() => setCurrentView('main')}
          />
        );
      case 'addWebsite':
        return (
          <WebsiteForm
            onSubmit={handleAddWebsite}
            onCancel={() => setCurrentView('main')}
          />
        );
      case 'datePicker':
        return (
          <DatePicker
            onSelect={() => {
              // Handle date selection
              setCurrentView('addTask');
            }}
            onCancel={() => setCurrentView('addTask')}
          />
        );
      default:
        return (
          <MainView
            todos={todos}
            onNavigate={handleViewChange}
            onToggleComplete={handleToggleComplete}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />
        );
    }
  };

  return <div className='to-do-bro'>{renderCurrentView()}</div>;
}

export default App;
