import { useEffect } from "react";
import { Toaster } from "sonner";
import { DoneStage } from "@/components/done-stage";
import { DropStage } from "@/components/drop-stage";
import { ForgeStage } from "@/components/forge-stage";
import { KajiHeader } from "@/components/kaji-header";
import { SetStage } from "@/components/set-stage";
import { StageRail } from "@/components/stage-rail";
import { useKaji } from "@/lib/kaji-store";

export function KajiApp() {
  const stage = useKaji((s) => s.stage);
  const loadHistory = useKaji((s) => s.loadHistory);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return (
    <div className="relative flex min-h-dvh flex-col bg-bg text-fg">
      <KajiHeader />
      {stage === "drop" ? <DropStage /> : null}
      {stage === "set" ? <SetStage /> : null}
      {stage === "forge" ? <ForgeStage /> : null}
      {stage === "done" ? <DoneStage /> : null}
      <StageRail />
      <Toaster
        theme="dark"
        position="bottom-center"
        toastOptions={{
          className: "!bg-elevated !text-fg !border-border !font-sans",
        }}
      />
    </div>
  );
}
