"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/layout/icon";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface BankDetails {
  accountHolder: string;
  accountNumber: string;
  bankName: string;
  branchName: string;
  instructions: string;
}

export function PaymentSettingsForm() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Payment method toggles
  const [cardEnabled, setCardEnabled] = useState<boolean>(true);
  const [bankTransferEnabled, setBankTransferEnabled] = useState<boolean>(true);
  const [codEnabled, setCodEnabled] = useState<boolean>(false);

  // Bank account details
  const [accountHolder, setAccountHolder] = useState<string>(
    "TRANS ASIA CELLULAR PVT LTD"
  );
  const [accountNumber, setAccountNumber] = useState<string>("1000060278");
  const [bankName, setBankName] = useState<string>("COMMERCIAL BANK");
  const [branchName, setBranchName] = useState<string>("KEYZER STREET BRANCH");
  const [instructions, setInstructions] = useState<string>(
    "Please transfer the total amount and WhatsApp your deposit slip with Order ID to 077 339 2727"
  );

  useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/settings/payments`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            const d = json.data;
            if (d.cardEnabled !== undefined) setCardEnabled(Boolean(d.cardEnabled));
            if (d.bankTransferEnabled !== undefined)
              setBankTransferEnabled(Boolean(d.bankTransferEnabled));
            if (d.codEnabled !== undefined) setCodEnabled(Boolean(d.codEnabled));

            if (d.bankDetails) {
              if (d.bankDetails.accountHolder)
                setAccountHolder(d.bankDetails.accountHolder);
              if (d.bankDetails.accountNumber)
                setAccountNumber(d.bankDetails.accountNumber);
              if (d.bankDetails.bankName) setBankName(d.bankDetails.bankName);
              if (d.bankDetails.branchName)
                setBranchName(d.bankDetails.branchName);
              if (d.bankDetails.instructions)
                setInstructions(d.bankDetails.instructions);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load payment settings:", err);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch(`${API_URL}/api/settings/payments`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardEnabled,
          bankTransferEnabled,
          codEnabled,
          acceptedCardBrands: ["visa", "mastercard"],
          bankDetails: {
            accountHolder,
            accountNumber,
            bankName,
            branchName,
            instructions,
          },
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setStatusMessage({
          type: "success",
          text: "Payment options and Bank Account details updated successfully! Updated details are live on the customer checkout.",
        });
      } else {
        throw new Error(json.message || "Failed to update payment settings");
      }
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.message || "Network error while saving payment settings.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <section className="space-y-6">
        {statusMessage && (
          <div
            className={`rounded-base p-4 text-[14px] ${
              statusMessage.type === "success"
                ? "bg-success-50 text-success-700 border border-success-200"
                : "bg-error-50 text-error-700 border border-error-200"
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        {/* 1. Payment Methods Control */}
        <div className="rounded-card border border-surface-line bg-surface-card p-6 shadow-card">
          <div className="flex items-center justify-between border-b border-surface-line pb-3">
            <div>
              <h2 className="text-[18px] font-semibold text-ink-900">
                Payment Gateways & Methods
              </h2>
              <p className="mt-1 text-[13px] text-ink-500">
                Configure active payment methods available to customers during checkout.
              </p>
            </div>
            {loading && (
              <span className="text-[12px] text-ink-400">Loading...</span>
            )}
          </div>

          <div className="mt-5 space-y-4">
            {/* Credit or Debit Card */}
            <div className="flex items-start justify-between rounded-base border border-surface-line bg-surface-ground p-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-ink-900 text-[14px]">
                    Credit or Debit Card (Visa & Mastercard)
                  </span>
                  <span className="rounded bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700">
                    Visa & Mastercard Only
                  </span>
                </div>
                <p className="text-[12px] text-ink-500">
                  Accept secure card payments with automated Luhn validation and CVV protection.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-100 text-blue-800">
                    VISA
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-red-100 text-red-800">
                    Mastercard
                  </span>
                </div>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={cardEnabled}
                  onChange={(e) => setCardEnabled(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-surface-line after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-600 peer-checked:after:translate-x-full"></div>
              </label>
            </div>

            {/* Bank Deposit / Wire Transfer */}
            <div className="flex items-start justify-between rounded-base border border-surface-line bg-surface-ground p-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-ink-900 text-[14px]">
                    Bank Deposit / Wire Transfer
                  </span>
                  <span className="rounded bg-success-50 px-2 py-0.5 text-[11px] font-semibold text-success-700">
                    Recommended for Sri Lanka
                  </span>
                </div>
                <p className="text-[12px] text-ink-500">
                  Customers transfer funds to the company bank account and submit deposit receipt.
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={bankTransferEnabled}
                  onChange={(e) => setBankTransferEnabled(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-surface-line after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-600 peer-checked:after:translate-x-full"></div>
              </label>
            </div>

            {/* Cash on Delivery */}
            <div className="flex items-start justify-between rounded-base border border-amber-200 bg-amber-50/50 p-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-ink-900 text-[14px]">
                    Cash on Delivery (COD)
                  </span>
                  <span className="rounded bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                    Temporarily Hidden on Storefront
                  </span>
                </div>
                <p className="text-[12px] text-ink-600">
                  Pay when goods arrive. As per store policy (Figure 01), this option is temporarily disabled on checkout.
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={codEnabled}
                  onChange={(e) => setCodEnabled(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-surface-line after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-600 peer-checked:after:translate-x-full"></div>
              </label>
            </div>
          </div>
        </div>

        {/* 2. Official Bank Account Details */}
        <div className="rounded-card border border-surface-line bg-surface-card p-6 shadow-card">
          <h2 className="text-[18px] font-semibold text-ink-900 border-b border-surface-line pb-3">
            Company Bank Account Details (Bank Deposit / Wire Transfer)
          </h2>
          <p className="mt-1 text-[13px] text-ink-500 mb-5">
            These bank credentials will appear on the customer checkout page and order invoices.
          </p>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="block text-[13px] font-medium text-ink-700 mb-1">
                Bank Name *
              </label>
              <input
                type="text"
                required
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="e.g. COMMERCIAL BANK"
                className="h-11 w-full rounded-base border border-surface-line bg-surface-ground px-3 text-[14px] text-ink-900 focus:border-brand-500 focus:outline-none uppercase font-semibold"
              />
              <span className="text-[12px] text-ink-400 mt-1 block">
                Official commercial banking partner in Sri Lanka.
              </span>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-ink-700 mb-1">
                Branch Name *
              </label>
              <input
                type="text"
                required
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                placeholder="e.g. KEYZER STREET BRANCH"
                className="h-11 w-full rounded-base border border-surface-line bg-surface-ground px-3 text-[14px] text-ink-900 focus:border-brand-500 focus:outline-none uppercase"
              />
              <span className="text-[12px] text-ink-400 mt-1 block">
                Official branch where company account is registered.
              </span>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-ink-700 mb-1">
                Account Holder Name (A/C Holder) *
              </label>
              <input
                type="text"
                required
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                placeholder="e.g. TRANS ASIA CELLULAR PVT LTD"
                className="h-11 w-full rounded-base border border-surface-line bg-surface-ground px-3 text-[14px] text-ink-900 focus:border-brand-500 focus:outline-none uppercase font-semibold"
              />
              <span className="text-[12px] text-ink-400 mt-1 block">
                Must match registered company entity name exactly.
              </span>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-ink-700 mb-1">
                Account Number (A/C Number) *
              </label>
              <input
                type="text"
                required
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="e.g. 1000060278"
                className="h-11 w-full rounded-base border border-surface-line bg-surface-ground px-3 text-[14px] text-ink-900 focus:border-brand-500 focus:outline-none font-mono font-semibold"
              />
              <span className="text-[12px] text-ink-400 mt-1 block">
                10-digit primary corporate settlement account number.
              </span>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[13px] font-medium text-ink-700 mb-1">
                Deposit / Transfer Instructions & WhatsApp Verification
              </label>
              <textarea
                rows={2}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full rounded-base border border-surface-line bg-surface-ground p-3 text-[14px] text-ink-900 focus:border-brand-500 focus:outline-none"
              />
              <span className="text-[12px] text-ink-400 mt-1 block">
                Shown to customer upon choosing Bank Deposit / Wire Transfer.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Right Column: Live Storefront Preview & Actions */}
      <aside className="space-y-6">
        <div className="rounded-card border border-surface-line bg-surface-card p-6 shadow-card">
          <h3 className="text-[15px] font-semibold text-ink-900 mb-3">
            Publish Changes
          </h3>
          <p className="text-[13px] text-ink-500 mb-4">
            Changes will take effect immediately on customer checkout:
            <code className="mt-1 block text-[11px] text-brand-700 bg-brand-50 p-1.5 rounded">
              http://localhost:3000/checkout-payment
            </code>
          </p>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-base bg-brand-600 px-4 text-[14px] font-semibold text-white shadow-sm hover:bg-brand-700 disabled:opacity-50"
          >
            <Icon className="h-4 w-4" name="save" />
            {saving ? "Saving Changes..." : "Save Payment Settings"}
          </button>
        </div>

        {/* Live Customer View Preview */}
        <div className="rounded-card border border-surface-line bg-surface-card p-6 shadow-card">
          <h3 className="text-[15px] font-semibold text-ink-900 mb-2">
            Storefront Checkout Preview
          </h3>
          <p className="text-[12px] text-ink-500 mb-4">
            How your bank details will appear to customers:
          </p>

          <div className="rounded-base border border-surface-line bg-surface-ground p-4 space-y-2 text-[13px]">
            <div className="font-bold text-ink-900">{bankName || "COMMERCIAL BANK"}</div>
            <div className="text-ink-700">
              <span className="text-ink-500 font-medium">A/C Holder:</span>{" "}
              {accountHolder || "TRANS ASIA CELLULAR PVT LTD"}
            </div>
            <div className="text-ink-700 font-mono font-semibold">
              <span className="text-ink-500 font-medium font-sans">A/C Number:</span>{" "}
              {accountNumber || "1000060278"}
            </div>
            <div className="text-ink-700">
              <span className="text-ink-500 font-medium">Branch:</span>{" "}
              {branchName || "KEYZER STREET BRANCH"}
            </div>
            {instructions && (
              <div className="text-[12px] text-ink-500 pt-2 border-t border-surface-line italic">
                {instructions}
              </div>
            )}
          </div>
        </div>
      </aside>
    </form>
  );
}
