"use client";

import { useEffect, useState } from "react";
import { FormView } from "@/components/cp-stroke/form-view";
import { SubmissionsList } from "@/components/cp-stroke/submissions-list";
import { SubmissionDetail } from "@/components/cp-stroke/submission-detail";

type View = "form" | "submissions" | "detail";

export default function Home() {
  const [view, setView] = useState<View>("form");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pin, setPin] = useState<string>("");

  useEffect(() => {
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const v = (params.get("view") as View) || "form";
      setView(v);
      if (v === "detail") {
        const id = params.get("id");
        if (id) setSelectedId(id);
      }
    };
    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, []);

  const navigate = (newView: View, id?: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("view", newView);
    if (id) url.searchParams.set("id", id);
    else url.searchParams.delete("id");
    window.history.pushState({}, "", url);
    setView(newView);
    if (id) setSelectedId(id);
  };

  if (view === "submissions") {
    return (
      <SubmissionsList
        initialPin={pin}
        onPinChange={setPin}
        onSelectDetail={(id) => navigate("detail", id)}
        onBack={() => navigate("form")}
      />
    );
  }

  if (view === "detail" && selectedId) {
    return (
      <SubmissionDetail
        id={selectedId}
        pin={pin}
        onBack={() => navigate("submissions")}
      />
    );
  }

  return <FormView onViewSubmissions={() => navigate("submissions")} />;
}
