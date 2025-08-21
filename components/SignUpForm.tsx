"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useToastStore } from "@/lib/useToast";
import { Mail, Lock, User, Loader2, UserPlus } from "lucide-react";
import Link from "next/link";
import { registerSchema } from "@/lib/validationSchemas";

import { z } from "zod";
type SignUpSchemaType = z.infer<typeof registerSchema>;

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(registerSchema),
  });

  const router = useRouter();
  const { trigger } = useToastStore();

  const handleSignup = async (data: SignUpSchemaType) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        trigger("Registration Failed ❌", result.message || "Unknown error.");
        return;
      }

      trigger("Account Created 🎉", "Please log in now!");
      router.push("/auth/signin");
    } catch (error) {
      console.error(error);
      trigger("Something went wrong ❌", "Please try again later.");
    }
  };

  const handleGoogleSignup = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="w-full max-w-md bg-gray-900 rounded-2xl border border-gray-800 shadow-xl p-8">
      <h1 className="text-3xl font-bold text-center text-blue-500 mb-6">
        Create an Account
      </h1>

      <form onSubmit={handleSubmit(handleSignup)} className="space-y-5">
        {/* Name */}
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Name</label>
          <div className="relative">
            <input
              {...register("name")}
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <User
              size={18}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500"
            />
          </div>
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

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

        {/* Confirm Password */}
        <div>
          <label className="text-sm text-gray-400 mb-1 block">
            Confirm Password
          </label>
          <div className="relative">
            <input
              {...register("confirmPassword")}
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Lock
              size={18}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500"
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-500 mt-1">
              {errors.confirmPassword.message}
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
            <UserPlus size={18} />
          )}
          {isSubmitting ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      {/* Divider */}
      <div className="text-sm text-center text-gray-500 mt-6">or</div>

      {/* Google Button */}
      <div className="mt-4">
        <button
          onClick={handleGoogleSignup}
          className="w-full bg-white text-black hover:bg-gray-100 font-semibold py-2 rounded-xl flex justify-center items-center gap-2 cursor-pointer"
        >
          Sign up with Google
        </button>
      </div>

      {/* Link to Sign In */}
      <p className="text-sm text-center text-gray-400 mt-6">
        Already have an account?{" "}
        <Link
          href="/auth/signin"
          className="text-blue-400 hover:underline font-medium"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
