/** Constants dùng chung toàn app — không magic values rải rác trong code. */

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "H2Base";

/** Số dòng mặc định cho các bảng phân trang trong trang quản lý. */
export const DEFAULT_PAGE_SIZE = 10;

/** Timeout chung cho API client (ms). */
export const API_TIMEOUT_MS = 30_000;

/**
 * Kích thước sidebar (px). Rail luôn gọn; hover mở overlay, pin mới push nội dung.
 * Class Tailwind đặt dạng literal tĩnh để JIT scanner thấy được.
 */
export const SIDEBAR_WIDTH_COLLAPSED_PX = 64;
export const SIDEBAR_WIDTH_EXPANDED_PX = 240;

export const SIDEBAR_CLASSES = {
  widthCollapsed: "w-16",
  widthExpanded: "w-60",
  /** Margin cho nội dung — literal tĩnh đầy đủ để Tailwind JIT thấy (không compose động). */
  contentPushCollapsed: "md:ml-16",
  contentPushExpanded: "md:ml-60",
} as const;
