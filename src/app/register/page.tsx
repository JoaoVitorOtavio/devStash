import { RegisterForm } from "@/components/auth/register-form";
import { Navbar } from "@/components/homepage/navbar";

export default function RegisterPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex min-h-screen items-center justify-center p-4 pt-24">
        <RegisterForm />
      </div>
    </div>
  );
}
