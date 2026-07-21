import { body, validationResult } from 'express-validator';

// Utility middleware to run validations and return 400 Bad Request if errors exist
const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Return the first validation error message as { error: msg } to fit the consistent format
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
};

// Auth Validation Schemas
export const registerValidator = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required.'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.'),
  validateResult
];

export const loginValidator = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required.'),
  validateResult
];

// Project Validation Schemas
export const projectValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Project name is required.'),
  body('description')
    .optional({ nullable: true })
    .trim(),
  body('status')
    .optional()
    .isIn(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'])
    .withMessage('Status must be NOT_STARTED, IN_PROGRESS, or COMPLETED.'),
  body('startDate')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date (YYYY-MM-DD).'),
  body('endDate')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date (YYYY-MM-DD).')
    .custom((value, { req }) => {
      if (value && req.body.startDate && new Date(value) < new Date(req.body.startDate)) {
        throw new Error('End date cannot be earlier than start date.');
      }
      return true;
    }),
  validateResult
];

// Task Validation Schemas
export const taskValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Task name is required.'),
  body('description')
    .optional({ nullable: true })
    .trim(),
  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH'])
    .withMessage('Priority must be LOW, MEDIUM, or HIGH.'),
  body('status')
    .optional()
    .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED'])
    .withMessage('Status must be PENDING, IN_PROGRESS, or COMPLETED.'),
  body('dueDate')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage('Due date must be a valid ISO 8601 date (YYYY-MM-DD).'),
  body('projectId')
    .optional() // Required for creation, optional on update
    .isInt()
    .withMessage('Project ID must be an integer.'),
  validateResult
];
