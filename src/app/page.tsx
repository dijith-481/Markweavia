"use client";
import HomePageClient from "../components/HomePageClient";
import { SlideContextProvider } from "@/context/slideContext";

export default function Page() {
  return (
    <SlideContextProvider>
      <HomePageClient />
    </SlideContextProvider>
  );
}
