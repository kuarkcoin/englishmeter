import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "English Practice Test",
  description: "Take an English practice test and review your answers.",
  robots: { index: false, follow: true },
};

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Dikkati dağıtmayan, temiz beyaz/gri arka plan
  return (
    <div className="em-page selection:bg-blue-100">
      {children}
    </div>
  );
}
