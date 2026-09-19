import { checkUser } from "@/lib/checkUser";
import { redirect } from "next/navigation";
import { SignUpButton } from "@clerk/nextjs";

export default async function HomePage() {
  const user = await checkUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#fbfbfb] text-[#0b3558] flex flex-col items-center">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-[#092640] leading-[1.1]">
          All the work around <br />
          meetings, <span className="text-[#0069ff]">handled.</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          From automated scheduling to instant calendar sync and reminders, get the busywork done with fewer tools and less effort.
        </p>

        {/* Auth Buttons: Google & Microsoft Look */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <SignUpButton mode="modal">
            <button className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#0b3558] hover:bg-[#081d33] text-white px-6 py-3.5 rounded-xl font-semibold shadow-sm transition hover:shadow-md cursor-pointer">
              <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>
              <span>Sign up with Google</span>
            </button>
          </SignUpButton>

          <SignUpButton mode="modal">
            <button className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#0b3558] hover:bg-[#081d33] text-white px-6 py-3.5 rounded-xl font-semibold shadow-sm transition hover:shadow-md cursor-pointer">
              <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
                <svg className="w-3.5 h-3.5" viewBox="0 0 21 21">
                  <path fill="#f25022" d="M1 1h9v9H1z" />
                  <path fill="#00a4ef" d="M1 11h9v9H1z" />
                  <path fill="#7fba00" d="M11 1h9v9h-9z" />
                  <path fill="#ffb900" d="M11 11h9v9h-9z" />
                </svg>
              </div>
              <span>Sign up with Microsoft</span>
            </button>
          </SignUpButton>
        </div>

        <div className="mt-4 text-xs text-gray-500 flex items-center justify-center gap-2">
          <SignUpButton mode="modal">
            <button className="underline hover:text-black font-medium cursor-pointer">
              Sign up with email
            </button>
          </SignUpButton>
          <span>•</span>
          <span>No credit card required</span>
        </div>
      </section>

      {/* Blue Gradient Curved Display Card Container */}
      <div className="w-full max-w-5xl px-4 mt-6 pb-24">
        <div className="h-64 sm:h-96 rounded-3xl bg-gradient-to-b from-[#bde2ff]/80 to-[#eef7ff]/30 border border-[#bde2ff] shadow-sm flex flex-col items-center justify-start pt-6">
          {/* Floating Pill Badges */}
          <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-sm border border-gray-100">
            <span className="p-2 bg-blue-50 rounded-xl text-[#0069ff] font-bold">⏳</span>
            <span className="p-2 bg-purple-50 rounded-xl text-purple-600 font-bold">✨</span>
            <span className="p-2 bg-emerald-50 rounded-xl text-emerald-600 font-bold">🍃</span>
            <span className="p-2 bg-amber-50 rounded-xl text-amber-600 font-bold">💳</span>
          </div>
        </div>
      </div>
    </div>
  );
}