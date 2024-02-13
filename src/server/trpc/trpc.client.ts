import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../api/root';

export const api = createTRPCReact<AppRouter>();
