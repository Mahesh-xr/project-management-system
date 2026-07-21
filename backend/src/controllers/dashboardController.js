import prisma from '../config/prisma.js';

// Retrieve summary stats for the dashboard using database-level aggregations
export async function getDashboardStats(req, res, next) {
  try {
    const userId = req.userId;

    // 1. Count total projects for user
    const totalProjects = await prisma.project.count({
      where: { userId }
    });

    // 2. Count total tasks whose project is owned by user
    const totalTasks = await prisma.task.count({
      where: {
        project: {
          userId
        }
      }
    });

    // 3. Group projects by status using Prisma's groupBy aggregation
    const projectGroups = await prisma.project.groupBy({
      by: ['status'],
      where: { userId },
      _count: {
        id: true
      }
    });

    // 4. Group tasks by status using Prisma's groupBy aggregation
    const taskGroups = await prisma.task.groupBy({
      by: ['status'],
      where: {
        project: {
          userId
        }
      },
      _count: {
        id: true
      }
    });

    // Parse aggregated counts (default to 0 if status group is missing)
    const projectsNotStarted = projectGroups.find(g => g.status === 'NOT_STARTED')?._count.id || 0;
    const projectsInProgress = projectGroups.find(g => g.status === 'IN_PROGRESS')?._count.id || 0;
    const projectsCompleted = projectGroups.find(g => g.status === 'COMPLETED')?._count.id || 0;

    const tasksPending = taskGroups.find(g => g.status === 'PENDING')?._count.id || 0;
    const tasksInProgress = taskGroups.find(g => g.status === 'IN_PROGRESS')?._count.id || 0;
    const tasksCompleted = taskGroups.find(g => g.status === 'COMPLETED')?._count.id || 0;

    return res.json({
      totalProjects,
      totalTasks,
      projectsNotStarted,
      projectsInProgress,
      projectsCompleted,
      tasksPending,
      tasksInProgress,
      tasksCompleted
    });
  } catch (error) {
    next(error);
  }
}
