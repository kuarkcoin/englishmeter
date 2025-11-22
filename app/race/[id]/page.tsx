export const dynamic = "force-dynamic";

type Props = { params: { id: string } };

export default function RacePage({ params }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center text-3xl font-bold">
      RACE #{params.id}
    </div>
  );
}
