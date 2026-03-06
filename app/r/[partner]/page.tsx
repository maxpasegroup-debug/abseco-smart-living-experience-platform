import { redirect } from "next/navigation";

export default function PartnerReferralRedirect({ params }: { params: { partner: string } }) {
  redirect(`/?ref=${encodeURIComponent(params.partner)}`);
}
