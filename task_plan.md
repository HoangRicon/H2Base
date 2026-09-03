# Task Plan — unified-codebase-refactor

> Nguồn chân lý: `openspec/changes/unified-codebase-refactor/tasks.md` (17 tasks chi tiết).
> File này là bản tracking runtime — re-read trước mỗi hành động, update sau mỗi hành động.

## Trạng thái tổng

- Spec: ✅ user duyệt (Gate G1 pass, openspec validate --strict pass)
- Mode: OpenSpec / Complexity: Thorough
- Strategy thực hiện: Executing-Plans (batch + checkpoint build sau mỗi nhóm)

## Checklist (đồng bộ tasks.md)

### Nhóm 0 — Chuẩn bị & dọn config

- [x] 0.1 Branch `refactor/unified-codebase`
- [x] 0.2 Xóa `.eslintrc.json` + `.idea/` khỏi git
- [x] 0.3 Prettier config + scripts `format`/`format:check`

### Nhóm 1 — Khung cấu trúc đích

- [x] 1.1 Tree thư mục đích rỗng
- [x] 1.2 Data layer khung (api-client, utils, constants, .env.example)
- [x] 1.3 Module mẫu `features/_template/`

### Nhóm 2 — Di chuyển components (build checkpoint sau mỗi task)

- [x] 2.1 layout/* + header/* + common/ → components/layout + components/shared
- [x] 2.2 Tách navItems khỏi AppSidebar (383 dòng → <150)
- [x] 2.3 ecommerce/* → features/dashboard
- [x] 2.4 auth/calendar/profile/charts/example/form/tables/videos → features/*
- [x] 2.5 Dọn console.log/any trong code đã di chuyển

### Nhóm 3 — Rules & docs

- [x] 3.1 CLEANCODE.md + AGENTS.md
- [x] 3.2 ESLint rules mới (no-console, no-explicit-any, no-cycle, no-restricted-imports)
- [x] 3.3 README mới (luồng khởi động nhanh)

### Nhóm 4 — Khởi động nhanh

- [x] 4.1 scripts/new-project.mjs + npm script
- [x] 4.2 Verify tổng: lint + format:check + build + smoke routes

### Nhóm 5 — Archive

- [x] 5.1 Cập nhật checkbox, openspec archive, merge

## Checkpoint build bắt buộc

Sau mỗi task nhóm 2 và cuối mỗi nhóm: `npm run build` phải pass trước khi tiếp tục.
