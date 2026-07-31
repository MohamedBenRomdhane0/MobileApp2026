import type { Path, UseFormReturn, FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "@redux/hooks";
import { showError } from "@redux/slices/snackbarSlice";
import { HttpStatusEnum } from "@config/enums/httpStatus.enum";

interface UseErrorProps<T extends FieldValues> {
  formMethods: UseFormReturn<T>;
}

export function useError<T extends FieldValues>({ formMethods }: UseErrorProps<T>) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const handleApiError = (error: any) => {
    const status = error?.status;
    const data = error?.data;

    switch (status) {
      case HttpStatusEnum.UNPROCESSABLE_CONTENT:
      case HttpStatusEnum.UNAUTHORIZED: {
        if (data?.errors && typeof data.errors === "object") {
          Object.entries(data.errors).forEach(([key, value]) => {
            const message = Array.isArray(value) ? value[0] : value;

            formMethods.setError(key as Path<T>, {
              type: "server",
              message: String(message),
            });
          });
          return;
        }

        if (data?.message || data?.error) {
          dispatch(showError(t(String(data.message || data.error))));
          return;
        }

        dispatch(showError(t("common.something_went_wrong")));
        return;
      }

      default:
        dispatch(showError(t("common.something_went_wrong")));
        return;
    }
  };

  return { handleApiError };
}