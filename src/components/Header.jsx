import { PanelLeft } from "lucide-react";

export default function Header({ sidebarOpen, toggleSidebar }) {

  return (
    <header className="bg-white px-6 py-4 flex justify-between items-center
                       border-b border-gray-200 shadow-lg sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="h-9 w-9 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center cursor-pointer"
          aria-label={sidebarOpen ? "Tutup sidebar" : "Buka sidebar"}
        >
          <PanelLeft className={`h-5 w-5 text-gray-700 transition-all duration-200 ${sidebarOpen ? 'opacity-60' : ''}`} />
        </button>
        <h1 className="font-semibold text-gray-700 text-md uppercase ">
          {/* {titleMap[location.pathname] || "Dashboard"} */}
          SIMBADA BANDUNG KIDUL
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="font-semibold text-sm">SIMBADA</p>
          <p className="text-xs text-gray-500">Administrator</p>
        </div>
        <img
          src="/logo.png"
          className="w-10 h-10"
        />
      </div>
    </header>
  );
}
