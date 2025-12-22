'use client';

import React, { useState } from 'react';
import { Document, Packer, Paragraph, TextRun } from 'docx';

type ApiResult =
  | { error: string }
  | { text: string; title: string; thumbnail: string; author: string };

export default function YoutubeToolPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Extract<ApiResult, { text: string }> | null>(null);
  const [copyStatus, setCopyStatus] = useState(false);

  // Dosya adını temizleyen fonksiyon
  const safeName = (s: string) =>
    (s || 'transcript')
      .replace(/[\\/:*?"<>|]+/g, '_')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 80) || 'video_transcript';

  // Ortak İndirme Fonksiyonu (Kütüphanesiz, En Güvenli Yol)
  const triggerDownload = (blob: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

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

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || 'Bir hata oluştu.');
        return;
      }

      setData(result);
    } catch (err) {
      alert('Bağlantı hatası oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const downloadTXT = () => {
    if (!data?.text) return;
    const BOM = "\uFEFF"; // Türkçe karakter desteği için
    const blob = new Blob([BOM + data.text], { type: 'text/plain;charset=utf-8' });
    triggerDownload(blob, `${safeName(data.title)}.txt`);
  };

  const downloadWord = async () => {
    if (!data?.text) return;
    try {
      const doc = new Document({
        sections: [{
          children: data.text.split('\n').map(line => 
            new Paragraph({
              children: [new TextRun({ text: line, size: 24 })],
              spacing: { after: 200 }
            })
          ),
        }],
      });

      const blob = await Packer.toBlob(doc);
      triggerDownload(blob, `${safeName(data.title)}.docx`);
    } catch (err) {
      alert("Word dosyası hazırlanırken hata oluştu.");
    }
  };

  const handleCopy = async () => {
    if (!data?.text) return;
    await navigator.clipboard.writeText(data.text);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">YouTube to Text</h1>
        <p className="text-slate-500 mb-8">Video altyazılarını metne dönüştürün ve indirin.</p>

        {/* Arama Barı */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <input
            type="text"
            placeholder="YouTube linkini buraya yapıştırın..."
            className="flex-1 px-6 py-4 rounded-2xl border-2 border-slate-200 focus:border-blue-500 outline-none transition shadow-sm bg-white"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            onClick={handleFetch}
            disabled={loading}
            className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition disabled:opacity-50 shadow-lg"
          >
            {loading ? 'Yükleniyor...' : 'Metni Getir'}
          </button>
        </div>

        {/* Sonuç Paneli */}
        {data && (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative h-56">
              <img src={data.thumbnail} alt="thumb" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-6 flex flex-col justify-end text-left">
                <h2 className="text-white text-xl font-bold line-clamp-2">{data.title}</h2>
                <p className="text-white/70 text-sm">{data.author}</p>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-3 gap-4 mb-8">
                <button onClick={handleCopy} className={`flex flex-col items-center p-4 rounded-2xl border transition ${copyStatus ? 'bg-green-50 border-green-200 text-green-700' : 'bg-orange-50 border-orange-100 text-orange-700 hover:bg-orange-100'}`}>
                  <span className="text-2xl mb-1">{copyStatus ? '✅' : '📋'}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">{copyStatus ? 'Kopyalandı' : 'Kopyala'}</span>
                </button>
                <button onClick={downloadTXT} className="flex flex-col items-center p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-slate-100 transition text-slate-600">
                  <span className="text-2xl mb-1">📄</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">TXT</span>
                </button>
                <button onClick={downloadWord} className="flex flex-col items-center p-4 bg-blue-50 border border-blue-100 rounded-2xl hover:bg-blue-100 transition text-blue-700">
                  <span className="text-2xl mb-1">📘</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Word</span>
                </button>
              </div>

              <div className="text-left">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Metin Önizleme</h4>
                <div className="h-64 overflow-y-auto p-6 bg-slate-50 rounded-2xl text-sm text-slate-600 leading-relaxed border border-slate-100 scrollbar-thin">
                  {data.text}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
