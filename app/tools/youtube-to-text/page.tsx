'use client';

import React, { useState } from 'react';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver'; // Kütüphaneyi içeri aktardık

type ApiResult =
  | { error: string }
  | { text: string; title: string; thumbnail: string; author: string };

export default function YoutubeToolPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Extract<ApiResult, { text: string }> | null>(null);
  const [copyStatus, setCopyStatus] = useState(false);

  // Dosya adını temizleme
  const getFileName = (title: string, ext: string) => {
    const clean = (title || 'transcript')
      .replace(/[\\/:*?"<>|]+/g, '_')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 100);
    return `${clean}.${ext}`;
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
      if (!res.ok) throw new Error(result.error || 'Veri çekilemedi.');
      setData(result);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // TXT İndirme - saveAs Kullanarak
  const downloadTXT = () => {
    if (!data?.text) return;
    try {
      const BOM = "\uFEFF"; // Türkçe karakter desteği
      const blob = new Blob([BOM + data.text], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, getFileName(data.title, 'txt')); // forceDownload yerine saveAs
    } catch (err) {
      console.error(err);
      alert("TXT oluşturulamadı.");
    }
  };

  // Word İndirme - saveAs Kullanarak
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
      saveAs(blob, getFileName(data.title, 'docx')); // forceDownload yerine saveAs
    } catch (err) {
      console.error(err);
      alert("Word dosyası oluşturulurken hata oluştu.");
    }
  };

  const handleCopy = async () => {
    if (!data?.text) return;
    try {
      await navigator.clipboard.writeText(data.text);
      setCopyStatus(true);
      setTimeout(() => setCopyStatus(false), 2000);
    } catch (err) {
      alert("Kopyalanamadı.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-black text-slate-900 mb-6">YouTube to Text</h1>

        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <input
            type="text"
            placeholder="YouTube link..."
            className="flex-1 px-6 py-4 rounded-2xl border-2 border-slate-200 outline-none focus:border-blue-500 transition"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            onClick={handleFetch}
            disabled={loading}
            className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Metni Çek'}
          </button>
        </div>

        {data && (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
            <div className="relative h-48 bg-slate-200">
              <img src={data.thumbnail} alt="thumb" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-end p-6">
                <h2 className="text-white font-bold text-left line-clamp-2">{data.title}</h2>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-3 gap-4 mb-8">
                <button onClick={handleCopy} className={`flex flex-col items-center p-4 rounded-2xl border transition ${copyStatus ? 'bg-green-100 border-green-300' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-2xl">{copyStatus ? '✅' : '📋'}</span>
                  <span className="text-[10px] font-bold mt-1 uppercase">{copyStatus ? 'Tamam!' : 'Kopyala'}</span>
                </button>
                <button onClick={downloadTXT} className="flex flex-col items-center p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-slate-100 transition">
                  <span className="text-2xl">📄</span>
                  <span className="text-[10px] font-bold mt-1 uppercase">TXT İndir</span>
                </button>
                <button onClick={downloadWord} className="flex flex-col items-center p-4 bg-blue-50 border border-blue-100 rounded-2xl hover:bg-blue-100 transition">
                  <span className="text-2xl">📘</span>
                  <span className="text-[10px] font-bold mt-1 uppercase">Word İndir</span>
                </button>
              </div>

              <div className="text-left">
                <div className="h-64 overflow-y-auto p-4 bg-slate-50 rounded-xl text-sm leading-relaxed text-slate-600 border border-slate-100">
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
