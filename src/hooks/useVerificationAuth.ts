import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  useSendResetCodeMutation,
  useVerifyCodeMutation,
} from "@redux/apis/auth/authApi";
import { useError } from "src/hooks/useError";
import { useResendTimer } from "src/hooks/useResendTimer";
import type { VerificationForm } from "src/screens/auth/verify/VerificationScreen.type";
import {
  VERIFICATION_RESEND_SECONDS,
} from "src/screens/auth/verify/VerificationScreen.constants";

export const useVerificationAuth = (
  t: (key: string, values?: Record<string, any>) => string,
  phone: string,
  userId: number | null,
  onSuccess: () => void
) => {
  const form = useForm<VerificationForm>({
    mode: "onChange",
    shouldFocusError: true,
    defaultValues: { code: "" },
  });

  const { handleApiError } = useError<VerificationForm>({ formMethods: form });

  const [verifyCodeApi, { isLoading: isVerifying }] = useVerifyCodeMutation();
  const [sendResetCodeApi, { isLoading: isResending }] =
    useSendResetCodeMutation();

  const { secondsLeft, isRunning, start } = useResendTimer();

  useEffect(() => {
    if (userId) {
      start(VERIFICATION_RESEND_SECONDS);
    }
  }, [userId, start]);

  const onSubmit: SubmitHandler<VerificationForm> = async (values) => {
    if (!phone) {
      form.setError("root", { type: "server", message: "auth.phone_invalid" });
      return;
    }

    if (!userId) return;

    try {
      await verifyCodeApi({
        userId: Number(userId),
        code: String(values.code).trim(),
      }).unwrap();

      onSuccess();
    } catch (err: any) {
      handleApiError(err);
    }
  };

  const handleResend = async () => {
    if (isRunning || isResending) return;

    if (!phone) {
      form.setError("root", { type: "server", message: "auth.phone_invalid" });
      return;
    }

    try {
      await sendResetCodeApi({ identifier: phone }).unwrap();
      start(VERIFICATION_RESEND_SECONDS);
    } catch (err: any) {
      handleApiError(err);
    }
  };

  const resendText = isRunning
    ? t("auth.resend_code_in", { s: secondsLeft })
    : t("auth.resend_code");

  return {
    form,
    isVerifying,
    isResending,
    onSubmit,
    handleResend,
    secondsLeft,
    isRunning,
    resendText,
  };
};
