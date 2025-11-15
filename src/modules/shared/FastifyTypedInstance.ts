import type { ZodTypeProvider } from 'fastify-type-provider-zod' ;
import type { FastifyBaseLogger, FastifyInstance, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault } from 'fastify';

export type FastifyTypedInstance = FastifyInstance<
    RawServerDefault, 
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    FastifyBaseLogger,
    ZodTypeProvider
>