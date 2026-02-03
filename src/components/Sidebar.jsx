import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout } from "../utils/auth";

export default function Sidebar({ sidebarRef, backdropRef, toggleSidebar }) {
  const toggleDropdown = (menuId, arrowId) => {
    const menu = document.getElementById(menuId);
    const arrow = document.getElementById(arrowId);

    menu.classList.toggle("hidden");
    menu.classList.toggle("flex");
    arrow.classList.toggle("rotate-180");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg font-semibold transition
     ${isActive
       ? "bg-white text-[#12154c]"
       : "text-gray-300 hover:bg-white/10 hover:text-white"}`;

  const navigate = useNavigate();

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

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={toggleSidebar}
        className="fixed inset-0 bg-black/50 z-30 hidden"
      />

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className="
          bg-[#12154c] text-white w-56 h-full
          flex flex-col justify-between
          py-6 px-4 shadow-xl
          fixed inset-y-0 left-0 z-40
          -translate-x-full
          transition-transform duration-300
        "
      >
        <div>
          {/* Logo */}
          <div className="text-center mb-4">
            <img
              src="/logo.png"
              className="w-20 h-20 mx-auto rounded-full"
            />
            <p className="text-xs mt-2 uppercase tracking-wide text-indigo-200">
              Simbada Bandung Kidul
            </p>
          </div>

          <hr className="border-white/10 mb-4" />

          <nav className="space-y-1 text-sm">
            <NavLink to="/dashboard" onClick={toggleSidebar} className={linkClass}>
              🏠 Dashboard
            </NavLink>
            {/* Menu Data KIB */}
            <button
              onClick={() => toggleDropdown("kibMenu", "kibArrow")}
              className="w-full flex justify-between items-center px-3 py-2 rounded-lg
                         font-semibold text-gray-300 hover:bg-white/10"
            >
              <span className="flex gap-3">📦 Inventaris Barang</span>
              <span id="kibArrow" className="transition-transform">⌄</span>
            </button>
            <div
              id="kibMenu"
              className="hidden flex-col ml-9 border-l border-white/20 pl-2"
            >
              <NavLink to="/kib/tanah" onClick={toggleSidebar} className="py-2 text-gray-400 hover:text-white">
                Data Tanah
              </NavLink>
              <NavLink to="/kib/gedung" onClick={toggleSidebar} className="py-2 text-gray-400 hover:text-white">
                Data Gedung
              </NavLink>
              <NavLink to="/kib/mesin" onClick={toggleSidebar} className="py-2 text-gray-400 hover:text-white">
                Data Mesin
              </NavLink>
            </div>
            {/* Menu Data KIR */}
             <NavLink to="/kir" onClick={toggleSidebar} className={linkClass}>
              🗳️ Data Ruangan
            </NavLink>
            {/* Menu Data label */}
             <NavLink to="/cetak-label" onClick={toggleSidebar} className={linkClass}>
              🖨️ Cetak Label
            </NavLink>
            {/* Menu Data laporan */}
             <NavLink to="/laporan" onClick={toggleSidebar} className={linkClass}>
              📓 Laporan
            </NavLink>
            {/* Menu Data laporan */}
             <NavLink to="/berita" onClick={toggleSidebar} className={linkClass}>
              🔖 Berita Acara
            </NavLink>
            {/* Menu Data laporan */}
             <NavLink to="/integritas" onClick={toggleSidebar} className={linkClass}>
              🧾 Pakta Integritas
            </NavLink>
          </nav>
        </div>

        <div className="border-t border-white/10 pt-4">
          <button onClick={handleLogout} className="w-full bg-red-500 hover:bg-red-600 py-2 rounded-lg text-sm">
            🚪 Keluar Sistem
          </button>
        </div>
      </aside>
    </>
  );
}
