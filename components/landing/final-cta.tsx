import { SignUpButton } from "@clerk/nextjs";

export function FinalCta() {
  return (
    <section className="bg-gradient-to-b from-[#fbfcfe] to-[#eaf3ff] px-6 py-20">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-semibold leading-tight tracking-tight text-[#082238] sm:text-5xl">
          Ready to take the friction out of scheduling?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
          Join thousands of professionals saving hours each week on calendar coordination.
        </p>

        <div className="mt-8 flex justify-center">
          <SignUpButton mode="modal">
            <button className="cursor-pointer rounded-full bg-[#0069ff] px-8 py-3.5 text-base font-semibold text-white shadow-[0_10px_28px_-10px_rgba(0,105,255,0.7)] transition hover:bg-[#0057d6]">
              Get started free
            </button>
          </SignUpButton>
        </div>
      </div>
    </section>
  );
}