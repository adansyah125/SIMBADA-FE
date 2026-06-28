import { useState,useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { login } from "../services/authService"
import { setAuth } from "../utils/auth"
import { toast } from "react-toastify";
import { Mail, Lock, ArrowRight } from "lucide-react";
function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login(form);
      setAuth(res.token, res.user);
      navigate("/dashboard");
      // toast.success("Login berhasil");
    } catch (err) {
      setError(
        err.response?.data?.errors?.email?.[0] ||
        err.response?.data?.message ||
        "Login gagal"
      );
      console.log(err);
      navigate("/");
      toast.error("Login gagal");
    } finally {
      setLoading(false);
    }
  };

  // proteksi jika sudah login 
  useEffect(() => {
  if (localStorage.getItem("token")) {
    navigate("/dashboard");
  }
}, []);
 
  return (
    <div className="min-h-screen bg-[#1a1a4f]  flex items-center justify-center p-4 sm:p-8">
      {/* Container Utama (Card Tunggal) */}
      <div className="bg-white p-8 sm:p-10 shadow-2xl rounded-xl w-full max-w-lg  transition-all duration-300 transform hover:scale-[1.01]">
        {/* Header/Branding Area */}
            <div className="flex items-center space-x-3 justify-center">
                <img src="logo.png" alt="Logo Bandung Kidul" className="w-50 h-50 rounded-full object-cover"  />
            </div>
            <p className="text-1xl text-center font-bold mt-2 mb-3">SISTEM INFORMASI MANAJEMEN BARANG DAERAH</p>
        {/* Form Area */}
        <p className="text-sm text-center text-gray-500 mb-3">Masukkan detail akun Anda untuk mengakses sistem.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
           {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 p-3 rounded-lg">{error}</div>
        )}
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-gray-600 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" id="email" name="email" onChange={handleChange} placeholder="admin@contoh.com" required className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
          {/* Password */}
           <div>
            <label htmlFor="password" className="block text-xs font-medium text-gray-600 mb-1">PASSWORD SISTEM</label>
            <div className="relative">
              {/* Ikon Kunci */}
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="password"  id="password" name="password" placeholder="********" required onChange={handleChange} className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 flex items-center justify-center space-x-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition duration-200 shadow-md hover:shadow-lg" >
            <ArrowRight className="w-5 h-5" />
            <span>{loading ? "Memproses..." : "Masuk"}</span>
          </button>
        </form>
        
        {/* Footer Info */}
        <p className="text-center text-xs opacity-50 text-gray-500 mt-8"> © 2025 Kecamatan Bandung Kidul </p>
      </div>
      {/* End of Card Container */}

    </div>
  )
}

export default Login
