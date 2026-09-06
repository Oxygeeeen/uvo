import { AccountSettings } from '@/components/account-settings';

export default function AccountPage() {
  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#9a742c]">
            Enterprise identity & controls
          </p>
          <h1 className="mt-2 text-[28px] font-semibold tracking-[-0.035em] text-[#17302e]">
            Account information
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#74817e]">
            Manage your verified profile, real-time workspace avatar, briefing
            preferences and account security.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#dfe6df] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#536360]">
          <span className="size-1.5 rounded-full bg-[#18a17f] shadow-[0_0_0_4px_rgba(24,161,127,0.12)]" />
          Enterprise controls active
        </span>
      </div>
      <AccountSettings />
    </div>
  );
}
