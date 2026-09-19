"use client";

import { useState } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { ProjectTab } from "@/components/tabs/ProjectTab";
import { PartnerTab } from "@/components/tabs/PartnerTab";
import { Sidebar, type TabKey } from "@/components/workspace/Sidebar";
import { TopBar } from "@/components/workspace/TopBar";
import { SummaryPanel } from "@/components/workspace/SummaryPanel";

export default function BidPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("project");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function handleTabChange(tab: TabKey) {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  }

  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-ink-50 dark:bg-ink-950">
        <Sidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar activeTab={activeTab} onMenuClick={() => setIsSidebarOpen(true)} />

          <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
            <main className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="mx-auto max-w-3xl">
                {activeTab === "project" && <ProjectTab />}
                {activeTab === "lead" && <PartnerTab role="lead" />}
                {activeTab === "first" && <PartnerTab role="first" />}
                {activeTab === "second" && <PartnerTab role="second" />}
              </div>
            </main>

            <div className="overflow-y-auto lg:h-full">
              <SummaryPanel />
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
