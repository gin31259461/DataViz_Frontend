'use server';

import { revalidatePath } from 'next/cache';

export const revalidateProject = async () => {
  revalidatePath('/management/project');
};
