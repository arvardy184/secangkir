"use client";

// ADR: Why Leaflet over Google Maps
// Google Maps API requires billing setup, which adds friction for a hackathon demo.
// Leaflet + OpenStreetMap is free, fast to wire up, and sufficient for location picking
// and displaying warung pins across onboarding and explore flows.

import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import type { LeafletMouseEvent } from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

type Coordinates = {
  lat: number;
  lng: number;
};

export type MapDisplayMarker = {
  id: string;
  nama: string;
  lat: number | null;
  lng: number | null;
  alamat?: string | null;
};

type PickMapViewProps = {
  mode: "pick";
  value?: Coordinates | null;
  onLocationChange?: (location: Coordinates) => void;
  className?: string;
  ariaLabel?: string;
  zoom?: number;
};

type DisplayMapViewProps = {
  mode: "display";
  markers: MapDisplayMarker[];
  className?: string;
  ariaLabel?: string;
  zoom?: number;
};

export type MapViewProps = PickMapViewProps | DisplayMapViewProps;

const DEFAULT_LOCATION: Coordinates = {
  lat: -6.200000,
  lng: 106.816666,
};

const DEFAULT_PICK_ZOOM = 15;
const DEFAULT_DISPLAY_ZOOM = 13;

// Fix Leaflet default marker icons under Next.js bundler.
delete (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: unknown })
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapView(props: MapViewProps) {
  const mapClassName = props.className
    ? `h-[360px] w-full ${props.className}`
    : "h-[360px] w-full";

  if (props.mode === "pick") {
    const selectedLocation = getCoordinates(props.value);
    const description = `Geser marker atau klik peta untuk memilih lokasi. Latitude ${selectedLocation.lat.toFixed(
      6,
    )}, longitude ${selectedLocation.lng.toFixed(6)}.`;

    return (
      <section
        aria-label={props.ariaLabel ?? "Peta pilih lokasi warung"}
        className="space-y-3"
      >
        <div className="overflow-hidden rounded-3xl border border-kopi-200 bg-white shadow-sm">
          <MapContainer
            center={[selectedLocation.lat, selectedLocation.lng]}
            zoom={props.zoom ?? DEFAULT_PICK_ZOOM}
            scrollWheelZoom
            className={mapClassName}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <SyncMapCenter center={selectedLocation} zoom={props.zoom} />
            <PickLocationEvents
              onLocationChange={props.onLocationChange}
              zoom={props.zoom}
            />
            <DraggableMarker
              location={selectedLocation}
              onLocationChange={props.onLocationChange}
            />
          </MapContainer>
        </div>
        <p className="text-sm text-kopi-700">{description}</p>
      </section>
    );
  }

  const validMarkers = props.markers.filter(hasCoordinates);
  const description =
    validMarkers.length > 0
      ? `Menampilkan ${validMarkers.length} pin warung pada peta.`
      : "Belum ada lokasi warung untuk ditampilkan.";

  return (
    <section
      aria-label={props.ariaLabel ?? "Peta lokasi warung"}
      className="space-y-3"
    >
      <div className="overflow-hidden rounded-3xl border border-kopi-200 bg-white shadow-sm">
        <MapContainer
          center={getDisplayCenter(validMarkers)}
          zoom={props.zoom ?? DEFAULT_DISPLAY_ZOOM}
          scrollWheelZoom
          className={mapClassName}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitDisplayBounds markers={validMarkers} zoom={props.zoom} />
          {validMarkers.map((marker) => (
            <Marker key={marker.id} position={[marker.lat, marker.lng]}>
              <Popup>
                <div className="space-y-1">
                  <p className="font-semibold text-kopi-900">{marker.nama}</p>
                  {marker.alamat ? (
                    <p className="text-sm text-kopi-700">{marker.alamat}</p>
                  ) : null}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <p className="text-sm text-kopi-700">{description}</p>
    </section>
  );
}

function SyncMapCenter({
  center,
  zoom,
}: {
  center: Coordinates;
  zoom?: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView([center.lat, center.lng], zoom ?? map.getZoom());
  }, [center.lat, center.lng, map, zoom]);

  return null;
}

function PickLocationEvents({
  onLocationChange,
  zoom,
}: {
  onLocationChange?: (location: Coordinates) => void;
  zoom?: number;
}) {
  const map = useMapEvents({
    click(event: LeafletMouseEvent) {
      if (!onLocationChange) {
        return;
      }

      const nextLocation = {
        lat: event.latlng.lat,
        lng: event.latlng.lng,
      };

      onLocationChange(nextLocation);
      map.setView([nextLocation.lat, nextLocation.lng], zoom ?? map.getZoom());
    },
  });

  return null;
}

function DraggableMarker({
  location,
  onLocationChange,
}: {
  location: Coordinates;
  onLocationChange?: (location: Coordinates) => void;
}) {
  const markerRef = useRef<L.Marker>(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        if (!onLocationChange) {
          return;
        }

        const marker = markerRef.current;
        const markerLocation = marker?.getLatLng();

        if (!markerLocation) {
          return;
        }

        onLocationChange({
          lat: markerLocation.lat,
          lng: markerLocation.lng,
        });
      },
    }),
    [onLocationChange],
  );

  return (
    <Marker
      draggable
      ref={markerRef}
      position={[location.lat, location.lng]}
      eventHandlers={eventHandlers}
    >
      <Popup>Pilih lokasi warung di titik ini.</Popup>
    </Marker>
  );
}

function FitDisplayBounds({
  markers,
  zoom,
}: {
  markers: Array<MapDisplayMarker & Coordinates>;
  zoom?: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (markers.length === 0) {
      map.setView([DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng], zoom ?? 11);
      return;
    }

    if (markers.length === 1) {
      map.setView(
        [markers[0].lat, markers[0].lng],
        zoom ?? DEFAULT_DISPLAY_ZOOM,
      );
      return;
    }

    const bounds = L.latLngBounds(
      markers.map((marker) => [marker.lat, marker.lng]),
    );
    map.fitBounds(bounds, { padding: [32, 32] });
  }, [map, markers, zoom]);

  return null;
}

function hasCoordinates(
  marker: MapDisplayMarker,
): marker is MapDisplayMarker & Coordinates {
  return typeof marker.lat === "number" && typeof marker.lng === "number";
}

function getCoordinates(location?: Coordinates | null): Coordinates {
  if (!location) {
    return DEFAULT_LOCATION;
  }

  return location;
}

function getDisplayCenter(
  markers: Array<MapDisplayMarker & Coordinates>,
): [number, number] {
  if (markers.length === 0) {
    return [DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng];
  }

  return [markers[0].lat, markers[0].lng];
}
