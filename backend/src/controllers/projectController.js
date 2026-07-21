import prisma from '../config/prisma.js';

// Retrieve all projects belonging to the logged-in user
export async function getAllProjects(req, res, next) {
  try {
    const { search, status } = req.query;

    // Start building the query filter. Scoping is the first rule:
    // ALL queries must filter by the current authenticated user's ID.
    const where = {
      userId: req.userId
    };

    // Filter by project status if provided
    if (status) {
      where.status = status;
    }

    // Perform case-insensitive search in title or description if provided
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return res.json(projects);
  } catch (error) {
    next(error);
  }
}

// Retrieve a single project details by ID
export async function getProjectById(req, res, next) {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid project ID.' });
    }

    // Scoped query: ensures user can only access their own projects
    const project = await prisma.project.findFirst({
      where: {
        id,
        userId: req.userId
      },
      // Include the related tasks automatically
      include: {
        tasks: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found or access denied.' });
    }

    return res.json(project);
  } catch (error) {
    next(error);
  }
}

// Create a new project for the logged-in user
export async function createProject(req, res, next) {
  try {
    const { name, description, status, startDate, endDate } = req.body;

    const project = await prisma.project.create({
      data: {
        name,
        description,
        status: status || 'NOT_STARTED',
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        userId: req.userId // Bind ownership to the logged-in user
      }
    });

    return res.status(201).json(project);
  } catch (error) {
    next(error);
  }
}

// Update a project details
export async function updateProject(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const { name, description, status, startDate, endDate } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid project ID.' });
    }

    // Check ownership before updating (security check)
    const existingProject = await prisma.project.findFirst({
      where: { id, userId: req.userId }
    });

    if (!existingProject) {
      return res.status(404).json({ error: 'Project not found or access denied.' });
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        name,
        description,
        status,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null
      }
    });

    return res.json(updatedProject);
  } catch (error) {
    next(error);
  }
}

// Delete a project
export async function deleteProject(req, res, next) {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid project ID.' });
    }

    // Check ownership before deleting (security check)
    const existingProject = await prisma.project.findFirst({
      where: { id, userId: req.userId }
    });

    if (!existingProject) {
      return res.status(404).json({ error: 'Project not found or access denied.' });
    }

    // Note: Due to onDelete: Cascade configured in the Prisma Schema,
    // deleting this project will automatically clean up all associated tasks.
    await prisma.project.delete({
      where: { id }
    });

    return res.json({ message: 'Project and all associated tasks deleted successfully.' });
  } catch (error) {
    next(error);
  }
}
