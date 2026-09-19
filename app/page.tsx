import { checkUser } from "@/lib/checkUser";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

export default async function HomePage() {
  const user = await checkUser();

  // If user is already logged in, send them to the dashboard
  if (user) {
    redirect("/dashboard");
  }

  // If user is not logged in, show the landing page (NEVER redirect to "/")
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-5xl font-extrabold tracking-tight">
          Welcome to <span className="text-indigo-500">Calendra</span>
        </h1>
        <p className="text-gray-400 text-lg">
          Effortless scheduling for meetings, appointments, and client calls.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <SignInButton mode="modal">
            <button className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-medium transition text-white">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="px-6 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 font-medium transition text-gray-200 border border-gray-700">
              Get Started
            </button>
          </SignUpButton>
        </div>
      </div>
    </div>
  );
}