# H2Base — Code base chuẩn cho webapp quản lý (Next.js Fullstack)

H2Base là code base dùng chung để khởi động **mọi dự án webapp quản trị** — Quản lý bán hàng, kho, CRM, HRM, phòng khám, trường học... — trong vài phút. Khởi nguồn từ TailAdmin (Next.js + Tailwind) đã được refactor theo feature-based, có data layer fullstack sẵn khung và bộ rule clean code được tooling ép buộc.

Stack: **Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind CSS v4 · Zod · ESLint 9 + Prettier**

## Bắt đầu dự án mới trong 10 phút

```bash
# 1. Lấy code base
git clone <repo-này> my-app && cd my-app
npm install

# 2. Dọn thành dự án của bạn (rename app, reset dashboard, list demo để xóa)
npm run new:project

# 3. Xóa các demo module không dùng (script sẽ liệt kê sẵn lệnh)
#    VD: rm -rf src/features/calendar "src/app/(admin)/calendar"

# 4. Copy module mẫu và bắt đầu nghiệp vụ đầu tiên
cp -r src/features/_template src/features/orders

# 5. Chạy
npm run dev
```

Ba việc khi thêm một domain module mới (bất kỳ nghiệp vụ gì):

1. Copy `src/features/_template/` → `src/features/<domain>/`.
2. Tạo route `src/app/(admin)/<domain>/page.tsx` import từ feature.
3. Thêm 1 entry menu trong `src/components/layout/nav-items.tsx`.

Xóa nghiệp vụ = xóa đúng 1 thư mục feature + 1 route. Không chặt lan man.

## Cấu trúc thư mục

```text
src/
├── app/                    # Routing only — pages, layouts, route handlers
│   ├── (admin)/            #   khu vực quản trị (sidebar + header)
│   ├── (auth)/             #   signin / signup
│   ├── (error-pages)/      #   404...
│   └── api/                #   REST route handlers (khi cần)
├── components/
│   ├── ui/                 # UI primitives: button, table, form, chart, modal...
│   ├── layout/             # Khung admin: AppSidebar, AppHeader, nav-items
│   └── shared/             # Dùng chung không primitive: ComponentCard, Breadcrumb...
├── features/               # ★ Domain modules — trái tim code base
│   ├── _template/          #   module mẫu rỗng (copy khi tạo module mới)
│   ├── dashboard/  auth/  calendar/  charts/  forms/  tables/  media/  profile/
│   └── <domain>/
│       ├── components/     #   UI riêng domain
│       ├── hooks/          #   hooks riêng domain
│       ├── types.ts        #   type riêng domain
│       └── index.ts        #   public API — nơi khác chỉ import từ đây
├── hooks/                  # Cross-feature hooks (useModal, useGoBack)
├── context/                # Providers toàn app (Sidebar, Theme)
├── lib/                    # api-client, utils (cn), constants
├── server/actions/         # Server Actions theo domain (zod validate đầu vào)
└── types/                  # Type dùng chung toàn app
```

Nguyên tắc phụ thuộc một chiều: `app → features → (ui/lib/hooks/types)`. Feature không import feature. Chi tiết: [CLEANCODE.md](./CLEANCODE.md).

## Data layer — "cắm" backend của bạn

- Client gọi API qua `api` từ `@/lib/api-client` (typed, error chuẩn `ApiError`, base URL từ env).
- Server-side: đặt Server Action trong `src/server/actions/<domain>.ts`, validate input bằng zod — xem mẫu `src/server/actions/example.ts`.
- Biến môi trường: copy `.env.example` → `.env.local`, điền `NEXT_PUBLIC_APP_NAME` + `NEXT_PUBLIC_API_BASE_URL`.

## Quality gates (bắt buộc trước khi merge)

```bash
npm run lint          # ESLint: cấm any, console, import ../.., circular deps
npm run format:check  # Prettier thống nhất toàn repo
npm run build         # Next.js production build
```

Bộ rule đầy đủ (13 rule, mapping sang ESLint/Prettier): [CLEANCODE.md](./CLEANCODE.md). AI agent đọc: [AGENTS.md](./AGENTS.md).

## Workflow spec-driven (OpenSpec)

Thay đổi lớn đi qua spec trước khi code: `openspec/changes/<change>/` chứa proposal → specs (requirements + scenarios Given/When/Then) → design → tasks. Validate bằng `openspec validate <change> --strict`. Đọc `AGENTS.md` để biết luồng chi tiết.

## Credits

UI gốc từ [TailAdmin](https://tailadmin.com) — Tailwind admin dashboard template (MIT). H2Base refactor cấu trúc, thêm data layer + rule + luồng khởi động nhanh.

## License

MIT
