import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";

import CustomTextField from "@components/inputs/customTextField/CutsomTextField";
import type { InputConfig } from "types/interfaces/InputConfig";

type Props = {
  config: InputConfig;
  passwordName?: string; 
  mismatchMessageKey?: string; 
};

export default function PasswordConfirmationField({
  config,
  passwordName = "password",
  mismatchMessageKey = "auth.password_not_match",
}: Props) {
  const { getValues } = useFormContext<any>();

  const mergedConfig = useMemo<InputConfig>(
    () => ({
      ...config,
      rules: {
        ...config.rules,
        validate: (v: string) => v === getValues(passwordName) || mismatchMessageKey,
      },
    }),
    [config, getValues, passwordName, mismatchMessageKey]
  );

  return <CustomTextField config={mergedConfig} />;
}