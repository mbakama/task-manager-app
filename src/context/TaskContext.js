import React, { createContext, useContext, useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import { v4 as uuidv4 } from 'uuid';

const TaskContext = createContext();

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });

  // Colonnes du tableau Kanban
  const columns = {
    todo: { id: 'todo', title: 'À faire', color: '#007bff', bgColor: '#007bff', icon: 'bi-list-task' },
    inProgress: { id: 'inProgress', title: 'En cours', color: '#fd7e14', bgColor: '#fd7e14', icon: 'bi-arrow-clockwise' },
    review: { id: 'review', title: 'En révision', color: '#6f42c1', bgColor: '#6f42c1', icon: 'bi-eye' },
    done: { id: 'done', title: 'Terminé', color: '#28a745', bgColor: '#28a745', icon: 'bi-check-circle' }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const loadedTasks = await taskService.getTasks();
      setTasks(loadedTasks);
    } catch (error) {
      showToast('Erreur lors du chargement des tâches', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    const task = {
      id: uuidv4(),
      ...taskData,
      status: 'todo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      await taskService.createTask(task);
      setTasks(prev => [...prev, task]);
      showToast('Tâche créée avec succès', 'success');
      return task;
    } catch (error) {
      showToast('Erreur lors de la création de la tâche', 'danger');
      throw error;
    }
  };

  const updateTask = async (updatedTask) => {
    try {
      const taskWithTimestamp = {
        ...updatedTask,
        updatedAt: new Date().toISOString()
      };
      
      await taskService.updateTask(taskWithTimestamp);
      setTasks(prev => prev.map(task => 
        task.id === updatedTask.id ? taskWithTimestamp : task
      ));
      showToast('Tâche mise à jour avec succès', 'success');
      return taskWithTimestamp;
    } catch (error) {
      showToast('Erreur lors de la mise à jour', 'danger');
      throw error;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      showToast('Tâche supprimée avec succès', 'success');
    } catch (error) {
      showToast('Erreur lors de la suppression', 'danger');
      throw error;
    }
  };

  const moveTask = async (taskId, newStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedTask = {
      ...task,
      status: newStatus,
      updatedAt: new Date().toISOString()
    };

    try {
      await taskService.updateTask(updatedTask);
      setTasks(prev => prev.map(t => 
        t.id === taskId ? updatedTask : t
      ));
      showToast('Tâche déplacée avec succès', 'success');
    } catch (error) {
      showToast('Erreur lors du déplacement', 'danger');
      loadTasks(); // Recharger en cas d'erreur
    }
  };

  const showToast = (message, variant) => {
    setToast({ show: true, message, variant });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  // Statistiques
  const getStats = () => {
    const stats = taskService.getStats();
    return {
      ...stats,
      completionRate: stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0,
      activeRate: stats.total > 0 ? Math.round((stats.inProgress / stats.total) * 100) : 0
    };
  };

  // Filtres et recherche
  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const getTasksByPriority = (priority) => {
    return tasks.filter(task => task.priority === priority);
  };

  const getTasksByAssignee = (assignee) => {
    return tasks.filter(task => task.assignee === assignee);
  };

  const searchTasks = (query) => {
    if (!query.trim()) return tasks;
    
    const lowercaseQuery = query.toLowerCase();
    return tasks.filter(task => 
      task.title.toLowerCase().includes(lowercaseQuery) ||
      task.description.toLowerCase().includes(lowercaseQuery) ||
      task.assignee.toLowerCase().includes(lowercaseQuery)
    );
  };

  const value = {
    // État
    tasks,
    loading,
    toast,
    columns,
    
    // Actions
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    showToast,
    hideToast,
    
    // Utilitaires
    getStats,
    getTasksByStatus,
    getTasksByPriority,
    getTasksByAssignee,
    searchTasks
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};