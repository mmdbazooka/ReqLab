import { Suspense } from "react";
import { RequestWorkspace } from "@/features/requests/workspace";
export default function WorkspacePage() {
  return (
    <Suspense>
      <RequestWorkspace />
    </Suspense>
  );
}
