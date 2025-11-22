// app/race/[id]/page.tsx

type RacePageProps = {
  params: { id: string };
};

export default function RacePage({ params }: RacePageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center text-3xl font-bold">
      RACE #{params.id}
    </div>
  );
}
