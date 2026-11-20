import { catalogUrl, initialView } from "./config.js";

function init() {
  const byId = (id) => document.getElementById(id);
  const status = byId("catalog-status");
  const mapStatus = byId("map-status");
  const controls = byId("layers");
  const opacity = byId("opacity");
  const recenter = byId("recenter");
  const L = window.L;
  if (!L) {
    status.textContent = "Leaflet tidak termuat. Periksa koneksi lalu muat ulang halaman.";
    return;
  }

  const map = L.map("map", { maxZoom: 21, minZoom: 3, scrollWheelZoom: false })
    .setView(initialView.center, initialView.zoom);
  map.createPane("baseMap");
  map.getPane("baseMap").style.zIndex = "180";
  map.getPane("baseMap").style.pointerEvents = "none";
  map.attributionControl.addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors');
  L.control.scale({ imperial: false }).addTo(map);
  let active = null;
  let baseFailed = false;
  let overlayFailed = false;
  function showTileStatus() {
    mapStatus.hidden = !baseFailed && !overlayFailed;
    mapStatus.textContent = overlayFailed
      ? "Sebagian tile lapisan tidak tersedia. Periksa kelengkapan tile atau cakupan raster."
      : "Peta dasar lokal tidak termuat.";
  }
  async function loadBasemap() {
    try {
      const layers = await Promise.all(["lines", "places"].map(async (name) => {
        const response = await fetch(new URL(`./basemap/${name}.geojson`, import.meta.url));
        if (!response.ok) throw new Error("Peta dasar tidak tersedia.");
        return response.json();
      }));
      L.geoJSON(layers, {
        pane: "baseMap",
        interactive: false,
        style: ({ properties: { highway, waterway } }) => {
          if (waterway && !highway) return { color: "#70aeb9", weight: 1.4, opacity: .85 };
          if (["primary", "secondary", "tertiary"].includes(highway)) {
            return { color: "#ac814e", weight: 2.3, opacity: .92 };
          }
          return { color: "#9b9b80", weight: 1.15, opacity: .7 };
        },
        pointToLayer: ({ properties }, latlng) => {
          const label = document.createElement("span");
          label.className = properties.place === "hamlet" ? "place-name hamlet" : "place-name";
          label.textContent = properties.name;
          const marker = L.marker(latlng, {
            pane: "baseMap", interactive: false, keyboard: false,
            icon: L.divIcon({ className: "place-marker", html: label, iconSize: [0, 0] }),
          });
          return marker;
        },
      }).addTo(map);
    } catch {
      baseFailed = true;
      showTileStatus();
    }
  }

  const layers = new Map();
  function focusArea() {
    if (!active) {
      map.setView(initialView.center, initialView.zoom);
      return;
    }
    const { bounds, minZoom, maxNativeZoom } = active.options;
    const zoom = Math.min(maxNativeZoom, Math.max(minZoom, map.getBoundsZoom(bounds, false, [48, 48])));
    map.setView(bounds.getCenter(), zoom);
  }
  recenter.disabled = false;
  recenter.addEventListener("click", focusArea);
  controls.disabled = false;
  controls.addEventListener("change", (event) => {
    const id = event.target.value;
    if (active) active.remove();
    active = layers.get(id) ?? null;
    overlayFailed = false;
    showTileStatus();
    byId("overlay-tools").hidden = !active;
    byId("index-legend").hidden = !["ndvi", "ndre"].includes(id);
    if (active) {
      active.setOpacity(Number(opacity.value) / 100).addTo(map);
      focusArea();
    }
  });
  opacity.addEventListener("input", () => {
    byId("opacity-value").value = `${opacity.value}%`;
    active?.setOpacity(Number(opacity.value) / 100);
  });

  async function loadCatalog() {
    const url = new URL(catalogUrl, document.baseURI);
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (response.status === 404) {
        status.textContent = "Tile Kemitir belum dipasang. Peta dasar tetap tersedia.";
        return;
      }
      if (!response.ok) throw new Error("Katalog tidak dapat diakses.");
      const catalog = await response.json();
      if (catalog.version !== 1 || !catalog.layers || typeof catalog.layers !== "object") {
        throw new Error("Format katalog tidak dikenali.");
      }
      for (const id of ["rgb", "ndvi", "ndre", "hillshade"]) {
        const item = catalog.layers[id];
        if (!item || !/^[a-z0-9-]+\/\{z\}\/\{x\}\/\{y\}\.png$/.test(item.template)
            || !Number.isInteger(item.minZoom) || !Number.isInteger(item.maxNativeZoom)
            || item.minZoom < 0 || item.maxNativeZoom < item.minZoom || item.maxNativeZoom > 21
            || !Array.isArray(item.bounds) || item.bounds.length !== 2
            || !item.bounds.every((point) => Array.isArray(point) && point.length === 2
              && point.every(Number.isFinite))
            || item.bounds[0][0] >= item.bounds[1][0] || item.bounds[0][1] >= item.bounds[1][1]
            || item.bounds.some(([lat, lng]) => Math.abs(lat) > 90 || Math.abs(lng) > 180)) continue;
        const template = new URL(".", response.url).href + item.template;
        const layer = L.tileLayer(template, {
          bounds: L.latLngBounds(item.bounds),
          minZoom: item.minZoom,
          minNativeZoom: item.minZoom,
          maxNativeZoom: item.maxNativeZoom,
          maxZoom: 21,
          noWrap: true,
        });
        layer.on("tileerror", () => {
          if (active === layer) { overlayFailed = true; showTileStatus(); }
        });
        layer.on("loading", () => {
          if (active === layer) { overlayFailed = false; showTileStatus(); }
        });
        layers.set(id, layer);
        controls.querySelector(`input[value="${id}"]`).disabled = false;
        const badge = controls.querySelector(`[data-state="${id}"]`);
        badge.textContent = "Siap";
        badge.classList.add("ready");
      }
      status.textContent = layers.size
        ? `${layers.size} dari 4 lapisan Kemitir siap ditampilkan.`
        : "Katalog tidak memuat lapisan yang dapat ditampilkan.";
    } catch {
      status.textContent = "Katalog tile gagal dimuat. Periksa URL, izin akses, dan konfigurasi CORS.";
    }
  }
  loadBasemap();
  loadCatalog();
}

document.addEventListener("DOMContentLoaded", init);
