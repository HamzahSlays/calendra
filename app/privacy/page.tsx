export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto py-16 px-6 text-slate-800 dark:text-slate-100">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
        Calendra accesses Google Calendar data solely to check scheduling availability and insert confirmed calendar appointments on your behalf.
      </p>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        We do not store, sell, or share personal calendar details with any third parties.
      </p>
    </div>
  );
}