import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Custom hook bọc useMutation của TanStack Query với các cấu hình chuẩn cho ứng dụng.
 * Tự động bắt lỗi API và hiển thị toast, đồng thời invalidate query để UI tự render lại (Reactivity).
 */
export interface CrudMutationOptions<
  TData,
  TVariables,
> extends UseMutationOptions<TData, Error, TVariables> {
  /**
   * Query Key để invalidate (làm mới data) sau khi mutation success.
   * Thường truyền url của get list API.
   */
  queryKeyToInvalidate?: unknown[];
  /** Lời nhắn hiển thị khi thành công */
  successMessage?: string;
  /** Lời nhắn thông báo lỗi mặc định (nếu API không có cấu trúc chuẩn) */
  errorMessage?: string;
}

export function useCrudMutation<TData = unknown, TVariables = unknown>(
  options: CrudMutationOptions<TData, TVariables>,
) {
  const queryClient = useQueryClient();

  return useMutation<TData, Error, TVariables>({
    ...options,
    onSuccess: (data, variables, context) => {
      // Tự động invalidate dữ liệu bảng để UI tự load lại mà không cần reload web
      if (options.queryKeyToInvalidate) {
        queryClient.invalidateQueries({
          queryKey: options.queryKeyToInvalidate,
        });
      }
      if (options.successMessage) {
        toast.success(options.successMessage);
      }
      options.onSuccess?.(data, variables, context);
    },
    onError: (error: any, variables, context) => {
      // Ưu tiên bóc tách message từ response trả về nếu có theo format chuẩn của backend
      const backendMsg = error?.response?.data?.message || error?.message;
      const finalErrorMsg =
        backendMsg || options.errorMessage || "Đã có lỗi xảy ra. Hãy thử lại.";

      toast.error(finalErrorMsg);

      options.onError?.(error, variables, context);
    },
  });
}
