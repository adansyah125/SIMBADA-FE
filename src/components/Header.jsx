// import { useLocation } from "react-router-dom";

export default function Header({ toggleSidebar }) {
  // const location = useLocation();

  // const titleMap = {
  //   "/": "Dashboard",
  //   "/kib/tanah": "Data Tanah",
  //   "/kib/gedung": "Data Gedung",
  //   "/kib/mesin": "Data Mesin",
  // };

  return (
    <header className="bg-white px-6 py-4 flex justify-between items-center
                       border-b border-gray-200 shadow-lg sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className=" p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
        >
          ☰
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
