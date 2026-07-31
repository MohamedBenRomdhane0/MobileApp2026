import { StyleSheet } from "react-native";
import { AppColors } from "src/theme/types";
export const CustomTextFieldStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    marginBottom: 16,
    width: "100%",
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '600',
    color: colors.header,
    textAlign: 'right',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.card,
    color: colors.text,
    fontSize: 16,
    textAlign: 'right', 
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  inputError: {
    borderColor: colors.danger,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: colors.danger,
    textAlign: 'right',
  },
  disabledInput: {
    backgroundColor: colors.bg,
    color: colors.muted,
    borderColor: colors.border,
    opacity: 0.8,
  },
})