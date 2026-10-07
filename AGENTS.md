# AGENTS.md — Hướng dẫn cho AI agent làm việc trong repo này

> Đọc file này đầu mỗi session. Mục tiêu: mọi code sinh ra nhất quán, không cần giải thích lại.

## Repo là gì

H2Base — code base chuẩn cho **mọi webapp quản trị** (Next.js 16 App Router, React 19, TS strict, Tailwind v4). Khởi đầu từ TailAdmin đã refactor.

## Cấu trúc — đặt file đúng chỗ ngay từ đầu

```text
src/app/          # routing only: pages, layouts, route handlers — không logic
src/components/ui/      # UI primitives (button, table, form, chart, modal...)
src/components/layout/  # khung admin: AppSidebar, AppHeader, nav-items
src/components/shared/  # component dùng chung không phải primitive (Card, Breadcrumb...)
src/features/<domain>/  # ★ module nghiệp vụ: components/ hooks/ types.ts index.ts
src/hooks/        # cross-feature hooks
src/context/      # providers toàn app
src/lib/          # api-client, utils, constants (hạ tầng, không UI)
src/server/actions/    # server actions theo domain (zod validate)
src/types/        # type dùng chung toàn app
```

Thêm nghiệp vụ mới: copy `src/features/_template/`, đăng ký 1 route trong `src/app/(admin)/`, thêm 1 entry trong `src/components/layout/nav-items.tsx`. Không sửa gì khác.

## Quy tắc bắt buộc khi sinh code

1. Import nội bộ **luôn** `@/...`. Không bao giờ `../` hay `../../`.
2. Component: `PascalCase.tsx`, folder `kebab-case`, hook `useXxx.ts`.
3. **Không `any`**, **không `console.*`** (lint error). Hằng số không trừ magic values — đặt tên.
4. Server action: `"use server"` + zod `safeParse` + typed result (xem `src/server/actions/example.ts`).
5. Gọi API phía client qua `api` từ `@/lib/api-client` — không viết fetch trần.
6. Type dùng 1 nơi; module chỉ export qua `index.ts` public API.
7. File > 250 dòng → tách. Feature không import feature.
8. Trước khi claim xong: `npm run lint && npm run format:check && npm run build` đều phải pass.

## Luồng việc

- Thay đổi lớn: thống nhất yêu cầu + kế hoạch với user trước khi code. Dùng bộ skill của Matt Pocock (`brainstorming` → `writing-plans` → `implement` → `code-review`/`tdd`). Không dùng workflow spec-first.
- Đọc `CLEANCODE.md` cho bản đầy đủ 13 rule cho người.
