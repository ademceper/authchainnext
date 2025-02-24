import { LoginForm } from "@/components/shared/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication | Sign In",
  description: "Sign In page for authentication.",
};

export default function LoginPage() {
  return <LoginForm />;
}
