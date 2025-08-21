"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToastStore } from "@/lib/useToast";
import { Loader2, Mail, Lock, LogIn } from "lucide-react";
import Link from "next/link";

const SignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInSchemaType = z.infer<typeof SignInSchema>;

export default function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
  });

  const router = useRouter();
  const { trigger } = useToastStore();

  const handleLogin = async (data: SignInSchemaType) => {
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (res?.error) {
      trigger("Sign in failed ❌", res.error);
    } else {
      trigger("Signed in ✅", "Redirecting to your dashboard...");
      router.push("/dashboard");
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="w-full max-w-md bg-gray-900 rounded-2xl border border-gray-800 shadow-xl p-8">
      <h1 className="text-3xl font-bold text-center text-blue-500 mb-6">
        Sign In
      </h1>

      <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
        {/* Email */}
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Email</label>
          <div className="relative">
            <input
              {...register("email")}
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Mail
              size={18}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500"
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Password</label>
          <div className="relative">
            <input
              {...register("password")}
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Lock
              size={18}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500"
            />
          </div>
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 transition font-semibold py-2 rounded-xl flex justify-center items-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <LogIn size={18} />
          )}
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="text-sm text-center text-gray-500 mt-6">or</div>

      {/* Google Button */}
      <div className="mt-4">
        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-white text-black hover:bg-gray-100 font-semibold py-2 rounded-xl flex justify-center items-center gap-2 cursor-pointer"
        >
          Sign in with Google
        </button>
      </div>

      {/* Link to SignUp */}
      <p className="text-sm text-center text-gray-400 mt-6">
        Don’t have an account?{" "}
        <Link
          href="/auth/signup"
          className="text-blue-400 hover:underline font-medium"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
