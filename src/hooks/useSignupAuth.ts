import { useForm, type SubmitHandler } from "react-hook-form";
import { useSignupMutation } from "@redux/apis/auth/authApi";
import { useError } from "src/hooks/useError";
import { normalizeTNPhone } from "@utils/helpers/phone.helper";
import type { SignUpFormValues } from "src/screens/auth/signup/SignUpScreen.type";

const pickUserIdFromSignup = (res: any): number | null => {
  const candidates = [
    res?.data?.userId,
    res?.data?.user_id,
    res?.data?.id,
    res?.userId,
    res?.user_id,
    res?.id,
  ];

  for (const v of candidates) {
    const n = Number(v);
    if (Number.isFinite(n) && n > 0) return n;
  }

  return null;
};

export const useSignupAuth = (
  onSuccess: (userId: number, phone: string) => void
) => {
  const methods = useForm<SignUpFormValues>({
    defaultValues: {
      fullName: "",
      phone: "",
      address: "",
      password: "",
      passwordConfirmation: "",
    },
    mode: "onChange",
    shouldFocusError: true,
  });

  const { handleApiError } = useError<SignUpFormValues>({ formMethods: methods });

  const [signup, { isLoading }] = useSignupMutation();

  const onSubmit: SubmitHandler<SignUpFormValues> = async (values) => {
    const formattedPhone = normalizeTNPhone(values.phone).trim();

    try {
      const res = await signup({
        fullName: values.fullName.trim(),
        phone: formattedPhone,
        password: values.password,
        passwordConfirmation: values.passwordConfirmation,
        address: values.address.trim(),
      }).unwrap();

      const userId = pickUserIdFromSignup(res);

      if (!userId) {
        methods.setError("root", {
          type: "validate",
          message: "common.something_went_wrong",
        });
        return;
      }

      onSuccess(userId, formattedPhone);
    } catch (err: any) {
      handleApiError(err);
    }
  };

  return { methods, isLoading, onSubmit, handleApiError };
};
