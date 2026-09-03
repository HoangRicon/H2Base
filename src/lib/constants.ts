/** Constants dùng chung toàn app — không magic values rải rác trong code. */

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "H2Base";

/** Số dòng mặc định cho các bảng phân trang trong trang quản lý. */
export const DEFAULT_PAGE_SIZE = 10;

/** Timeout chung cho API client (ms). */
export const API_TIMEOUT_MS = 30_000;
