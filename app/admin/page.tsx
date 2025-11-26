import { createClient } from "@/utils/supabase/server"; // Supabase client yolu (projene göre değişebilir)
import { redirect } from "next/navigation";
import Link from 'next/link';

export default async function AdminPage() {
  // 1. Supabase bağlantısını kur
  const supabase = createClient();

  // 2. Kullanıcı oturumunu kontrol et
  const { data: { user }, error } = await supabase.auth.getUser();

  // 3. Eğer kullanıcı giriş yapmamışsa, login sayfasına at
  if (!user || error) {
    redirect("/login");
  }

  // 4. (ÖNEMLİ) Sadece SENİN emailin girebilsin.
  // Buraya kendi email adresini yazmalısın.
  const myEmail = "senin_emailin@ornek.com"; 

  if (user.email !== myEmail) {
    // Admin değilse ana sayfaya geri gönder
    redirect("/");
  }

  // --- BURADAN AŞAĞISI GÜVENLİ ALANDIR ---
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Üst Başlık */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Paneli</h1>
          <p className="text-gray-500">Hoş geldin, {user.email}</p>
        </div>
        <Link 
          href="/" 
          className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 transition"
        >
          Ana Sayfaya Dön
        </Link>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-700">Durum</h3>
          <span className="text-lg text-green-600">Admin Girişi Başarılı</span>
        </div>
        {/* Diğer kartlar buraya gelebilir... */}
      </div>
      
      {/* Buraya önceki mesajdaki butonları ve içerikleri ekleyebilirsin */}
    </div>
  );
}
