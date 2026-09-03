# Module Template — Copy khi tạo domain mới

Copy thư mục này thành `src/features/<tên-domain-số-ít-kebab-case>/`, rồi:

1. Đặt tên domain module (VD: `warehouse`, `orders`, `patients`).
2. Đăng ký route: tạo `src/app/(admin)/<tên-domain>/page.tsx` import từ feature.
3. Đăng ký menu: thêm 1 entry vào `src/components/layout/nav-items.ts`.
4. Xóa thư mục này khỏi dự án (hoặc giữ để module tiếp theo copy).

## Cấu trúc chuẩn 1 module

```text
features/<domain>/
├── components/    # UI components riêng domain (PascalCase.tsx)
├── hooks/         # hooks riêng domain (useXxx.ts)
├── types.ts       # type chỉ dùng trong module
└── index.ts       # public API của module — nơi khác chỉ import từ đây
```

## Nguyên tắc phụ thuộc

- Feature KHÔNG import feature khác. Cần dùng chung → nâng lên `components/ui`, `lib`, `hooks`.
- Server-side logic đặt ở `src/server/actions/<domain>.ts`, không nằm trong feature.
