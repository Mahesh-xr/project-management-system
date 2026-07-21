import prisma from '../config/prisma.js';

// Retrieve all tasks belonging to the user (filtered by project owner)
export async function getAllTasks(req, res, next) {
  try {
    const { search, status, priority, projectId } = req.query;

    // Scoped query structure: Using Prisma relation query to filter
    // tasks whose parent project belongs to the current logged-in user.
    const where = {
      project: {
        userId: req.userId
      }
    };

    if (projectId) {
      where.projectId = parseInt(projectId);
    }
    if (status) {
      where.status = status;
    }
    if (priority) {
      where.priority = priority;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        project: {
          select: { name: true } // Include project name for convenience
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json(tasks);
  } catch (error) {
    next(error);
  }
}

// Retrieve details of a single task
export async function getTaskById(req, res, next) {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid task ID.' });
    }

    // Scoped check: the task's project must belong to req.userId
    const task = await prisma.task.findFirst({
      where: {
        id,
        project: {
          userId: req.userId
        }
      },
      include: {
        project: {
          select: { id: true, name: true }
        }
      }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found or access denied.' });
    }

    return res.json(task);
  } catch (error) {
    next(error);
  }
}

// Create a new task within a project
export async function createTask(req, res, next) {
  try {
    const { projectId, name, description, priority, status, dueDate } = req.body;

    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required.' });
    }

    // Security Check: Verify that the parent project actually belongs to the logged-in user
    const project = await prisma.project.findFirst({
      where: {
        id: parseInt(projectId),
        userId: req.userId
      }
    });

    if (!project) {
      return res.status(404).json({ error: 'Parent project not found or access denied.' });
    }

    const task = await prisma.task.create({
      data: {
        projectId: parseInt(projectId),
        name,
        description,
        priority: priority || 'MEDIUM',
        status: status || 'PENDING',
        dueDate: dueDate ? new Date(dueDate) : null
      }
    });

    return res.status(201).json(task);
  } catch (error) {
    next(error);
  }
}

// Update an existing task
export async function updateTask(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const { name, description, priority, status, dueDate } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid task ID.' });
    }

    // Security Check: Verify task ownership via project relation
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        project: {
          userId: req.userId
        }
      }
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found or access denied.' });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        name,
        description,
        priority,
        status,
        dueDate: dueDate ? new Date(dueDate) : null
      }
    });

    return res.json(updatedTask);
  } catch (error) {
    next(error);
  }
}

// Delete a task
export async function deleteTask(req, res, next) {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid task ID.' });
    }

    // Security Check: Verify task ownership before delete
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        project: {
          userId: req.userId
        }
      }
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found or access denied.' });
    }

    await prisma.task.delete({
      where: { id }
    });

    return res.json({ message: 'Task deleted successfully.' });
  } catch (error) {
    next(error);
  }
}

