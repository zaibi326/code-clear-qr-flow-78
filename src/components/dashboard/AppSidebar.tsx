
import React from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { SidebarHeader } from './SidebarHeader';
import { SidebarMenuItems } from './SidebarMenuItems';
import { SidebarFooter } from './SidebarFooter';

const AppSidebar = React.memo(() => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <aside
      className={`group/sidebar flex flex-col h-screen fixed z-50 bg-white border-r shadow-sm transition-all duration-300 ${
        collapsed ? "w-[70px]" : "w-[240px]"
      }`}
    >
      <SidebarHeader collapsed={collapsed} />

      <div className="flex-1 overflow-y-auto py-4 px-3">
        <SidebarMenuItems collapsed={collapsed} />
      </div>

      <SidebarFooter collapsed={collapsed} />
    </aside>
  );
});

AppSidebar.displayName = 'AppSidebar';

export default AppSidebar;
