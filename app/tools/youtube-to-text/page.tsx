'use client';

import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';

type ApiResult =
  | { error: string }
  | { text: string; title: string; thumbnail: string; author: string; langPicked?: string; trackName?: string };

export default function YoutubeToolPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Extract<ApiResult, { text: string }> | null>(null);
  const [copyStatus, setCopyStatus] = useState(false);

  // Dosya adını işletim sistemlerine uyumlu hale getiren fonksiyon
  const safeName = (s: string) =>
    (s || 'transcript')
      .replace(/[\\/:*?"<>|]+/g, '_')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 80);

  const handleFetch = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setData(null);

    try {
      const res = await fetch('/api/youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl: url.trim() }),
      });

      let result: ApiResult;
      try {
        result = await res.json();
      } catch {
        alert('API yanıtı JSON değil. Sunucu hatası oluşmuş olabilir.');
        return;
      }

      if (!res.ok) {
        const msg = (result as any)?.error || 'Transcript alınamadı.';
        alert(msg);
        return;
      }

      if ('error' in result) {
        alert(result.error);
        return;
      }

      setData(result);
    } catch (err) {
      console.error(err);
      alert('İşlem sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // TXT İndirme Fonksiyonu (Native Yöntem)
  const downloadTXT = () => {
    if (!data?.text) return;
    
    try {
      // Türkçe karakterlerin düzgün çıkması için BOM ekliyoruz
      const BOM = "\uFEFF";
      const blob = new Blob([BOM + data.text], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${safeName(data.title)}.txt`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Dosya indirilemedi.");
    }
  };

  // Word İndirme Fonksiyonu
  const downloadWord = async () => {
    if (!data?.text) return;

    try {
      const doc = new Document({
        sections: [
          {
            children: data.text
              .split('\n')
              .map((line: string) =>
                new Paragraph({
                  children: [new TextRun({ text: line, size: 24 })],
                  spacing: { after: 200 },
                })
              ),
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${safeName(data.title)}.docx`);
    } catch (err) {
      alert("Word dosyası oluşturulamadı.");
    }
  };

  const handleCopy = async () => {
    if (!data?.text) return;
    try {
      await navigator.clipboard.writeText(data.text);
      setCopyStatus(true);
      setTimeout(() => setCopyStatus(false), 2000);
    } catch {
      alert('Kopyalama başarısız.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-black text-slate-900 mb-2">YouTube to Text</h1>
        <p className="text-slate-500 mb-8">Video altyazılarını saniyeler içinde metne dönüştürün.</p>

        {/* Giriş Alanı */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <input
            type="text"
            placeholder="YouTube linkini buraya yapıştırın..."
            className="flex-1 px-6 py-4 rounded-2xl border-2 border-slate-200 focus:border-blue-500 outline-none transition shadow-sm"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            onClick={handleFetch}
            disabled={loading}
            className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition disabled:opacity-50 shadow-lg shadow-blue-200"
          >
            {loading ? 'İşleniyor...' : 'Metni Getir'}
          </button>
        </div>

        {/* Sonuç Alanı */}
        {data && (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-300">
            <div className="relative h-56 bg-slate-200">
              {data.thumbnail ? (
                <img src={data.thumbnail} alt="thumbnail" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-slate-300" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                <div className="text-left text-white">
                  <h2 className="text-xl font-bold line-clamp-2">{data.title}</h2>
                  {data.author && <p className="text-white/80 text-sm mt-1">Kanal: {data.author}</p>}
                </div>
              </div>
            </div>

            <div className="p-8">
              {/* Aksiyon Butonları */}
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={handleCopy}
                  className={`flex flex-col items-center p-4 rounded-2xl border transition ${
                    copyStatus ? 'bg-green-50 border-green-200 text-green-700' : 'bg-orange-50 border-orange-100 text-orange-700 hover:bg-orange-100'
                  }`}
                >
                  <span className="text-2xl mb-1">{copyStatus ? '✅' : '📋'}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">{copyStatus ? 'Kopyalandı!' : 'Kopyala'}</span>
                </button>

                <button
                  onClick={downloadTXT}
                  className="flex flex-col items-center p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-slate-100 transition text-slate-600"
                >
                  <span className="text-2xl mb-1">📄</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">TXT İndir</span>
                </button>

                <button
                  onClick={downloadWord}
                  className="flex flex-col items-center p-4 bg-blue-50 border border-blue-100 rounded-2xl hover:bg-blue-100 transition text-blue-700"
                >
                  <span className="text-2xl mb-1">📘</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">Word İndir</span>
                </button>
              </div>

              {/* Önizleme Paneli */}
              <div className="mt-8 text-left">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-[0.2em]">Metin Önizleme</h4>
                <div className="h-64 overflow-y-auto p-5 bg-slate-50 rounded-2xl text-sm text-slate-600 leading-relaxed border border-slate-100 font-medium">
                  {data.text}
                </div>
              </div>
            </div>
          </div>
        )}

        {!data && !loading && (
          <p className="text-xs text-slate-400 mt-8">
            İpucu: Altyazıların görünebilmesi için videoda CC özelliğinin açık olması gerekir.
          </p>
        )}
      </div>
    </div>
  );
}
