import { checkUser } from "@/lib/checkUser";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import BookingUrlCard from "@/components/BookingUrlCard";

export default async function DashboardPage() {
  const user = await checkUser();

  if (!user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      {/* Top Header */}
      <header className="flex justify-between items-center pb-8 border-b border-gray-800 max-w-5xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-400 text-sm">Welcome back, {user.name}!</p>
        </div>
        <UserButton />
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto mt-8 space-y-6">
        {/* Dynamic Booking Link Card */}
        <BookingUrlCard initialUsername={user.username || ""} />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm font-medium">Upcoming Meetings</h3>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm font-medium">Event Types</h3>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>
        </div>
      </main>
    </div>
  );
}