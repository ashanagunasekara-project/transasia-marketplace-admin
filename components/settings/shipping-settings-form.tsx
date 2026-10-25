"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/layout/icon";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function ShippingSettingsForm() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [colomboCourierFee, setColomboCourierFee] = useState<number>(350);
  const [outOfColomboCourierFee, setOutOfColomboCourierFee] = useState<number>(450);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number>(15000);
  const [enableFreeShipping, setEnableFreeShipping] = useState<boolean>(true);
  const [processingTime, setProcessingTime] = useState<string>("1-2 business days");

  useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/settings/shipping`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            if (json.data.colomboCourierFee !== undefined) {
              setColomboCourierFee(Number(json.data.colomboCourierFee));
            }
            if (json.data.outOfColomboCourierFee !== undefined) {
              setOutOfColomboCourierFee(Number(json.data.outOfColomboCourierFee));
            }
            if (json.data.freeShippingThreshold !== undefined) {
              setFreeShippingThreshold(Number(json.data.freeShippingThreshold));
            }
            if (json.data.enableFreeShipping !== undefined) {
              setEnableFreeShipping(Boolean(json.data.enableFreeShipping));
            }
            if (json.data.processingTime) {
              setProcessingTime(json.data.processingTime);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch shipping settings:", err);
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
      const res = await fetch(`${API_URL}/api/settings/shipping`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          colomboCourierFee,
          outOfColomboCourierFee,
          freeShippingThreshold,
          enableFreeShipping,
          processingTime,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setStatusMessage({
          type: "success",
          text: "Sri Lanka shipping rates and rules saved successfully! Changes are live across storefront checkout.",
        });
      } else {
        throw new Error(json.message || "Failed to update shipping settings");
      }
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.message || "Network error while saving shipping settings.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
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

        {/* Courier Pricing Configuration */}
        <div className="rounded-card border border-surface-line bg-surface-card p-6 shadow-card">
          <h2 className="text-[18px] font-semibold text-ink-900 border-b border-surface-line pb-3">
            Sri Lanka Courier Delivery Rates (LKR - Rs.)
          </h2>
          <p className="mt-1 text-[13px] text-ink-500 mb-5">
            Set regional courier pricing for Colombo metropolitan area and Out of Colombo island-wide deliveries.
          </p>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="block text-[13px] font-medium text-ink-700 mb-1">
                Colombo Courier Rate (Rs.) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 text-[13px]">
                  Rs.
                </span>
                <input
                  type="number"
                  min={0}
                  step={10}
                  required
                  value={colomboCourierFee}
                  onChange={(e) => setColomboCourierFee(Number(e.target.value))}
                  className="h-11 w-full rounded-base border border-surface-line bg-surface-ground pl-10 pr-3 text-[14px] text-ink-900 focus:border-brand-500 focus:outline-none"
                />
              </div>
              <span className="text-[12px] text-ink-400 mt-1 block">
                Standard delivery rate for Colombo 01-15 & suburbs.
              </span>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-ink-700 mb-1">
                Out of Colombo Courier Rate (Rs.) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 text-[13px]">
                  Rs.
                </span>
                <input
                  type="number"
                  min={0}
                  step={10}
                  required
                  value={outOfColomboCourierFee}
                  onChange={(e) => setOutOfColomboCourierFee(Number(e.target.value))}
                  className="h-11 w-full rounded-base border border-surface-line bg-surface-ground pl-10 pr-3 text-[14px] text-ink-900 focus:border-brand-500 focus:outline-none"
                />
              </div>
              <span className="text-[12px] text-ink-400 mt-1 block">
                Island-wide delivery rate for all other 24 districts.
              </span>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-ink-700 mb-1">
                Fulfillment Processing Time
              </label>
              <select
                value={processingTime}
                onChange={(e) => setProcessingTime(e.target.value)}
                className="h-11 w-full rounded-base border border-surface-line bg-surface-ground px-3 text-[14px] text-ink-900 focus:border-brand-500 focus:outline-none"
              >
                <option value="Same Day (Cutoff 2 PM)">Same Day (Cutoff 2 PM)</option>
                <option value="1-2 business days">1-2 business days (Standard)</option>
                <option value="2-3 business days">2-3 business days (Island-wide)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Free Shipping Rules */}
        <div className="rounded-card border border-surface-line bg-surface-card p-6 shadow-card">
          <h2 className="text-[18px] font-semibold text-ink-900 border-b border-surface-line pb-3">
            Free Shipping Rules
          </h2>
          <p className="mt-1 text-[13px] text-ink-500 mb-5">
            Encourage higher average order value by configuring free delivery thresholds.
          </p>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={enableFreeShipping}
                onChange={(e) => setEnableFreeShipping(e.target.checked)}
                className="h-4 w-4 rounded border-surface-line text-brand-600 focus:ring-brand-500"
              />
              <div>
                <span className="text-[14px] font-medium text-ink-900 block">
                  Enable Free Delivery Threshold
                </span>
                <span className="text-[12px] text-ink-500">
                  Customers qualify for free courier delivery when cart subtotal meets or exceeds threshold.
                </span>
              </div>
            </label>

            {enableFreeShipping && (
              <div>
                <label className="block text-[13px] font-medium text-ink-700 mb-1">
                  Minimum Cart Amount for Free Delivery (Rs.)
                </label>
                <div className="relative max-w-sm">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 text-[13px]">
                    Rs.
                  </span>
                  <input
                    type="number"
                    min={0}
                    step={500}
                    value={freeShippingThreshold}
                    onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                    className="h-11 w-full rounded-base border border-surface-line bg-surface-ground pl-10 pr-3 text-[14px] text-ink-900 focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-11 items-center gap-2 rounded-base bg-brand-600 px-6 text-[14px] font-semibold text-white hover:bg-brand-700 shadow-sm transition disabled:opacity-50"
          >
            <Icon className="h-4 w-4" name="save" />
            {saving ? "Saving Changes..." : "Save Shipping Settings"}
          </button>
        </div>
      </section>

      {/* Summary Card */}
      <aside className="rounded-card border border-surface-line bg-surface-card p-5 shadow-card h-fit">
        <span className="grid h-11 w-11 place-items-center rounded-base bg-brand-50 text-brand-600">
          <Icon className="h-5 w-5" name="truck" />
        </span>
        <h2 className="mt-4 text-[17px] font-semibold text-ink-900">
          Sri Lanka Logistics Overview
        </h2>
        <p className="mt-1 text-[13px] text-ink-500">
          Active courier rate matrix for all 25 districts of Sri Lanka.
        </p>

        <div className="mt-5 space-y-3 text-[14px] border-t border-surface-line pt-4">
          <div className="flex items-center justify-between">
            <span className="text-ink-500">Colombo District</span>
            <span className="font-semibold text-ink-900">Rs. {colomboCourierFee}.00</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-ink-500">Out of Colombo (24 Districts)</span>
            <span className="font-semibold text-ink-900">Rs. {outOfColomboCourierFee}.00</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-ink-500">Free Delivery Over</span>
            <span className="font-semibold text-success-600">
              {enableFreeShipping ? `Rs. ${freeShippingThreshold}.00` : "Disabled"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-ink-500">Pickup Branches</span>
            <span className="font-semibold text-ink-900">Colombo & Kurunegala (Free)</span>
          </div>
        </div>
      </aside>
    </form>
  );
}
