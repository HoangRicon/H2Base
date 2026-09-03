# CLEANCODE.md — Bộ rule clean code H2Base

> 13 rule, tất cả được tooling (ESLint + Prettier) ép buộc. Rule không ép bằng tool chỉ là lời khuyên — và sẽ bị quên.

## Quy tắc cấu trúc (1–4)

1. **File component**: `PascalCase.tsx`, named export đồng nhất. Folder cha `kebab-case`. File hook `useXxx.ts`, util `camelCase.ts`.
2. **1 component = 1 file chính.** File vượt 250 dòng → tách (data ra file riêng, sub-render ra component con).
3. **Server/Client tách bạch**: `"use client"` chỉ xuất hiện trong `components/`, `features/`, `hooks/`, `context/`. `server/` không bao giờ có `"use client"`.
4. **Import alias `@/`** — cấm `../../`. Cấm relative import vượt ra ngoài thư mục hiện tại.

## Quy tắc code (5–10)

5. **TS strict, cấm `any`.** Cần escape hatch → `unknown` + type guard.
6. **Cấm `console.*`** trong code commit. Debug có chủ đích → `lib/logger.ts` (khi có) hoặc eslint-disable kèm lý do.
7. **Không magic values.** Hằng số đặt tên, đưa vào `lib/constants.ts` (dùng chung) hoặc colocated `*.const.ts` (riêng module).
8. **Type đặt 1 nơi**: dùng chung → `src/types/`; riêng module → `features/<x>/types.ts`. Cấm định nghĩa lại cùng type 2 nơi.
9. **Tên thể hiện ý đồ**: `getOrdersByCustomer` (không `fetchData2`); boolean có prefix `is/has/should`.
10. **Server Action validate bằng zod** trước khi chạm data. Input `unknown` → `schema.safeParse` → trả typed result.

## Quy tắc tooling (11–13)

11. **`npm run lint`** = ESLint flat config + các rule ở trên — lỗi = không merge.
12. **`npm run format:check`** = Prettier (printWidth 100, trailingComma all, tailwind class sort) — sai format = không merge.
13. **`npm run build`** pass là điều kiện merge cuối cùng.

## Phụ thuộc một chiều (no circular deps)

```text
app → features → (components/ui | lib | hooks | types | context)
features KHÔNG import features      (dùng chung → nâng lên ui/lib/hooks)
components/ui KHÔNG import features
server/ KHÔNG import components     (server actions dùng lib/types)
```

Vi phạm → ESLint `import/no-cycle` báo lỗi.

## Vi phạm thì sao?

- Lint fail ở CI/commit → sửa trước khi merge. Không tắt rule toàn cục để "đi tiếp".
- Cần ngoại lệ thực sự → `eslint-disable-next-line <rule> -- <lý do ngắn>` tại đúng dòng.
