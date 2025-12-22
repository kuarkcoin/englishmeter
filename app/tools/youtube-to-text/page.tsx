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

      // JSON parse hatasına karşı koruma
      let result: ApiResult;
      try {
        result = await res.json();
      } catch {
        alert('API yanıtı JSON değil. /api/youtube hata veriyor olabilir.');
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
      alert('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const downloadTXT = () => {
    if (!data?.text) return;
    const blob = new Blob([data.text], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${safeName(data.title)}.txt`);
  };

  const downloadWord = async () => {
    if (!data?.text) return;

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
  };

  const handleCopy = async () => {
    if (!data?.text) return;
    try {
      await navigator.clipboard.writeText(data.text);
      setCopyStatus(true);
      setTimeout(() => setCopyStatus(false), 2000);
    } catch {
      alert('Kopyalama başarısız (tarayıcı izin vermedi).');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-black text-slate-900 mb-4">YouTube to Text</h1>
        <p className="text-slate-600 mb-8">Paste a YouTube link to get the full transcript in seconds.</p>

        {/* Input Area */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <input
            type="text"
            placeholder="https://www.youtube.com/watch?v=..."
            className="flex-1 px-6 py-4 rounded-2xl border-2 border-slate-200 focus:border-blue-500 outline-none transition"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            onClick={handleFetch}
            disabled={loading}
            className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Get Transcript'}
          </button>
        </div>

        {/* Result Area */}
        {data && (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 animate-in fade-in duration-500">
            <div className="relative h-48 bg-slate-200">
              {data.thumbnail ? (
                <img src={data.thumbnail} alt="thumb" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <div className="text-left">
                  <h2 className="text-white text-xl font-bold line-clamp-2">{data.title}</h2>
                  {data.author && <p className="text-white/80 text-xs mt-1">{data.author}</p>}
                  {(data.langPicked || data.trackName) && (
                    <p className="text-white/70 text-[11px] mt-1">
                      {data.langPicked ? `Lang: ${data.langPicked}` : ''} {data.trackName ? `• Track: ${data.trackName}` : ''}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={handleCopy}
                  className={`flex flex-col items-center p-4 rounded-2xl border transition ${
                    copyStatus ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-100 hover:bg-orange-100'
                  }`}
                >
                  <span className="text-2xl mb-1">{copyStatus ? '✅' : '📋'}</span>
                  <span className="text-[10px] font-bold uppercase text-orange-700">{copyStatus ? 'Copied!' : 'Copy'}</span>
                </button>

                <button
                  onClick={downloadTXT}
                  className="flex flex-col items-center p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-slate-100 transition"
                >
                  <span className="text-2xl mb-1">📄</span>
                  <span className="text-[10px] font-bold uppercase text-slate-600">TXT</span>
                </button>

                <button
                  onClick={downloadWord}
                  className="flex flex-col items-center p-4 bg-blue-50 border border-blue-100 rounded-2xl hover:bg-blue-100 transition"
                >
                  <span className="text-2xl mb-1">📘</span>
                  <span className="text-[10px] font-bold uppercase text-blue-700">Word</span>
                </button>
              </div>

              <div className="mt-8 text-left">
                <h4 className="text-sm font-bold text-slate-400 uppercase mb-2 tracking-widest">Transcript Preview</h4>
                <div className="h-40 overflow-y-auto p-4 bg-slate-50 rounded-xl text-sm text-slate-600 leading-relaxed border border-slate-100">
                  {data.text}
                </div>
              </div>
            </div>
          </div>
        )}

        {!data && !loading && (
          <p className="text-xs text-slate-400 mt-6">
            Not: Bazı videolarda CC kapalı olabilir ya da YouTube transcript erişimini kısıtlayabilir.
          </p>
        )}
      </div>
    </div>
  );
}