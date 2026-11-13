"use client";
import { createContext,useContext } from "react";
import { useLocalStore } from "@/lib/use-local-store";
import { initialWorkspace,workspaceSchema,type Workspace } from "./model";
const Context=createContext<ReturnType<typeof useLocalStore<Workspace>>|null>(null);
export function RequestsProvider({children}:{children:React.ReactNode}){const store=useLocalStore("reqlab-workspace-v1",initialWorkspace,workspaceSchema);return <Context.Provider value={store}>{children}</Context.Provider>;}
export function useRequests(){const store=useContext(Context);if(!store)throw new Error("RequestsProvider missing");return store;}
