import TVBody from "@/components/TVBody";

export default function Index() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center py-8 px-4">
      <h1 className="font-screen text-3xl sm:text-4xl text-primary tracking-[0.15em] mb-6 select-none">
        THE STEVE SHOW
      </h1>
      <TVBody />
      <p className="font-ui text-muted-foreground text-xs mt-6 tracking-wider uppercase">
        A late night broadcast from the EVE Frontier universe
      </p>
    </div>
  );
}
