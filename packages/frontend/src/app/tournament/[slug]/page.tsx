import Tournament from "@/components/tournament";

export default function Home({ params }: { params: { slug: string } }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-gray-100 text-black">
      <Tournament category={"/" + params.slug} useOffline={false} />
    </main>
  );
}
export async function generateStaticParams() {
  const apiUrl =
    process.env.NEXTJS_BUILD_API_URL || "http://localhost:3001/api/public";
  try {
    const posts = await fetch(apiUrl + "?isActive=true").then((res) =>
      res.json()
    );
    const tournaments = [
      ...posts,
      {
        slug: "default",
      },
    ];
    return tournaments.map((t) => ({
      slug: t.slug,
    }));
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}
export const dynamicParams = true;
