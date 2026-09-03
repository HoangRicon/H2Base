/**
 * Server Action mẫu chuẩn — copy file này khi tạo action cho domain mới.
 *
 * Quy ước bắt buộc (CLEANCODE.md rule 10):
 * 1. `"use server"` ở đầu file.
 * 2. Input validate bằng zod schema TRƯỚC khi chạm data.
 * 3. Return typed result, không throw ra client.
 */

"use server";

import { z } from "zod";

const exampleInputSchema = z.object({
  name: z.string().min(1).max(100),
});

export type ExampleActionResult =
  | { ok: true; data: { greeting: string } }
  | { ok: false; error: string };

export async function exampleAction(input: unknown): Promise<ExampleActionResult> {
  const parsed = exampleInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.message };
  }

  // TODO: thay bằng service/data access của domain (src/server/, src/lib/api-client.ts)
  return { ok: true, data: { greeting: `Xin chào, ${parsed.data.name}!` } };
}
