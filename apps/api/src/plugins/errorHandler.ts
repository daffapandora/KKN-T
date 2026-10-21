import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import crypto from 'crypto';

export function errorHandler(
  error: FastifyError | ZodError | Error,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const requestId = (request.id as string) || crypto.randomUUID();

  // Handle Zod Validation Errors
  if (error instanceof ZodError) {
    return reply.status(400).send({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Data masukan tidak valid',
        details: error.errors.map((err) => ({
          field: err.path.join('.'),
          issue: err.message,
        })),
        requestId,
      },
    });
  }

  // Handle Fastify Validation Errors
  if ('validation' in error && error.validation) {
    return reply.status(400).send({
      error: {
        code: 'VALIDATION_ERROR',
        message: error.message || 'Validasi request gagal',
        details: [
          {
            field: error.validationContext || 'body',
            issue: error.message,
          },
        ],
        requestId,
      },
    });
  }

  const statusCode = (error as FastifyError).statusCode || 500;
  const isServerFault = statusCode >= 500;

  if (isServerFault) {
    request.log.error({ err: error, requestId }, 'Internal server error occurred');
  }

  return reply.status(statusCode).send({
    error: {
      code: isServerFault ? 'INTERNAL_SERVER_ERROR' : ((error as FastifyError).code || 'ERROR'),
      message: isServerFault
        ? 'Terjadi kesalahan internal pada server'
        : error.message || 'Permintaan gagal diproses',
      requestId,
    },
  });
}
