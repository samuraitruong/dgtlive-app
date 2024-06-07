import Tournament from "@/components/tournament";

export default function Home({ params }: { params: { slug: string } }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-gray-100 text-black">
      <Tournament category={params.slug} />
    </main>
  );
}
export async function generateStaticParams() {
  // const posts = await fetch('https://.../posts').then((res) => res.json())
  const tournaments = [{
    slug: 'default'
  }]
  return tournaments.map((t) => ({
    slug: t.slug,
  }))
}