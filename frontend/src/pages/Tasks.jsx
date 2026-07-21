import React, { useState, useEffect } from 'react';
import { taskApi } from '../api/taskApi';
import { projectApi } from '../api/projectApi';
import TaskCard from '../components/TaskCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter state
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    projectId: ''
  });

  // Modal / Form state
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priority: 'MEDIUM',
    status: 'PENDING',
    dueDate: '',
    projectId: ''
  });
  const [formError, setFormError] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await taskApi.getTasks(filters);
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.response?.data?.error || 'Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectsList = async () => {
    try {
      const list = await projectApi.getProjects();
      setProjects(list);
    } catch (err) {
      console.error('Failed to load projects list for task assignment:', err);
    }
  };

  useEffect(() => {
    fetchProjectsList();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchTasks();
    }, 300); // 300ms search debounce
    return () => clearTimeout(handler);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setFormData({
      name: '',
      description: '',
      priority: 'MEDIUM',
      status: 'PENDING',
      dueDate: '',
      projectId: projects.length > 0 ? projects[0].id : ''
    });
    setFormError('');
    setShowModal(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setFormData({
      name: task.name || '',
      description: task.description || '',
      priority: task.priority || 'MEDIUM',
      status: task.status || 'PENDING',
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().substring(0, 10) : '',
      projectId: task.projectId || ''
    });
    setFormError('');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await taskApi.deleteTask(id);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
      setError(err.response?.data?.error || 'Failed to delete task.');
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      const updated = await taskApi.updateTask(task.id, {
        ...task,
        status: newStatus
      });
      setTasks(tasks.map((t) => (t.id === task.id ? updated : t)));
    } catch (err) {
      console.error('Error updating status:', err);
      setError(err.response?.data?.error || 'Failed to update task status.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('Task name is required.');
      return;
    }

    if (!editingTask && !formData.projectId) {
      setFormError('Please select a parent project for this task.');
      return;
    }

    setFormSubmitting(true);
    try {
      if (editingTask) {
        const updated = await taskApi.updateTask(editingTask.id, formData);
        setTasks(tasks.map((t) => (t.id === editingTask.id ? updated : t)));
      } else {
        const created = await taskApi.createTask(formData);
        setTasks([created, ...tasks]);
      }
      setShowModal(false);
    } catch (err) {
      console.error('Error saving task:', err);
      setFormError(err.response?.data?.error || 'Failed to save task.');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="page-subtitle">Track, filter, and complete your tasks across projects</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleOpenCreateModal}
          disabled={projects.length === 0}
        >
          + Create Task
        </button>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />

      {/* Multi-criteria Search & Filters */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <input
            type="text"
            className="form-control"
            placeholder="Search tasks by name or description..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        <div className="filter-select-wrapper">
          <select
            className="form-control"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div className="filter-select-wrapper">
          <select
            className="form-control"
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        <div className="filter-select-wrapper">
          <select
            className="form-control"
            value={filters.projectId}
            onChange={(e) => handleFilterChange('projectId', e.target.value)}
          >
            <option value="">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <h3>No Tasks Found</h3>
          <p>
            {projects.length === 0
              ? 'Please create a project first before creating tasks.'
              : 'Try clearing your filters or create a new task.'}
          </p>
          {projects.length > 0 && (
            <button className="btn btn-primary" onClick={handleOpenCreateModal}>
              + Create Task
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-2">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={handleDelete}
              onEdit={handleOpenEditModal}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingTask ? 'Edit Task' : 'Create New Task'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>

            <ErrorMessage message={formError} onClose={() => setFormError('')} />

            <form onSubmit={handleFormSubmit} className="modal-form">
              <div className="form-group">
                <label>Task Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Implement JWT Auth"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              {!editingTask && (
                <div className="form-group">
                  <label>Parent Project *</label>
                  <select
                    className="form-control"
                    value={formData.projectId}
                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                    required
                  >
                    <option value="" disabled>
                      Select a project
                    </option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Detailed description of task..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group col">
                  <label>Priority</label>
                  <select
                    className="form-control"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>

                <div className="form-group col">
                  <label>Status</label>
                  <select
                    className="form-control"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={formSubmitting}>
                  {formSubmitting ? <LoadingSpinner /> : editingTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
