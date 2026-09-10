export const DEFAULT_PAGE_SIZE = 10;

/** Timeout chung cho API client (ms). */
export const API_TIMEOUT_MS = 30_000;

/**
 * Kích thước sidebar (rail + panel). Class Tailwind đặt dạng literal tĩnh
 * để JIT scanner thấy được — không compose chuỗi động.
 * - Rail: luôn hiện trên desktop, icon + nhãn nhỏ bên dưới.
 * - Panel: hiện CẠNH rail khi bấm section có menu con — overlay, không push nội dung.
 */
export const SIDEBAR_CLASSES = {
  railWidth: "w-20",
  panelWidth: "w-64",
  /** Vị trí panel: sát cạnh phải của rail. */
  panelLeft: "left-20",
  /** Nội dung luôn chừa đúng chiều rộng rail. */
  contentPush: "md:ml-20",
} as const;
