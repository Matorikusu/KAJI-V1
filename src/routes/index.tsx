import { createFileRoute } from "@tanstack/react-router";
import { KajiApp } from "@/components/kaji-app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <KajiApp />;
}
