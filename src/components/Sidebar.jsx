import { NavLink, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { logout } from "../utils/auth";
import { LayoutDashboard, Package, ChevronDown, Warehouse, Printer, BookOpen, Bookmark, FileText, LogOut, ChevronLeft } from "lucide-react";

const menuGroups = [
  {
    label: "Utama",
    items: [
      { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    ],
  },
  {
    label: "Inventaris",
    items: [
      { to: "/kir", icon: Warehouse, label: "Data Ruangan" },
      { to: "/cetak-label", icon: Printer, label: "Cetak Label" },
    ],
  },
  {
    label: "Dokumen",
    items: [
      { to: "/laporan", icon: BookOpen, label: "Laporan" },
      { to: "/berita", icon: Bookmark, label: "Berita Acara" },
      { to: "/integritas", icon: FileText, label: "Pakta Integritas" },
    ],
  },
];

export default function Sidebar({ sidebarRef, backdropRef, toggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [kibOpen, setKibOpen] = useState(false);

  const isKibActive = location.pathname.startsWith("/kib/");
  useEffect(() => {
    if (isKibActive) setKibOpen(true);
  }, [isKibActive]);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("token");
      toast.success("Berhasil logout");
      navigate("/");
    } catch (err) {
      console.log(err)
      toast.error("Gagal logout");
    }
  };

  const baseLink = ({ isActive }) =>
    `relative flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 overflow-hidden
     ${isActive
       ? "text-[#12154c]"
       : "text-gray-300 hover:text-white"}`;

  const subLink = ({ isActive }) =>
    `block py-2 text-sm transition-all duration-200 relative pl-3 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-1.5 before:w-1.5 before:rounded-full
     ${isActive
       ? "text-white font-bold before:bg-white"
       : "text-gray-400 hover:text-white hover:pl-4 before:bg-gray-500"}`;

  return (
    <>
      <div
        ref={backdropRef}
        onClick={toggleSidebar}
        className="fixed inset-0 bg-black/50 z-30 hidden animate-in fade-in duration-300"
      />

      <aside
        ref={sidebarRef}
        className="
          bg-[#12154c] text-white w-60 h-full
          flex flex-col
          py-5 px-3 shadow-2xl shadow-black/20
          fixed inset-y-0 left-0 z-40
          -translate-x-full
          transition-transform duration-300 ease-out
        "
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-white/10 rounded-full blur-sm" />
              <img src="/logo.png" className="w-10 h-10 rounded-full relative" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold text-white tracking-tight">Simbada</p>
              <p className="text-[10px] text-indigo-300 font-medium">Bandung Kidul</p>
            </div>
          </div>
          <button onClick={toggleSidebar} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer">
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden space-y-5">
          {/* KIB DROPDOWN */}
          <div>
            <p className="text-[10px] font-bold text-indigo-300/60 uppercase tracking-[0.15em] px-3 mb-1.5">KIB</p>
            <button
              onClick={() => setKibOpen(!kibOpen)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${isKibActive ? "bg-white/10 text-white" : "text-gray-300 hover:bg-white/5 hover:text-white"}`}
            >
              <span className="flex items-center gap-3">
                <Package className={`h-4 w-4 transition-colors ${isKibActive ? "text-indigo-300" : "text-indigo-300/70 group-hover:text-indigo-300"}`} />
                Inventaris Barang
              </span>
              <span className={`transition-transform duration-300 ${kibOpen ? "rotate-180" : ""}`}>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
              </span>
            </button>

            <div className={`grid transition-all duration-300 ease-in-out ${kibOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
              <div className="overflow-hidden">
                <div className="ml-4 pl-3 border-l-2 border-white/10 mt-1 space-y-0.5 py-1">
                  <NavLink to="/kib/tanah" onClick={toggleSidebar} className={subLink}>Data Tanah</NavLink>
                  <NavLink to="/kib/gedung" onClick={toggleSidebar} className={subLink}>Data Gedung</NavLink>
                  <NavLink to="/kib/mesin" onClick={toggleSidebar} className={subLink}>Data Mesin</NavLink>
                </div>
              </div>
            </div>
          </div>

          {/* MENU GROUPS */}
          {menuGroups.map((group) => (
            <div key={group.label}>
              <p className="text-[10px] font-bold text-indigo-300/60 uppercase tracking-[0.15em] px-3 mb-1.5">{group.label}</p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavLink key={item.to} to={item.to} onClick={toggleSidebar} className={baseLink} end>
                    {({ isActive }) => (
                      <>
                        {isActive && <span className="absolute inset-0 bg-white rounded-xl shadow-sm" />}
                        <span className={`relative z-10 transition-transform duration-200 ${isActive ? "scale-110" : ""}`}>
                          <item.icon className={`h-4 w-4 ${isActive ? "text-[#12154c]" : "text-indigo-300"}`} />
                        </span>
                        <span className="relative z-10">{item.label}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* LOGOUT */}
        <div className="pt-4 mt-2 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-300 hover:text-white hover:bg-rose-500/20 transition-all duration-200 group cursor-pointer">
            <LogOut className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            Keluar Sistem
          </button>
        </div>
      </aside>
    </>
  );
}
