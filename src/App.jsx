import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useRef } from "react";

import ProtectedRoute from "./routes/ProtectedRoute";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";

import KibTanah from "./Pages/tanah/KibTanah";
import CreateTanah from "./Pages/tanah/CreateTanah";
import EditTanah from "./Pages/tanah/EditTanah";

import KibGedung from "./Pages/gedung/KibGedung";
import CreateGedung from "./Pages/gedung/CreateGedung";
import EditGedung from "./Pages/gedung/EditGedung";

import KibMesin from "./Pages/mesin/KibMesin";
import CreateMesin from "./Pages/mesin/CreateMesin";

import Kir from "./Pages/kir/Kir";
import CreateKir from "./Pages/kir/CreateKir";
import EditKir from "./Pages/kir/EditKir";
import ScanLabel from "./Pages/ScanLabel";

import CetakLabel from "./pages/CetakLabel";
import Laporan from "./Pages/laporan/Laporan";
import EditMesin from "./Pages/mesin/EditMesin";

export default function App() {
  const sidebarRef = useRef(null);
  const backdropRef = useRef(null);

  const toggleSidebar = () => {
    sidebarRef.current.classList.toggle("-translate-x-full");
    backdropRef.current.classList.toggle("hidden");
  };

  return (
    <BrowserRouter>
      <ToastContainer />

      <Routes>

        {/* ===== PUBLIC ===== */}
        <Route path="/" element={<Login />} />
        <Route path="/label/:id" element={<ScanLabel />} />


        {/* ===== PROTECTED ===== */}
        <Route element={<ProtectedRoute />}>
          <Route path="/*" element={
              <div className="h-screen overflow-hidden">
                <Sidebar
                  sidebarRef={sidebarRef}
                  backdropRef={backdropRef}
                  toggleSidebar={toggleSidebar}
                />

                <div className="flex flex-col h-full">
                  <Header toggleSidebar={toggleSidebar} />

                  <main className="p-6 flex-1 bg-gray-50 overflow-auto">
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/kib/tanah" element={<KibTanah />} />
                      <Route path="/kib/tanah/create" element={<CreateTanah />} />
                      <Route path="/kib/tanah/edit/:id/edit" element={<EditTanah />} />
                      <Route path="/kib/gedung" element={<KibGedung />} />
                      <Route path="/kib/gedung/create" element={<CreateGedung />} />
                      <Route path="/kib/gedung/edit/:id/edit" element={<EditGedung />} />
                      <Route path="/kib/mesin" element={<KibMesin />} />
                      <Route path="/kib/mesin/create" element={<CreateMesin />} />
                      <Route path="/kib/mesin/edit/:id/edit" element={<EditMesin />} />
                      <Route path="/kir" element={<Kir />} />
                      <Route path="/kir/create" element={<CreateKir />} />
                      <Route path="/kir/edit/:id/edit" element={<EditKir />} />
                      <Route path="/cetak-label" element={<CetakLabel />} />
                      <Route path="/laporan" element={<Laporan />} />
                    </Routes>
                  </main>
                </div>
              </div>
            }
          />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
