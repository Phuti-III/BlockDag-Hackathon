import { RegisterForm } from "@/components/register-form";

export default function RegisterPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="rounded-xl bg-white p-8 shadow-lg">
        <RegisterForm />
      </div>
    </div>
  );
}
