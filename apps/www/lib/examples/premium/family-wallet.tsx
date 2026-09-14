"use client";

import { FamilyWallet } from "@cronus-ui/ui";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

export const examples: Example[] = [
  {
    id: "sign-in",
    title: "Sign in drawer",
    description:
      "Sign In opens a rounded Family drawer. Socials, Email/Phone/Passkey, OTP after Continue, a waiting-passkey orb, and Connect Wallet. Views pop-layout while the shell height tweens.",
    code: `<FamilyWallet />`,
    preview: (
      <div className="flex w-full justify-center overflow-hidden rounded-3xl">
        <FamilyWallet />
      </div>
    ),
  },
];

/** Stacked list view for `/components/family-wallet`; loaded on its own by the premium family. */
export default function FamilyWalletExamples() {
  return <ExampleList examples={examples} />;
}
