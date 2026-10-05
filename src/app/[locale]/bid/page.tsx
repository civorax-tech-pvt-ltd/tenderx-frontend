"use client";

import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { Sidebar } from "@/components/workspace/Sidebar";
import { TopBar } from "@/components/workspace/TopBar";
import { BuilderView } from "@/components/workspace/views/BuilderView";
import { DashboardView } from "@/components/workspace/views/DashboardView";
import { BidsView, DocumentsView, ProfilesView } from "@/components/workspace/views/LibraryViews";
import { AccountView } from "@/components/workspace/views/AccountView";
import { useBid } from "@/lib/bid-context";
import { isStep, useWorkspace, WorkspaceProvider } from "@/lib/workspace-context";

const COLLAPSED_KEY = "tenderx_sidebar_collapsed";

export default function BidPage() {
  return (
    <AuthGuard>
      <WorkspaceProvider>
        <Workspace />
      </WorkspaceProvider>
    </AuthGuard>
  );
}

function Workspace() {
  const { view } = useWorkspace();
  const { isDirty } = useBid();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(window.localStorage.getItem(COLLAPSED_KEY) === "1");
    } catch {
      // storage unavailable — keep default
    }
  }, []);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      try {
        window.localStorage.setItem(COLLAPSED_KEY, prev ? "0" : "1");
      } catch {
        // ignore
      }
      return !prev;
    });
  }

  // Warn before closing the tab with unsaved bid changes.
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        collapsed={collapsed}
        onToggleCollapsed={toggleCollapsed}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onMenuClick={() => setIsSidebarOpen(true)} />

        <main id="workspace-main" className="flex-1 overflow-y-auto">
          <div key={view} className="mx-auto w-full max-w-[1400px] animate-fade-slide px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {view === "dashboard" && <DashboardView />}
            {isStep(view) && <BuilderView step={view} />}
            {view === "bids" && <BidsView />}
            {view === "profiles" && <ProfilesView />}
            {view === "documents" && <DocumentsView />}
            {view === "account" && <AccountView />}
          </div>
        </main>
      </div>
    </div>
  );
}
