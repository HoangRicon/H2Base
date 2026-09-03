# Design: unified-codebase-refactor

> Góc nhìn kỹ thuật (How). Đối chiếu constitution §2 (Code Quality), §6 (Doc Separation): file này chứa quyết định kỹ thuật, không lặp lại yêu cầu sản phẩm từ spec.md.

## D1. Cấu trúc thư mục đích (quyết định chính)

```text
H2Base/
├── openspec/                      # Spec artifacts (giữ nguyên workflow)
├── public/
├── scripts/
│   └── new-project.mjs            # Script dọn demo khi tạo dự án mới
├── src/
│   ├── app/                       # CHỈ routing — App Router
│   │   ├── (admin)/               # Group route có AdminLayout (sidebar + header)
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx           # Dashboard trống (sau refactor)
│   │   │   └── [module]/page.tsx  # Route mount feature module
│   │   ├── (auth)/                # Group route auth (signin/signup)
│   │   ├── (marketing)/           # Group route trang công khai (nếu cần)
│   │   ├── api/                   # Route Handlers (REST endpoints)
│   │   ├── layout.tsx             # Root layout (providers, fonts)
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                    # UI primitives theo component (mỗi thư mục 1 component)
│   │   │   ├── button/            #   button/Button.tsx, button/index.ts
│   │   │   ├── table/
│   │   │   ├── form/
│   │   │   ├── chart/
│   │   │   ├── modal/  badge/  avatar/  alert/  dropdown/ ...
│   │   ├── layout/                # AppHeader, AppSidebar, Backdrop, SidebarWidget
│   │   └── shared/                # ComponentCard, PageBreadcrumb, ThemeToggler...
│   ├── features/                  # ★ Domain modules — trái tim của code base
│   │   ├── dashboard/             # Trang chủ mẫu (sau dọn demo)
│   │   ├── auth/                  # SignIn/SignUp form + logic
│   │   ├── calendar/
│   │   ├── charts/                # (bar/line demo)
│   │   ├── forms/                 # (form-elements demo)
│   │   ├── tables/               # (basic-tables demo)
│   │   ├── profile/
│   │   └── _template/             # Module mẫu rỗng — copy khi tạo domain mới
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── types.ts
│   │       └── index.ts
│   ├── hooks/                     # Cross-feature hooks (useModal, useGoBack)
│   ├── context/                   # Providers dùng toàn app (Sidebar, Theme)
│   ├── lib/                       # Hạ tầng dùng chung (không phải UI)
│   │   ├── api-client.ts          # Typed fetch wrapper: base URL env, error normalize
│   │   ├── utils.ts               # cn() + helpers thuần
│   │   └── constants.ts
│   ├── server/                    # ★ Server-side only
│   │   └── actions/               # Server Actions theo domain (zod validate đầu vào)
│   ├── types/                     # Type domain dùng chung toàn app
│   └── icons/
├── .env.example
├── AGENTS.md                      # Rule cho AI agent (đọc mỗi session)
├── CLEANCODE.md                   # Bộ rule clean code cho người
├── eslint.config.mjs              # Flat config duy nhất (xóa .eslintrc.json)
├── package.json                   # + format, format:check, new:project scripts
├── prettier.config.js             # Bổ sung printWidth, trailingComma
└── tsconfig.json                  # Giữ @/* → ./src/*
```

### Vì sao chọn cấu trúc này (alternatives đã cân nhắc)

| Phương án                                                                              | Lý do không chọn                                                                                                               |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Giữ nguyên kiểu TailAdmin** (`components/ecommerce`, `components/form`... theo loại) | Feature phân tán nhiều nơi; thêm/xóa nghiệp vụ phải chặt khắp 5 thư mục; không scale cho N dự án quản lý                       |
| **FSD (feature-sliced design)**                                                        | Chuẩn nhưng cộng đồng Next.js ít dùng, thêm khái niệm `entities/shared` gây tốn công học cho AI + dev mới                      |
| **Chọn: App Router chuẩn cộng đồng + `features/`**                                     | Next.js docs chính thức khuyến nghị nhóm theo feature; AI agent hiểu ngay từ README Next.js; thêm module = 1 thư mục + 1 route |

Nguyên tắc phụ thuộc một chiều (no circular deps — constitution §2):

```text
app → features → (components/ui, lib, hooks, types)
features KHÔNG import features (muốn dùng chung → hạ lên components/ui | lib | hooks)
components/ui KHÔNG import features
server/ KHÔNG import components (trừ server components trong features)
```

Kiểm tra bằng ESLint rule `import/no-cycle` (runtime-enforced, không chỉ trên giấy).

### Chuyển đổi (mapping) từ cấu trúc cũ

| Hiện tại                                             | Chuyển đến                                                                                                                                       |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/layout/AppSidebar.tsx` + menu hardcode 383 dòng | `src/components/layout/` + menu items tách thành `src/features/navigation/menu-items.ts` (khai báo theo domain — thêm module mới = thêm 1 entry) |
| `src/components/ecommerce/*`                         | `src/features/dashboard/*`                                                                                                                       |
| `src/components/auth/*`                              | `src/features/auth/*`                                                                                                                            |
| `src/components/calendar                             | user-profile                                                                                                                                     | charts | form | tables/*` | `src/features/<tên>/*` tương ứng |
| `src/components/common/*`                            | `src/components/shared/*`                                                                                                                        |
| `src/components/example/*`                           | `src/features/forms/*` (gộp demo forms)                                                                                                          |
| `src/components/ui/*`                                | giữ `src/components/ui/*` (đã đúng chỗ)                                                                                                          |
| `src/components/header/*`                            | `src/components/layout/*`                                                                                                                        |
| `src/components/videos/*`                            | `src/features/media/*`                                                                                                                           |
| `src/app/(admin)/(others-pages)/...`                 | `src/app/(admin)/calendar`, `/charts`, ... (bỏ nesting group thừa)                                                                               |

## D2. Bộ rule clean code (chất liệu cho CLEANCODE.md + AGENTS.md)

### Quy tắc cấu trúc

1. File component: `PascalCase.tsx`, export named (đồng nhất), folder cha `kebab-case`.
2. 1 component = 1 file chính; file > 250 dòng → tách.
3. Server/Client tách bạch: `"use client"` chỉ xuất hiện trong `components/`, `features/`, `hooks/` — không trong `server/`.
4. Cấm `../../` trở lên (ESLint `no-restricted-imports` pattern) — dùng `@/`.

### Quy tắc code

5. TS strict, cấm `any` (ESLint `@typescript-eslint/no-explicit-any: error`).
6. Cấm `console.*` trong code commit (`no-console: error`) — thay bằng `logger` wrapper đặt tại `lib/logger.ts` khi cần.
7. Không magic values — constants đặt tên trong `lib/constants.ts` hoặc colocated `*.const.ts`.
8. Type đặt 1 nơi: `src/types/` (dùng chung) hoặc `features/<x>/types.ts` (riêng module); cấm định nghĩa lại cùng 1 type ở 2 nơi.
9. Tên thể hiện ý đồ: `getOrdersByCustomer` thay `fetchData2`; boolean có `is/has/should` prefix.
10. Mọi Server Action validate bằng zod schema trước khi chạm data.

### Quy tắc tooling (CI-enforced)

11. `npm run lint` = ESLint (flat config) + `prettier --check` — bắt buộc pass.
12. `npm run build` pass là điều kiện merge.
13. `prettier-plugin-tailwindcss` sort class tự động (đã có) — giữ.

### Tại sao rule này

- Mỗi rule map trực tiếp vào ESLint/Prettier để **tooling ép buộc**, không phụ thuộc kỷ luật con người.
- Danh sách ngắn (13) — rule quá dài không ai đọc, kể cả AI.

## D3. Data layer khung

```ts
// src/lib/api-client.ts (khung)
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

export class ApiError extends Error {
  /* status, payload chuẩn */
}

export async function apiClient<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) throw new ApiError(res.status, await safeJson(res));
  return res.json();
}
```

- `.env.example`: `NEXT_PUBLIC_API_BASE_URL=`, `NEXT_PUBLIC_APP_NAME=` — script `new:project` đọc để rename app.
- Server Actions theo pattern: `input → zod.parse → service → typed return`; mỗi domain 1 file action.
- Khuyến nghị (chưa cài đặt trong change này): `Prisma/Drizzle + NextAuth` khi dự án cần DB thật — đã chừa chỗ `src/server/db/` trong docs.

## D4. Luồng "bắt đầu nhanh" (script + docs)

`scripts/new-project.mjs` (Node, không dependency):

1. Hỏi tên dự án → thay `package.json` name + `NEXT_PUBLIC_APP_NAME`.
2. Đặt `src/app/(admin)/page.tsx` thành dashboard trống (dùng `features/_template`).
3. Liệt kê thư mục demo trong `features/` kèm lệnh xóa gợi ý — KHÔNG tự xóa (an toàn, user quyết).
4. In checklist bước tiếp theo.

CI/verify: script chạy được bằng `node scripts/new-project.mjs` trên bản clean (dry-run mode).

## D5. Risks & mitigations

| Risk                                                            | Mitigation                                                                                                 |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Move 105 file dễ vỡ import                                      | Di chuyển theo nhóm nhỏ + `npm run build` sau mỗi nhóm; đổi import bằng find-sed có kiểm soát + IDE rename |
| Demo pages reference component cũ                               | Mapping table ở trên là checklist bắt buộc complete trước khi build                                        |
| `no-console: error` phát nổ ở code cũ (template có console.log) | Format task: thay/clean hết trong phase refactor trước khi bật rule                                        |
| Script xóa demo phá repo user                                   | Script chỉ list + dry-run, không tự xóa                                                                    |

## D6. Test strategy

- Refactor thuần di chuyển file: test chính = `npm run build` pass + các trang demo vẫn render (cùng routes giữ nguyên) sau từng nhóm task.
- `scripts/new-project.mjs`: chạy trên copy repo, verify `git status` chỉ thay đổi đúng các file dự kiến.
- Rule lint: verify bằng cách cố tình thêm 1 file có `console.log` + `any` → lint phải fail.
- Change này không thêm test unit (out of scope) — khuyến nghị change tiếp theo cài Vitest + Testing Library để TDD từ module đầu tiên.
