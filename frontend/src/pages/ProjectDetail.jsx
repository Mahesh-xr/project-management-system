import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { projectApi } from '../api/projectApi';
import { taskApi } from '../api/taskApi';
import TaskCard from '../components/TaskCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Task form modal
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskFormData, setTaskFormData] = useState({
    name: '',
    description: '',
    priority: 'MEDIUM',
    status: 'PENDING',
    dueDate: ''
  });
  const [taskFormError, setTaskFormError] = useState('');
  const [taskSubmitting, setTaskSubmitting] = useState(false);

  const fetchProjectDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await projectApi.getProjectById(id);
      setProject(data);
      setTasks(data.tasks || []);
    } catch (err) {
      console.error('Error fetching project detail:', err);
      setError(err.response?.data?.error || 'Failed to load project details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const handleOpenCreateTaskModal = () => {
    setEditingTask(null);
    setTaskFormData({
      name: '',
      description: '',
      priority: 'MEDIUM',
      status: 'PENDING',
      dueDate: ''
    });
    setTaskFormError('');
    setShowTaskModal(true);
  };

  const handleOpenEditTaskModal = (task) => {
    setEditingTask(task);
    setTaskFormData({
      name: task.name || '',
      description: task.description || '',
      priority: task.priority || 'MEDIUM',
      status: task.status || 'PENDING',
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().substring(0, 10) : ''
    });
    setTaskFormError('');
    setShowTaskModal(true);
  };

  const handleTaskDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await taskApi.deleteTask(taskId);
      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
      setError(err.response?.data?.error || 'Failed to delete task.');
    }
  };

  const handleTaskStatusChange = async (task, newStatus) => {
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

  const handleTaskFormSubmit = async (e) => {
    e.preventDefault();
    setTaskFormError('');

    if (!taskFormData.name.trim()) {
      setTaskFormError('Task name is required.');
      return;
    }

    setTaskSubmitting(true);
    try {
      if (editingTask) {
        const updated = await taskApi.updateTask(editingTask.id, taskFormData);
        setTasks(tasks.map((t) => (t.id === editingTask.id ? updated : t)));
      } else {
        const created = await taskApi.createTask({
          ...taskFormData,
          projectId: parseInt(id)
        });
        setTasks([created, ...tasks]);
      }
      setShowTaskModal(false);
    } catch (err) {
      console.error('Error saving task:', err);
      setTaskFormError(err.response?.data?.error || 'Failed to save task.');
    } finally {
      setTaskSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="badge badge-success">Completed</span>;
      case 'IN_PROGRESS':
        return <span className="badge badge-warning">In Progress</span>;
      default:
        return <span className="badge badge-neutral">Not Started</span>;
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  if (error || !project) {
    return (
      <div className="page-container">
        <ErrorMessage message={error || 'Project not found.'} />
        <button className="btn btn-outline" onClick={() => navigate('/projects')}>
          &larr; Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="breadcrumb">
        <Link to="/projects">&larr; Back to Projects</Link>
      </div>

      <div className="project-detail-header">
        <div className="project-detail-title-group">
          <h1>{project.name}</h1>
          {getStatusBadge(project.status)}
        </div>
        <p className="project-detail-description">
          {project.description || 'No description provided.'}
        </p>

        <div className="project-detail-dates">
          <span>
            🗓️ Start: {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}
          </span>
          <span>
            🏁 End: {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}
          </span>
        </div>
      </div>

      <div className="section-header">
        <h2>Tasks ({tasks.length})</h2>
        <button className="btn btn-primary" onClick={handleOpenCreateTaskModal}>
          + Add Task
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <h3>No Tasks Yet</h3>
          <p>Add tasks to track progress for this project.</p>
          <button className="btn btn-primary" onClick={handleOpenCreateTaskModal}>
            + Add Task
          </button>
        </div>
      ) : (
        <div className="grid grid-2">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={handleTaskDelete}
              onEdit={handleOpenEditTaskModal}
              onStatusChange={handleTaskStatusChange}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Task Modal */}
      {showTaskModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingTask ? 'Edit Task' : 'Add New Task'}</h2>
              <button className="modal-close" onClick={() => setShowTaskModal(false)}>
                &times;
              </button>
            </div>

            <ErrorMessage message={taskFormError} onClose={() => setTaskFormError('')} />

            <form onSubmit={handleTaskFormSubmit} className="modal-form">
              <div className="form-group">
                <label>Task Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Design Wireframes"
                  value={taskFormData.name}
                  onChange={(e) => setTaskFormData({ ...taskFormData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Specific instructions or details..."
                  value={taskFormData.description}
                  onChange={(e) => setTaskFormData({ ...taskFormData, description: e.target.value })}
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group col">
                  <label>Priority</label>
                  <select
                    className="form-control"
                    value={taskFormData.priority}
                    onChange={(e) => setTaskFormData({ ...taskFormData, priority: e.target.value })}
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
                    value={taskFormData.status}
                    onChange={(e) => setTaskFormData({ ...taskFormData, status: e.target.value })}
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
                  value={taskFormData.dueDate}
                  onChange={(e) => setTaskFormData({ ...taskFormData, dueDate: e.target.value })}
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowTaskModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={taskSubmitting}>
                  {taskSubmitting ? <LoadingSpinner /> : editingTask ? 'Save Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
