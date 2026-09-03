# unified-admin-codebase Capability Delta

## ADDED Requirements

### Requirement: Cấu trúc thư mục chuẩn cho mọi webapp quản lý

Code base MUST có một cấu trúc thư mục chuẩn, tài liệu hóa, trong đó:

- **`src/app/`** chỉ chứa routing (pages, layouts, route handlers) — không chứa UI logic hay data logic.
- **`src/components/ui/`** chứa UI primitives tái sử dụng chéo dự án (button, table, form, chart...).
- **`src/components/layout/`** chứa khung app quản trị (sidebar, header, breadcrumbs).
- **`src/features/<tên-domain>/`** chứa mọi thứ của một nghiệp vụ (components + hooks + types + services riêng của domain đó); xóa feature = xóa 1 thư mục.
- **`src/lib/`** chứa hạ tầng dùng chung: helpers, constants, API client factory, validation schemas dùng chung.
- **`src/server/`** chứa mọi thứ chạy server-side (server actions, data access) — tách khỏi client code.

#### Scenario: Developer thêm nghiệp vụ "Quản lý kho"

- **Given** code base đã refactor xong cấu trúc
- **When** developer tạo domain module mới `features/warehouse`
- **Then** toàn bộ files của module nằm trong 1 thư mục `src/features/warehouse/`, và không phải sửa bất kỳ file nào ngoài module đó (trừ đăng ký route + menu)

#### Scenario: Developer xóa một trang demo

- **Given** muốn bỏ feature "calendar" khỏi dự án mới
- **When** xóa thư mục `src/features/calendar` và route tương ứng
- **Then** build vẫn pass, không có import mồ côi từ nơi khác

### Requirement: Import path thống nhất qua alias `@/`

Mọi file trong `src/` khi import module nội bộ MUST dùng alias `@/...`; relative path vượt quá 2 cấp (`../../`) bị cấm.

#### Scenario: Kiểm tra import trong codebase

- **Given** bất kỳ file `.ts/.tsx` nào trong `src/`
- **When** import module nội bộ
- **Then** dùng alias `@/...`, không có relative path `../../`

### Requirement: Lint là rào chắn bắt buộc

Code base MUST được bảo vệ bởi ESLint (flat config) + Prettier chạy thống nhất, loại bỏ config trùng lặp, với rule trọng yếu:

- Cấm `any` không explicit, cấm `console.log` (trừ khi tắt bằng comment có lý do).
- Cấm imports `../../`, cảnh báo magic numbers.
- Ép naming convention: `PascalCase` component file, `camelCase` util, `kebab-case` folder.
- `npm run lint` + `npm run format:check` MUST là điều kiện bắt buộc của CI script.

#### Scenario: Commit code có console.log

- **Given** developer/AI tạo PR có lệnh `console.log("debug")`
- **When** CI chạy lint
- **Then** lint fail với rule `no-console`, file bị từ chối cho đến khi bỏ hoặc thay bằng logger có chủ đích

#### Scenario: Check formatting toàn repo

- **Given** repo đã áp dụng Prettier
- **When** chạy `npm run format:check`
- **Then** 0 file bị đánh dấu lỗi format; mọi file `.ts/.tsx/.css` theo cùng 1 style

### Requirement: Tài liệu rule ngắn gọn cho người + AI

Bộ rule clean code MUST được viết ra file hướng dẫn ngắn trong repo (CLEANCODE.md cho người + AGENTS.md cho AI agent), để AI agent đọc theo mỗi session và sinh code tuân thủ cấu trúc, naming, alias.

#### Scenario: AI agent bắt đầu session mới trong repo

- **Given** AI đọc file rule trong repo
- **When** sinh code mới
- **Then** code sinh ra tuân theo đúng cấu trúc thư mục + naming + alias rule đã mô tả

### Requirement: Một nơi duy nhất để "cắm" backend

Data layer fullstack MUST có sẵn khung chuẩn:

- `src/types/` — kiểu domain dùng chung (không lặp lại type ở nhiều nơi).
- `src/lib/api-client.ts` — HTTP client chuẩn hóa cho phía client (error handling, base URL từ env, typed).
- `src/server/actions/` — Server Actions theo domain, mỗi action validate input bằng zod schema.
- `.env.example` — liệt kê mọi biến môi trường cần thiết, dự án mới copy thành `.env` là chạy.

#### Scenario: Dự án mới cần gọi API đơn hàng

- **Given** code base đã có khung data layer
- **When** developer định nghĩa type `Order`, action `getOrders()` trong module `features/orders`
- **Then** action dùng chung API client + zod, không tự viết fetch/error-handling lặp lại

#### Scenario: Dự án mới đổi backend base URL

- **Given** mọi request đi qua API client chuẩn hóa
- **When** đổi 1 biến môi trường
- **Then** toàn bộ app trỏ sang backend mới, không sửa code

### Requirement: Luồng tạo dự án mới được tài liệu hóa và 1 phần tự động

Luồng khởi động dự án mới MUST được tài liệu hóa trong README và 1 phần tự động bằng script:

- README chính hướng dẫn: copy/clone code base → chạy script dọn demo → đặt tên app → thêm domain module đầu tiên.
- Script `npm run new:project` thực hiện phần dọn dẹp tự động được (rename app, reset trang chủ về blank, gợi ý xóa demo — dry-run, không tự xóa).
- Trang chủ sau dọn dẹp MUST là dashboard trống có chỗ cắm widget, không còn metric "e-commerce" giả.

#### Scenario: Bắt đầu dự án "Quản lý phòng khám"

- **Given** dev clone H2Base đã refactor
- **When** theo README chạy luồng khởi động
- **Then** trong ≤ 10 phút có app quản trị chạy: đúng tên, dashboard trắng, 1 module mẫu để tham chiếu cách viết module mới

## Liên hệ domain khác

- Requirement "Luồng tạo dự án mới" phụ thuộc "Cấu trúc thư mục chuẩn" và "Lint là rào chắn" — script dọn demo chỉ hoạt động khi cấu trúc đã chuẩn.
- Requirement "Một nơi duy nhất để cắm backend" độc lập về nghiệp vụ nhưng chia sẻ rule validation khi sinh code mới.
