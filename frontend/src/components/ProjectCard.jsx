import React from 'react';
import { Link } from 'react-router-dom';

export default function ProjectCard({ project, onDelete, onEdit }) {
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

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="card project-card">
      <div className="card-header">
        <h3 className="card-title">
          <Link to={`/projects/${project.id}`}>{project.name}</Link>
        </h3>
        {getStatusBadge(project.status)}
      </div>

      <p className="card-description">
        {project.description || 'No description provided.'}
      </p>

      <div className="card-meta">
        <div className="meta-item">
          <span className="meta-label">Start Date:</span>
          <span>{formatDate(project.startDate)}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">End Date:</span>
          <span>{formatDate(project.endDate)}</span>
        </div>
      </div>

      <div className="card-actions">
        <Link to={`/projects/${project.id}`} className="btn btn-secondary btn-sm">
          View Tasks
        </Link>
        <button
          className="btn btn-outline btn-sm"
          onClick={() => onEdit(project)}
        >
          Edit
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(project.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
