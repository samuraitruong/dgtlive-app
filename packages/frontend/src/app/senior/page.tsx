import Tournament from "@/components/tournament";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-gray-100 text-black">
      <Tournament category="/senior" />
    </main>
  );
}
