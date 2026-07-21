import React from 'react';

export default function TaskCard({ task, onDelete, onEdit, onStatusChange }) {
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'HIGH':
        return <span className="badge badge-danger">High Priority</span>;
      case 'MEDIUM':
        return <span className="badge badge-warning">Medium Priority</span>;
      default:
        return <span className="badge badge-info">Low Priority</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="badge badge-success">Completed</span>;
      case 'IN_PROGRESS':
        return <span className="badge badge-warning">In Progress</span>;
      default:
        return <span className="badge badge-neutral">Pending</span>;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No due date';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="card task-card">
      <div className="card-header">
        <h4 className="card-title">{task.name}</h4>
        <div className="badges-group">
          {getPriorityBadge(task.priority)}
          {getStatusBadge(task.status)}
        </div>
      </div>

      {task.project?.name && (
        <div className="task-project-name">
          📁 Project: <strong>{task.project.name}</strong>
        </div>
      )}

      <p className="card-description">
        {task.description || 'No description provided.'}
      </p>

      <div className="card-meta">
        <span className="meta-label">Due Date:</span> {formatDate(task.dueDate)}
      </div>

      <div className="card-actions">
        <select
          className="form-control select-sm"
          value={task.status}
          onChange={(e) => onStatusChange(task, e.target.value)}
        >
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>

        <button
          className="btn btn-outline btn-sm"
          onClick={() => onEdit(task)}
        >
          Edit
        </button>

        <button
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
