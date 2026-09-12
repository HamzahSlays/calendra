import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white p-6">
      <h1 className="text-4xl font-bold mb-4">Calendra</h1>
      <p className="text-gray-400 mb-8">Event Scheduling & Calendar Platform</p>

      <SignedOut>
        <div className="flex gap-4">
          <SignInButton mode="modal">
            <button className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition">
              Sign Up
            </button>
          </SignUpButton>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex flex-col items-center gap-4">
          <p className="text-green-400 font-medium">You are authenticated!</p>
          <UserButton afterSignOutUrl="/" />
        </div>
      </SignedIn>
    </main>
  );
}