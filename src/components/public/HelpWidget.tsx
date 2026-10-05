"use client";

import { useState } from "react";
import { Mail, MessageCircle, Minus, Phone, Globe, HeadphonesIcon } from "lucide-react";

const PHONE = "+977 9705890073";
const WHATSAPP_NUMBER = "9779705890073";
const BID_SUPPORT_PHONE = "+977 9862123845";
const EMAIL = "civoraxt@gmail.com";
const WEBSITE = "www.tenderxnepal.com";
const HOURS = "24/7 Support";

export function HelpWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
      {open && (
        <div className="w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between bg-blue-600 px-4 py-3">
            <div className="flex items-center gap-2 text-white">
              <HeadphonesIcon size={16} />
              <span className="text-sm font-semibold">Need help?</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="flex h-5 w-5 items-center justify-center rounded-full text-blue-200 hover:text-white"
            >
              <Minus size={14} />
            </button>
          </div>

          {/* Hours */}
          <div className="border-b border-slate-100 px-4 py-2">
            <p className="text-[11px] text-slate-400">{HOURS}</p>
          </div>

          {/* Contact links */}
          <div className="flex flex-col divide-y divide-slate-50">
            <a
              href={`tel:${PHONE.replace(/\s/g, "")}`}
              className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                <Phone size={14} />
              </span>
              <span>
                <span className="block">{PHONE}</span>
              </span>
            </a>

            <a
              href={`tel:${BID_SUPPORT_PHONE.replace(/\s/g, "")}`}
              className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                <Phone size={14} />
              </span>
              <span>
                <span className="block">{BID_SUPPORT_PHONE}</span>
                <span className="block text-[11px] text-slate-400">Bid Document Support</span>
              </span>
            </a>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                <MessageCircle size={14} />
              </span>
              WhatsApp
            </a>

            <a
              href={`mailto:${EMAIL}`}
              className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-500">
                <Mail size={14} />
              </span>
              {EMAIL}
            </a>

            <a
              href={`https://${WEBSITE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <Globe size={14} />
              </span>
              {WEBSITE}
            </a>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700 active:scale-95"
      >
        <HeadphonesIcon size={16} />
        {!open && "Need help?"}
      </button>
    </div>
  );
}
