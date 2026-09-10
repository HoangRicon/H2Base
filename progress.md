# Progress Log — unified-codebase-refactor

## 2026-09-03

### Phase 0 — Session setup

- Khảo sát repo: TailAdmin template, 105 TS/TSX files, không data layer. → findings.md
- Chọn mode OpenSpec (default), complexity Thorough. `.spec-mode` = openspec. `openspec init --tools none` OK (CLI 1.3.1).

### Phase 1 — Specification

- Viết `openspec/config.yaml` (constitution context + rules).
- Soạn artifacts: proposal.md, specs/unified-admin-codebase/spec.md (6 requirements, Given/When/Then), design.md (cấu trúc đích + mapping + 13 rules), tasks.md (17 tasks, 5 nhóm).
- `openspec validate unified-codebase-refactor --strict` → **valid**.
- **Gate G1 PASS**: user duyệt "Duyệt — bắt đầu thực hiện".

### Phase 2 — Planning

- Tạo task_plan.md (checklist đồng bộ), findings.md, progress.md (file này).

### Phase 4 — Implementation (branch `refactor/unified-codebase`)

| Nhóm    | Commit    | Nội dung                                                                                                                                                                                                                      | Build |
| ------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| 0       | `3abf3a3` | Branch, xóa `.eslintrc.json` trùng, untrack `.idea/`, prettier config + scripts, cài zod/eslint-plugin-import/clsx                                                                                                            | pass  |
| 1       | `dcba9fe` | Khung đích: `lib/api-client                                                                                                                                                                                                   | utils | constants`, `server/actions/example`, `types/`, `features/_template`, `.env.example` | pass |
| 2.1–2.2 | `4ecc938` | layout/header/common → `components/layout` + `components/shared`; tách `nav-items.tsx` khỏi AppSidebar (383→252 dòng)                                                                                                         | pass  |
| 2.3–2.4 | `6ab53c5` | Moves: ecommerce→dashboard, auth, calendar, user-profile→profile, charts, example+form→forms, tables, videos→media; flatten routes `(others-pages)/(ui-elements)/(full-width-pages)` → `(admin)/x`, `(auth)`, `(error-pages)` | pass  |
| 2.5     | `e6fe59a` | Dọn 5 lint errors template (jsvectormap.dts bỏ, escape entity, lazy initializers Calendar/Theme, derive submenu từ pathname) — lint 0 problems                                                                                | pass  |
| 3       | `eba95b6` | `CLEANCODE.md` (13 rules) + `AGENTS.md`; ESLint: `no-console:error`, `no-explicit-any:error`, `import/no-cycle:error`, `no-restricted-imports` cấm `../`; xóa console.log demo; README mới full onboarding                    | pass  |
| 4       | `b536241` | `scripts/new-project.mjs` (rename + reset dashboard + list demo dry-run); prettier full repo                                                                                                                                  | pass  |

### Gate G4 — Verification evidence (2026-09-03)

- `npm run lint` → **0 errors, 0 warnings**.
- `npm run format:check` → **"All matched files use Prettier code style!"**.
- `npm run build` → **✓ Compiled successfully**, 21/21 routes generate.
- Rule verification: file test chứa `any` + `console.log` → lint báo đúng 2 errors → đã xóa file test.
- Script verification: `npm run new:project -- --dry-run` không đổi file nào; run thật đổi đúng package.json name, `.env.local` NEXT_PUBLIC_APP_NAME, reset `(admin)/page.tsx` (backup `.bak`) — working copy đã restore bằng git.
- Smoke test prod server (`next start`): 9/9 routes **HTTP 200** — `/`, `/calendar`, `/form-elements`, `/basic-tables`, `/profile`, `/signin`, `/error-404`, `/videos`, `/bar-chart`.

### Phase 5 — Archive

- Checkbox 17/17 tasks + task_plan.md cập nhật.
- `openspec archive unified-codebase-refactor`.
- Merge `refactor/unified-codebase` → `main`.

### Ghi chú / follow-up cho change kế tiếp

- Chưa có unit test (out of scope theo proposal) — khuyến nghị change tiếp theo cài Vitest + Testing Library, TDD từ module đầu tiên.
- Auth thật (NextAuth) + DB layer (Prisma/Drizzle) chưa cắm — đã chừa khung `server/`, `lib/api-client`, `.env.example`.
- `components/ui` vẫn là UI TailAdmin gốc — ổn dùng, có thể nâng cấp dần sang pattern `button/Button.tsx + index.ts` khi chạm tới.

## 2026-09-10 — Sidebar UX fix (commit c626277)

Yêu cầu: rail thu gọn không bao giờ tự to; hover mới bung; chỉ thư mục con expand; tối ưu diện tích (80% → ~95-100%); responsive theo zoom.

- `SidebarContext`: bỏ `isHovered` (hover giờ là state nội bộ của AppSidebar — layout không đổi khi hover, hết giật).
- `AppSidebar`: rail 64px mặc định (`isExpanded=false`); hover overlay 240px **đè lên** nội dung không push; submenu chỉ expand trong panel bung; nút **pin/unpin** giữ mở rộng + push khi muốn; xóa promo SidebarWidget; bỏ mt-16 overlap.
- `AdminLayout`: bỏ `max-w-(--breakpoint-2xl)` + padding 12-16px → nội dung chiếm gần trọn chiều rộng (chỉ trừ 64px rail); push `md:ml-16` ↔ `md:ml-60` khi pin; hover không đổi margin.
- `AppHeader`: toggle breakpoint lg→md khớp rail mới.
- Verify: lint 0, format pass, build ✓, smoke `/` + `/calendar` + `/signin` HTTP 200; class render đúng `w-16`/`md:ml-16`.
