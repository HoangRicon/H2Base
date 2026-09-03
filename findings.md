# Findings — unified-codebase-refactor

## Khảo sát hiện trạng (2026-09-03)

- Nguồn: TailAdmin free Next.js admin dashboard v2.3.0 (Next.js 16, React 19, TS strict, Tailwind v4, App Router).
- 293 files tổng, 105 file TS/TSX (~8.4k dòng), 22 pages, không có test setup.
- **Không có data layer**: không tồn tại `src/lib`, `src/services`, `src/api`, `src/utils`, `src/types`.
- **Menu sidebar hardcode** trong `src/layout/AppSidebar.tsx` (383 dòng, gồm cả data + render + submenu collapse logic).
- **Config trùng lặp**: `.eslintrc.json` (extends next/core-web-vitals) tồn tại song song `eslint.config.mjs` (flat, chuẩn ESLint 9) → phải xóa bản cũ.
- `tsconfig.json` strict, alias `@/* → ./src/*` đã có sẵn — giữ nguyên.
- Components hiện phân theo "loại" (ecommerce, form, tables, example...) — không theo feature.
- `prettier.config.js` chỉ có plugin tailwindcss, chưa có options; `package.json` chưa có script format.
- Pnpm/npm: có `package-lock.json` → dùng npm.
- Icons: `src/icons/index.tsx` (export các icon component). Layout: `src/layout/*` (4 file).
- `.idea/` đang được track trong git (IntelliJ config) — nên bỏ khỏi version control.
- File lớn nhất: NotificationDropdown 384, AppSidebar 383, Calendar 283, ModalBasedAlerts 282.

## Quyết định quan trọng (từ design.md)

- Cấu trúc đích: App Router chuẩn + `features/` (đã cân nhắc FSD và "giữ nguyên TailAdmin" — xem design D1).
- Phụ thuộc một chiều: app → features → (ui/lib/hooks/types); features không import features.
- 13 clean code rules, tất cả map vào ESLint/Prettier để tooling ép buộc.
- Script new-project chỉ dry-run + list, không tự xóa demo (an toàn).
- Out of scope: DB thật, auth thật, i18n, e2e tests, redesign UI.

## Lưu ý thực hiện

- Next.js 16: route groups `(others-pages)/(chart)` lồng nhau chỉ để chia nhóm demo — sau refactor flatten thành `/calendar`, `/charts/bar`...
- `jsvectormap.d.ts` + `svg.d.ts` là type declarations cho lib — giữ tại chỗ, đưa vào `src/types/vendor/` nếu cần.
- Nhớ update `progress.md` sau mỗi nhóm task với evidence (lệnh chạy + kết quả).
