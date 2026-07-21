import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../api/dashboardApi';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardStats = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await dashboardApi.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch dashboard metrics:', err);
      setError(err.response?.data?.error || 'Unable to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Welcome back, {user?.fullName}! 👋</h1>
          <p className="page-subtitle">Here is an overview of your projects and task statistics.</p>
        </div>
        <div className="dashboard-actions">
          <Link to="/projects" className="btn btn-primary">
            + New Project
          </Link>
        </div>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />

      {stats && (
        <div className="metrics-grid">
          {/* Total Projects Card */}
          <div className="metric-card card-purple">
            <div className="metric-icon">📁</div>
            <div className="metric-content">
              <span className="metric-value">{stats.totalProjects}</span>
              <span className="metric-label">Total Projects</span>
            </div>
          </div>

          {/* Total Tasks Card */}
          <div className="metric-card card-blue">
            <div className="metric-icon">✅</div>
            <div className="metric-content">
              <span className="metric-value">{stats.totalTasks}</span>
              <span className="metric-label">Total Tasks</span>
            </div>
          </div>

          {/* Projects In Progress Card */}
          <div className="metric-card card-orange">
            <div className="metric-icon">🚀</div>
            <div className="metric-content">
              <span className="metric-value">{stats.projectsInProgress}</span>
              <span className="metric-label">Projects In Progress</span>
            </div>
          </div>

          {/* Completed Tasks Card */}
          <div className="metric-card card-green">
            <div className="metric-icon">🎯</div>
            <div className="metric-content">
              <span className="metric-value">{stats.tasksCompleted}</span>
              <span className="metric-label">Tasks Completed</span>
            </div>
          </div>

          {/* Pending Tasks Card */}
          <div className="metric-card card-amber">
            <div className="metric-icon">⏳</div>
            <div className="metric-content">
              <span className="metric-value">{stats.tasksPending}</span>
              <span className="metric-label">Pending Tasks</span>
            </div>
          </div>

          {/* Completed Projects Card */}
          <div className="metric-card card-teal">
            <div className="metric-icon">🏆</div>
            <div className="metric-content">
              <span className="metric-value">{stats.projectsCompleted}</span>
              <span className="metric-label">Projects Completed</span>
            </div>
          </div>
        </div>
      )}

      <div className="quick-nav-section">
        <h2>Quick Actions</h2>
        <div className="quick-actions-grid">
          <Link to="/projects" className="action-card">
            <h3>Manage Projects</h3>
            <p>View, search, or create project management workspaces.</p>
          </Link>

          <Link to="/tasks" className="action-card">
            <h3>Manage Tasks</h3>
            <p>Filter tasks by status, priority, or project assignments.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
