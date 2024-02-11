'use server';

import { env } from '@/env.mjs';
import { ResponseScheme } from '@/server/api/routers/response';

export const uploadFile = async (data: FormData) => {
  const res = await fetch(`${env.FLASK_URL}/api/upload_file`, {
    method: 'POST',
    body: data,
  });
  const result: ResponseScheme = await res.json();

  return result;
};
