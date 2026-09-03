# Proposal: unified-codebase-refactor

## Why

H2Base hiện là bản sao của template TailAdmin — một bộ UI demo, không phải code base dự án. Mỗi lần bắt đầu một dự án webapp quản lý mới, team phải copy template này rồi tự dọn: xóa trang demo, tách menu, thêm data layer, đặt lại rule lint... Làm lại tùy tiện mỗi dự án dẫn đến N cấu trúc thư mục khác nhau, code khó tái sử dụng, thành viên mới phải học lại từng repo.

Cần **một code base chuẩn duy nhất** để mọi dự án webapp quản lý (Quản lý bán hàng, Quản lý kho, CRM, HRM, quản lý trường học...) đều khởi đầu từ cùng một khung: cấu trúc thư mục thống nhất, bộ quy tắc clean code được tooling ép buộc, các thành phần quản trị dùng chung (layout, bảng, form, chart) đã được tổ chức lại theo domain, và một luồng được tài liệu hóa để tạo dự án mới từ code base này trong ít phút.

## What Changes

### In scope
1. **Tổ chức lại cấu trúc thư mục** theo chuẩn feature-based để một code base phục vụ mọi webapp quản lý: tách rõ UI dùng chung / trang demo mẫu / hạ tầng app (layout, context, hooks) / data layer.
2. **Bộ rule clean code** cho toàn code base: naming, giới hạn độ phức tạp, cấm giá trị magic, cấm dependency vòng, style được Prettier + ESLint ép buộc ở CI — kèm tài liệu rule ngắn gọn để AI và con người cùng theo.
3. **Chuẩn hóa data layer fullstack**: một nơi duy nhất cho types, API clients, server actions, business services, validation (zod) — để mọi dự án chỉ cần "cắm" domain của mình vào.
4. **Gói trọn bộ để bắt đầu nhanh**: script tạo dự án mới từ code base + README hướng dẫn luồng khởi động (làm sạch demo, đặt tên app, thêm domain module đầu tiên).
5. **Dọn template**: bỏ config trùng lặp, gom các components phân tán về đúng chỗ theo domain.

### Out of scope
- Không thay đổi giao diện/nội dung hiển thị của các trang demo (không redesign UI).
- Không thêm stack backend ngoài Next.js (không cài Prisma/DB ở bước này — chỉ dựng khung đặt chỗ).
- Không thêm auth/authorization thật, i18n, hay test e2e — các change riêng sau.
- Không sửa thư viện UI gốc của TailAdmin ngoài việc tổ chức lại vị trí file và import.

## Impact

| Đối tượng | Ảnh hưởng |
|---|---|
| Cấu trúc thư mục | Thay đổi lớn — mọi import path sẽ cập nhật theo `@/` alias mới |
| Trang demo | Vẫn chạy được như cũ sau refactor (yêu cầu tương thích) |
| Nhà phát triển mới | Bắt đầu dự án quản lý mới bằng 1 lệnh, không tự dọn template |
| AI agent | Theo bộ rule clean code + cấu trúc chuẩn khi sinh code |
| CI | Thêm lint + format check bắt buộc |

## Rollback Plan

Refactor làm theo nhóm task, mỗi nhóm kết thúc bằng `npm run build` pass và commit riêng trên branch. Nếu sai ở nhóm bất kỳ: `git revert` nhóm đó hoặc `git checkout` về commit trước nhóm. Không có migration dữ liệu hay thay đổi schema — toàn bộ rollback thuần git, không mất mát gì ngoài thời gian.

---

## tasks.md — Danh sách task thực hiện

> Chi tiết kỹ thuật mỗi task (file paths, acceptance criteria, test strategy) nằm ở `tasks.md`.
> Tóm tắt: (1) dọn config, (2) dựng cấu trúc đích, (3) di chuyển từng nhóm component, (4) dựng data layer khung, (5) bộ rule clean code + tooling, (6) script + docs khởi động nhanh, (7) build + lint verify từng nhóm.

## Xác nhận

Chờ user OK trước khi vào Phase 2 (design.md / tasks.md chi tiết).
