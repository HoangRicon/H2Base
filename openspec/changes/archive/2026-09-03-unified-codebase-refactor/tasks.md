# Tasks: unified-codebase-refactor

> Mỗi nhóm task kết thúc bằng `npm run build` pass rồi mới sang nhóm tiếp theo (nguyên tắc rollback trong proposal.md).

## Nhóm 0 — Chuẩn bị & dọn config

- [x] **0.1** Tạo branch `refactor/unified-codebase` từ `main`.
  - Files: git branch
  - Acceptance: `git branch` hiển thị branch mới, sạch
  - Test: `git status` clean

- [x] **0.2** Xóa `.eslintrc.json` (trùng `eslint.config.mjs`), bỏ `.idea/` khỏi git (thêm `.idea/` vào `.gitignore`).
  - Files: `.eslintrc.json`, `.gitignore`
  - Acceptance: chỉ còn 1 ESLint config; `.idea` không còn được track
  - Test: `npm run lint` vẫn chạy đúng

- [x] **0.3** Nâng cấp `prettier.config.js` (printWidth 100, trailingComma all) + thêm scripts `format`, `format:check` vào `package.json`.
  - Files: `prettier.config.js`, `package.json`
  - Acceptance: `npm run format:check` chạy không lỗi syntax
  - Test: `npm run format` xong → `git diff` chỉ là format

## Nhóm 1 — Dựng khung cấu trúc đích

- [x] **1.1** Tạo tree thư mục đích rỗng: `src/features/_template/`, `src/lib/`, `src/server/actions/`, `src/types/`, `src/components/layout/`, `src/components/shared/`, `scripts/`.
  - Files: thư mục + `index.ts`/placeholder tối thiểu
  - Acceptance: đúng tree ở design.md D1
  - Test: `npm run build` pass (chưa di chuyển gì)

- [x] **1.2** Data layer khung: `src/lib/api-client.ts` (ApiError + apiClient), `src/lib/utils.ts` (cn + helpers), `src/lib/constants.ts`, `.env.example`.
  - Files: `src/lib/*.ts`, `.env.example`
  - Acceptance: apiClient typed, đọc `NEXT_PUBLIC_API_BASE_URL`; build pass
  - Test: tsc strict pass; import thử trong 1 file temp rồi bỏ

- [x] **1.3** Module mẫu `src/features/_template/` (components/hooks/types.ts/index.ts) + dashboard placeholder.
  - Files: `src/features/_template/**`
  - Acceptance: _template có cấu trúc chuẩn để copy; không tham chiếu app thật
  - Test: build pass

## Nhóm 2 — Di chuyển components theo mapping (mỗi task xong build 1 lần)

- [x] **2.1** `src/layout/*` → `src/components/layout/`; `src/components/header/*` → `src/components/layout/`; `src/components/common/*` → `src/components/shared/`.
  - Files: move + sửa import trong `src/app/**`
  - Acceptance: không còn `src/layout/`, `src/components/header/`, `src/components/common/`
  - Test: `npm run build` + mở `/` render đúng

- [x] **2.2** Tách menu hardcode: từ `AppSidebar.tsx` (383 dòng) tách `navItems` thành data cấu trúc + render thuần.
  - Files: `src/components/layout/AppSidebar.tsx`, `src/components/layout/nav-items.ts`
  - Acceptance: AppSidebar < 150 dòng; menu render y hệt (cùng items, icons, active state)
  - Test: build pass; kiểm tra sidebar trên `/` và `/calendar`

- [x] **2.3** `src/components/ecommerce/*` → `src/features/dashboard/`; `src/app/(admin)/page.tsx` dùng `features/dashboard`.
  - Files: move + imports
  - Acceptance: trang chủ render y hệt
  - Test: build pass, visual check `/`

- [x] **2.4** `src/components/auth|calendar|user-profile` → `src/features/auth|calendar|profile`; `src/components/charts` + `src/components/example` + `src/components/form` + `src/components/tables` + `src/components/videos` → `src/features/charts|forms|tables|media` (gộp theo design D1 mapping).
  - Files: move + imports + routes `src/app/(admin)/**` bỏ group nesting thừa
  - Acceptance: mapping table D1 complete 100%; các route `/calendar`, `/bar-chart`, `/form-elements`, `/basic-tables`, `/profile`, `/videos`, `/alerts`... vẫn render
  - Test: build pass + duyệt từng route

- [x] **2.5** Dọn console.log/any trong code vừa di chuyển (chuẩn bị bật rule nhóm 4).
  - Files: mọi file vừa move
  - Acceptance: `grep -r "console\." src/` không còn kết quả ngoài logger
  - Test: build pass

## Nhóm 3 — Rules & docs

- [x] **3.1** Viết `CLEANCODE.md` (13 rule từ design D2) + `AGENTS.md` (bản cho AI agent: cấu trúc, alias, naming,禁区 phụ thuộc).
  - Files: `CLEANCODE.md`, `AGENTS.md`
  - Acceptance: 2 file khớp D2; AGENTS.md ngắn gọn ≤ 150 dòng
  - Test: review thủ công theo checklist G1

- [x] **3.2** Cập nhật `eslint.config.mjs`: thêm `no-console: error`, `@typescript-eslint/no-explicit-any: error`, `import/no-cycle: error`, `no-restricted-imports` cấm `../../`, naming rules; cài `eslint-plugin-import`.
  - Files: `eslint.config.mjs`, `package.json`
  - Acceptance: lint pass trên toàn repo sau khi các rule áp
  - Test: tạo file test có `console.log` + `any` → lint fail → xóa file

- [x] **3.3** Viết lại `README.md`: cấu trúc mới, luồng khởi động nhanh, mapping feature module, tham chiếu CLEANCODE.md.
  - Files: `README.md`
  - Acceptance: README phản ánh đúng repo sau refactor, có mục "Tạo dự án mới trong 10 phút"
  - Test: người mới theo README chạy được `npm run dev`

## Nhóm 4 — Khởi động nhanh

- [x] **4.1** Script `scripts/new-project.mjs`: rename app + reset dashboard + list demo cần xóa (dry-run).
  - Files: `scripts/new-project.mjs`, `package.json` (script `new:project`)
  - Acceptance: chạy trên bản clean chỉ đổi đúng các file dự kiến (kiểm bằng `git status`)
  - Test: chạy script trên copy repo → diff review → `npm run build` pass

- [x] **4.2** Verify tổng: `npm run lint && npm run format:check && npm run build` + smoke các route chính.
  - Files: none (verify)
  - Acceptance: cả 3 lệnh pass; mọi route danh sách 2.4 render
  - Test: ghi evidence vào `progress.md`

## Nhóm 5 — Archive

- [x] **5.1** Cập nhật checkbox, `openspec archive unified-codebase-refactor`, commit merge về main.
