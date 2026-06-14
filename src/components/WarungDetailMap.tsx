"use client";

import dynamic from "next/dynamic";
import type { MapDisplayMarker } from "@/components/MapView";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div
      aria-label="Memuat peta lokasi warung"
      className="h-[240px] animate-pulse rounded-3xl border border-kopi-200 bg-kopi-100 md:h-[320px]"
    />
  ),
});

type WarungDetailMapProps = {
  marker: MapDisplayMarker;
};

export function WarungDetailMap({ marker }: WarungDetailMapProps) {
  return (
    <MapView
      mode="display"
      markers={[marker]}
      ariaLabel={`Peta lokasi ${marker.nama}`}
      zoom={15}
      className="h-[240px] md:h-[320px]"
    />
  );
}
