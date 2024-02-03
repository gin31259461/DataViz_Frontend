'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateProject() {
  revalidatePath('/management/project');
}
