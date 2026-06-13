import { useState } from "react";
import type { FormEvent } from "react";
import { Mail, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { FloatingInput } from "./FloatingInput";
import { PasswordField } from "./PasswordField";
import { AuthSubmitButton } from "./AuthSubmitButton";
import { SocialAuthButtons } from "./SocialAuthButtons";
import { isNonEmpty, isValidEmail } from "../../utils/authValidation";
import { evaluatePasswordStrength } from "../../utils/passwordStrength";
import { useRegister } from "../../hooks/useAuthMutation";

type RegisterFormProps = {
  redirectTo: string;
  dimmed?: boolean;
  onShake?: () => void;
};

export function RegisterForm({
  redirectTo,
  dimmed,
  onShake,
}: RegisterFormProps) {
  const { t } = useTranslation("auth");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const register = useRegister({ redirectTo });

  const validate = () => {
    const next: typeof fieldErrors = {};
    if (!isNonEmpty(fullName)) next.fullName = String(t("validation.required"));
    if (!isNonEmpty(email)) {
      next.email = String(t("validation.required"));
    } else if (!isValidEmail(email)) {
      next.email = String(t("validation.emailInvalid"));
    }
    if (!isNonEmpty(password)) {
      next.password = String(t("validation.required"));
    } else if (password.length < 8) {
      next.password = String(t("validation.passwordMin"));
    }
    if (!isNonEmpty(confirmPassword)) {
      next.confirmPassword = String(t("validation.required"));
    } else if (confirmPassword !== password) {
      next.confirmPassword = String(t("validation.passwordMismatch"));
    }
    setFieldErrors(next);
    if (Object.keys(next).length > 0) {
      onShake?.();
      return false;
    }
    return true;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (register.isPending) return;
    if (!validate()) {
      toast.error(String(t("validation.registerIncomplete")));
      return;
    }

    const strength = evaluatePasswordStrength(password);
    if (strength.level === "weak" && strength.score < 3) {
      setFieldErrors((current) => ({
        ...current,
        password: String(t("validation.passwordMin")),
      }));
      onShake?.();
      return;
    }

    register.mutate({
      fullName: fullName.trim(),
      email: email.trim(),
      passwordHash: password,
    });
  };

  return (
    <form
      className={`auth-form auth-form--register ${dimmed ? "auth-form--dimmed" : ""}`}
      onSubmit={handleSubmit}
      noValidate
    >
      <FloatingInput
        name="fullName"
        label={String(t("form.fullNameLabel"))}
        autoComplete="name"
        disabled={register.isPending}
        value={fullName}
        onChange={(event) => setFullName(event.target.value)}
        error={fieldErrors.fullName}
        leadingIcon={<UserRound aria-hidden="true" />}
        onBlurValidate={(value) =>
          isNonEmpty(value) ? undefined : String(t("validation.required"))
        }
      />

      <FloatingInput
        name="email"
        type="email"
        label={String(t("form.emailLabel"))}
        autoComplete="email"
        disabled={register.isPending}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        error={fieldErrors.email}
        leadingIcon={<Mail aria-hidden="true" />}
        onBlurValidate={(value) => {
          if (!isNonEmpty(value)) return String(t("validation.required"));
          if (!isValidEmail(value)) return String(t("validation.emailInvalid"));
          return undefined;
        }}
      />

      <PasswordField
        name="password"
        label={String(t("form.passwordLabel"))}
        autoComplete="new-password"
        disabled={register.isPending}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        error={fieldErrors.password}
        showStrength
        onBlurValidate={(value) => {
          if (!isNonEmpty(value)) return String(t("validation.required"));
          if (value.length < 8) return String(t("validation.passwordMin"));
          return undefined;
        }}
      />

      <PasswordField
        name="confirmPassword"
        label={String(t("form.confirmPasswordLabel"))}
        autoComplete="new-password"
        disabled={register.isPending}
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        error={fieldErrors.confirmPassword}
        onBlurValidate={(value) => {
          if (!isNonEmpty(value)) return String(t("validation.required"));
          if (value !== password)
            return String(t("validation.passwordMismatch"));
          return undefined;
        }}
      />

      <AuthSubmitButton loading={register.isPending}>
        {register.isPending
          ? t("form.submittingRegister")
          : t("form.submitRegister")}
      </AuthSubmitButton>

      <SocialAuthButtons />
    </form>
  );
}
