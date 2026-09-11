import { useForm, type SubmitHandler } from "react-hook-form";
import { useLoginMutation } from "@redux/apis/auth/authApi";
import type { LoginRequest } from "@redux/apis/auth/authApi.type";
import { useError } from "src/hooks/useError";
import { normalizeTNPhone } from "@utils/helpers/phone.helper";
import type { SignInFormData } from "src/screens/auth/login/SignInScreen.type";

export const useLoginAuth = (onSuccess?: () => void) => {
  const methods = useForm<SignInFormData>({
    mode: "onChange",
    shouldFocusError: true,
    defaultValues: { phone: "", password: "" },
  });

  const { handleApiError } = useError<SignInFormData>({ formMethods: methods });

  const [login, { isLoading }] = useLoginMutation();

  const onSubmit: SubmitHandler<SignInFormData> = async (values) => {
    try {
      const formattedPhone = normalizeTNPhone(values.phone);

      const loginPayload: LoginRequest = {
        phone: formattedPhone,
        password: values.password,
      };

      await login(loginPayload).unwrap();
      onSuccess?.();
    } catch (err: any) {
      handleApiError(err);
    }
  };

  return { methods, isLoading, onSubmit, handleApiError };
};
