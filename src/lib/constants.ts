export const DEFAULT_PAGE_SIZE = 10;

/** Timeout chung cho API client (ms). */
export const API_TIMEOUT_MS = 30_000;

/**
 * Kích thước sidebar (rail + panel phụ). Class Tailwind đặt dạng literal tĩnh
 * để JIT scanner thấy được — không compose chuỗi động.
 * - Rail: luôn hiện trên desktop, icon + nhãn nhỏ bên dưới.
 * - Panel phụ: hiện CẠNH rail khi bấm section có menu con — nằm trong flex,
 *   mở ra PUSH nội dung sang phải (animate width w-0 ↔ w-72).
 */
export const SIDEBAR_CLASSES = {
  railWidth: "w-24",
  panelWidth: "w-72",
} as const;
