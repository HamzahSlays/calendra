import { checkUser } from "@/lib/checkUser";
import { redirect } from "next/navigation";
import { getUserAvailability } from "@/actions/availability";
import AvailabilityForm from "@/components/AvailabilityForm";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default async function AvailabilityPage() {
  const user = await checkUser();
  if (!user) redirect("/");

  const availability = (await getUserAvailability()) || [];

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <header className="flex justify-between items-center pb-8 border-b border-gray-800 max-w-5xl mx-auto">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-xs text-gray-400 hover:text-white transition"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-xl font-bold">Set Weekly Availability</h1>
        </div>
        <UserButton />
      </header>

      <main className="max-w-5xl mx-auto mt-8">
        <p className="text-sm text-gray-400 mb-6">
          Define the regular days and hours when you are free to accept meetings.
        </p>
        <AvailabilityForm initialData={availability} />
      </main>
    </div>
  );
}