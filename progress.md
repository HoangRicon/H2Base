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

## 2026-09-10 (2) — Sidebar model mới theo ảnh tham chiếu (commit 4f87ada)

Yêu cầu: rail to hơn + có chữ dưới icon; BỎ hover-expand; bấm section cha → panel rộng hiện CẠNH rail; nút mở rộng xuống đáy rail (luôn ở đó, không cuộn theo icon); rail cuộn khi quá nhiều icon.

- `SIDEBAR_CLASSES`: rail `w-20` (80px), panel `w-64 left-20` overlay — nội dung `md:ml-20` không đổi khi mở panel.
- `nav-items.tsx`: chuyển `mainNavItems/othersNavItems` → `navSections` (mỗi section = tile icon+nhãn; có `path` → link thẳng, có `items` → mở panel).
- `AppSidebar`: bỏ `isHovered`; nút đáy rail (AngleLeft/Right icon — file SVG cũ rỗng 0 byte, đã viết lại); panel hiển thị tiêu đề section + menu con, active theo route.
- `SidebarContext`: `isExpanded` → `isSubmenuOpen` (panel), `toggleSidebar` → `toggleSubmenuPanel`; xóa `Backdrop.tsx` (đã có backdrop nội bộ cho mobile drawer).
- Verify: lint 0, format OK, build ✓, 6/6 routes 200, class render đúng `w-20`/`md:ml-20`.

## 2026-09-11 — Sidebar trong flow, push nội dung (commit 4961509)

Yêu cầu: panel mở thì ĐẨY trang vào (không đè); nút mở/đóng chuyển từ header xuống đáy rail + đổi màu theo trạng thái; panel phụ rộng hơn (w-64→w-72); tách sidebar/header để không che nhau.

- `app/(admin)/layout`: `md:flex` — sidebar (rail+panel) là cột flex riêng, header+content cột còn lại → panel mở animate `width 0↔288px` đẩy nội dung, không còn fixed/overlay → header không thể che sidebar. Sidebar `sticky top-0` nguyên chiều cao.
- `AppHeader`: bỏ toggle desktop (đã chuyển xuống đáy rail); hamburger chỉ còn cho mobile drawer.
- `AppSidebar`: nút đáy rail `bg-brand-500` khi mở / xám khi đóng; state `selectedSection` nâng lên Context (giữ vị trí section giữa header/rail); panel `w-0 overflow-hidden ↔ w-72 overflow-y-auto`.
- Verify: lint 0, format OK, build ✓, 5/5 routes 200, HTML render đúng `md:flex` + `sticky ... md:flex`.

## 2026-09-11 (2) — Nút đáy rail giống nút header (commit 5a24e62)

Clarify: user muốn CHÍNH cái nút hamburger cạnh ô search trên header được chuyển xuống đáy rail (không phải icon mũi tên tự chế).

- `AppSidebar`: nút đáy rail dùng lại SVG gốc của header — hamburger 3 gạch khi đóng, dấu X khi mở; nút bo góc có viền; khi MỞ đổi màu brand (viền + nền xanh nhạt) / khi ĐÓNG xám viền thường.
- `AppHeader`: hamburger thành `md:hidden` (chỉ mobile drawer), desktop nút nằm ở đáy rail.
- Verify: lint 0, build ✓, smoke 3/3 routes 200 + aria/title render đúng.

## 2026-09-11 (3) — Scrollbar mềm toàn hệ thống (commit 1f340b7)

- `globals.css @layer base`: đặt style cho MỌI phần tử cuộn (không cần class): mỏng 10px, thumb bo tròn pill trong mờ (xám 35% alpha / dark 28%), track trong suốt, `transition` màu + độ dày khi hover, `scroll-behavior: smooth`, `scrollbar-width: thin` cho Firefox.
- `custom-scrollbar` cũ (size-1.5 cứng) Nay kế thừa style toàn cục; `no-scrollbar` giữ nguyên cho nơi muốn ẩn hẳn.
- Rail sidebar: bỏ `no-scrollbar` → icon nhiều hiện scrollbar mềm đúng yêu cầu.
- Verify: build ✓, CSS compile chứa `scrollbar-color` + webkit thumb rgba trong output `.next`, lint 0.

## 2026-09-11 (4) — Header tách 100%, rail to hơn, bỏ focus ring (commit 8d479af)

- `app/(admin)/layout`: `h-screen flex-col` — Header full-width trên cùng (không sticky, không z-cao đè sidebar); dưới là hàng flex [sidebar | main tự cuộn]. Panel phụ vẫn push nội dung.
- `AppSidebar`: hết sticky/h-screen → `self-stretch` trong hàng flex; rail `w-24` (96px), tile cao 72px, nhãn `text-xs` (12px) thay 10px cho vừa rail mới.
- Focus ring: thêm rule `@layer base` tắt `outline` + trung hòa `--tw-ring-shadow` mọi phần tử; xóa token `focus:ring-*/focus:border-*/focus:outline-*` khỏi 11 file component.
- Verify: lint 0, build ✓, smoke 4/4 routes 200, HTML render đúng `flex h-screen flex-col` + header full-width.

## 2026-09-11 (5) — Logo lên header (commit tiếp theo 8d479af)

- Bỏ khối logo ở đỉnh rail `AppSidebar` (nav bắt đầu từ `pt-4`); header render full logo `logo.svg` trên MỌI breakpoint (bỏ `lg:hidden`).
- Smoke: `logo.svg` có trong header, `logo-icon.svg` = 0 lần trong page.

## 2026-09-11 (6) — Rail w-22 + nút thu gọn style mới

- `SIDEBAR_CLASSES.railWidth`: `w-24` → `w-22` (88px).
- Nút đáy rail: bỏ toggle icon X, luôn dùng icon hamburger; mở = `text-brand-500` + `shadow-[0_0_0_4px_rgba(70,95,255,0.18)]` (không border), đóng = xám + hover nền nhạt.
- Verify: lint 0, build ✓, `.w-22` có trong compiled CSS.

## 2026-09-11 (7) — Sidebar phẳng: bấm icon → sang trang, hover → tooltip (commit 9d19c42)

- `nav-items.tsx`: `navSections` (2 tầng) → `navItems` phẳng 18 mục, mỗi mục `name/icon/path`.
- `AppSidebar`: mọi tile là `Link` điều hướng thẳng (kể cả section nhiều con — mỗi trang con 1 tile riêng); thêm tooltip `group-hover` tên trang bên phải rail (desktop only, có mũi tên nhỏ); BỎ panel trung gian + nút đáy rail.
- `SidebarContext` gọn còn `isMobileOpen`; `constants` bỏ `panelWidth`. Mobile drawer rộng `w-56` (có nhãn nên cần rộng hơn rail).
- Verify: lint 0, build ✓, smoke 6/6 routes 200 + `role="tooltip"`, `aria-label="Calendar"` render đúng.

## 2026-09-11 (8) — Khôi phục rail + panel, tooltip không bị che (commit e1f48c8)

Clarify: user KHÔNG muốn phẳng hóa hết ra rail; muốn giữ rail sidebar 2 tầng nhưng bấm tile = vào thẳng trang chính của nhóm (không phải mở rail rồi chọn); tooltip nổi không bị che; ẩn thanh trượt rail; giữ nút mở rộng cuối sidebar.

- `nav-items`: `navItems` phẳng → `navSections` với `path` bắt buộc (trang chính của nhóm) + `items` (trang con trong panel).
- `AppSidebar`: tile là `Link href=path` (click vào trang luôn); nút hamburger Đáy rail mở panel toàn cây menu (push, w-72); rail `no-scrollbar` (ẩn scrollbar vẫn cuộn được); tooltip thành 1 phần tử `fixed` đặt gốc component, tính vị trí theo `getBoundingClientRect()` mép phải tile → không bị rail/overflow/header che, z-[100].
- `SidebarContext`: giữ `isSubmenuOpen` (panel) + `isMobileOpen`.
- Verify: lint 0, build ✓, smoke 4/4 routes 200, render `aria-label="General"` + `w-22`.

## 2026-09-11 (9) — Panel ẩn với nhóm không có trang con (commit kế tiếp e9b3136)

- `showPanel = isSubmenuOpen && items.length` — section lẻ (Users/Forms/Tables/Media...) không bao giờ kéo panel ra.
- Bấm tile nhóm lẻ khi panel đang mở → `closeSubmenuPanel()` (thêm vào context); nhóm có items → đổi section trong panel.
- Nút đáy rail disabled khi section hiện tại không có items; màu/icon trạng thái dùng `showPanel`.
- Verify: lint 0, build ✓, format pass.
