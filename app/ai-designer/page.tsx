import Link from "next/link";
import { AIWizard } from "@/components/AIWizard";
import { PrimaryButton } from "@/ui/PrimaryButton";

export default function AIDesignerPage() {
  return (
    <section className="space-y-4">
      <AIWizard />
      <Link href="/proposal" className="block">
        <PrimaryButton className="w-full">Go to Proposal Page</PrimaryButton>
      </Link>
    </section>
  );
}
