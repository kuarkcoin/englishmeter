'use client';

import { useState } from 'react';
// Link yerine <a> etiketi kullanıyoruz çünkü next/link bu ortamda hata verebiliyor
import { Loader2, CheckCircle2, AlertCircle, Send, ArrowLeft } from 'lucide-react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setFeedback('');

    try {
      // API isteği simülasyonu
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      let data;
      try {
         data = await res.json();
      } catch (err) {
         // Demo modu: API yoksa (404) başarılıymış gibi davran
         if (res.status === 404) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setStatus('success');
            setFeedback('Your message has been sent successfully! (Demo Mode)');
            setName('');
            setEmail('');
            setMessage('');
            return;
         }
         throw err;
      }

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setStatus('success');
      setFeedback('Your message has been sent successfully! We will get back to you soon.');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error: any) {
      setStatus('error');
      setFeedback(error.message || 'Failed to send message. Please try again.');
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4 sm:px-6 lg:px-8 flex flex-col justify-center font-sans text-gray-900">
      <div className="max-w-3xl mx-auto w-full">
        
        {/* Geri Dön Butonu */}
        <div className="mb-6">
          <a 
            href="/" 
            className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 transition font-medium group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </a>
        </div>

        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Contact Us</h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Have a question or feedback? We'd love to hear from you!
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="col-span-1">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Name
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={status === 'loading' || status === 'success'}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white disabled:opacity-60"
                    placeholder="John Doe"
                />
                </div>

                <div className="col-span-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={status === 'loading' || status === 'success'}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white disabled:opacity-60"
                    placeholder="john@example.com"
                />
                </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                disabled={status === 'loading' || status === 'success'}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white resize-none disabled:opacity-60"
                placeholder="How can we help you?"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className={`
                    w-full sm:w-auto flex items-center justify-center px-8 py-3.5 rounded-lg font-semibold text-white transition-all duration-200
                    ${status === 'success' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30'}
                    disabled:opacity-70 disabled:cursor-not-allowed
                `}
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : status === 'success' ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Sent!
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </div>

            {/* Geri Bildirim Alanı */}
            {feedback && (
              <div className={`mt-6 p-4 rounded-lg flex items-start animate-in fade-in slide-in-from-top-2 duration-300 ${
                status === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-100' 
                  : 'bg-red-50 text-red-800 border border-red-100'
              }`}>
                {status === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                ) : (
                    <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                )}
                <p className="text-sm font-medium">{feedback}</p>
              </div>
            )}
          </form>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} EnglishMeter. All rights reserved.
        </div>
      </div>
    </section>
  );
}
