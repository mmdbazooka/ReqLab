import { RequestsProvider } from "@/features/requests/provider";
import { AppShell } from "@/components/app-shell";
export default function DashboardLayout({children}:{children:React.ReactNode}) { return <RequestsProvider><AppShell>{children}</AppShell></RequestsProvider>; }
