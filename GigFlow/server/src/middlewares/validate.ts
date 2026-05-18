import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';
import { sendError } from '../utils/apiResponse';

type RequestSegment = 'body' | 'query' | 'params';

/**
 * Factory that returns a middleware validating a specific segment of the
 * request against the provided Zod schema.
 *
 * Usage:
 *   router.post('/', validate('body', createUserSchema), asyncHandler(createUser));
 *   router.get('/:id', validate('params', idParamSchema), asyncHandler(getUser));
 */
export const validate =
  <T>(segment: RequestSegment, schema: ZodSchema<T>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[segment]);

    if (!result.success) {
      const errors = formatZodErrors(result.error);
      sendError(res, 'Validation failed', StatusCodes.UNPROCESSABLE_ENTITY, errors);
      return;
    }

    // Replace the segment with the parsed (and coerced/transformed) data
    req[segment] = result.data as Request[RequestSegment];
    next();
  };

/**
 * Flatten Zod errors into a readable key → message map.
 */
const formatZodErrors = (error: ZodError): Record<string, string> => {
  return error.errors.reduce<Record<string, string>>((acc, issue) => {
    const path = issue.path.join('.') || '_root';
    acc[path] = issue.message;
    return acc;
  }, {});
};
