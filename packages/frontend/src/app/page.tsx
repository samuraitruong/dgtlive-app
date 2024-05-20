import Tournament from "@/components/tournament";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-1 bg-gray-100 text-black">
      <Tournament />
    </main>
  );
}
