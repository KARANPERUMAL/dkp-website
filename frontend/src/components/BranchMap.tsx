import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { branchLocations, type BranchLocation } from '../data/branchesData';
import { IconDirections, IconClock, IconRefresh } from '@tabler/icons-react';

export const BranchMap = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const [selectedBranchId, setSelectedBranchId] = useState<string>(branchLocations[0].id);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // Prevent double initialization

    // Initialize Leaflet map
    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      scrollWheelZoom: false, // Prevent accidental scrolling when browsing page
    });
    mapInstanceRef.current = map;

    // Add OpenStreetMap Tile Layer with required attribution
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors | DKP Innovation Locations',
    }).addTo(map);

    // Create custom DKP yellow marker icon with animated pulse ring
    const createCustomIcon = (isSelected: boolean, index: number) => {
      const pinColor = '#FFD60A';
      const scale = isSelected ? 1.15 : 1.0;
      return L.divIcon({
        className: 'custom-dkp-marker',
        html: `
          <div style="position: relative; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; transform: scale(${scale}); transition: transform 0.25s ease;">
            ${isSelected ? '<div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background: rgba(255, 214, 10, 0.45); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>' : ''}
            <div style="width: 32px; height: 32px; border-radius: 50%; background: ${pinColor}; border: 3px solid #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; color: #002244; font-weight: 800; font-size: 13px;">
              ${index + 1}
            </div>
            <div style="position: absolute; bottom: -6px; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 7px solid ${pinColor};"></div>
          </div>
        `,
        iconSize: [38, 44],
        iconAnchor: [19, 44],
        popupAnchor: [0, -42],
      });
    };

    // Add markers for all three branches
    const bounds = L.latLngBounds([]);

    branchLocations.forEach((branch, idx) => {
      const latLng = L.latLng(branch.lat, branch.lon);
      bounds.extend(latLng);

      const marker = L.marker(latLng, {
        icon: createCustomIcon(branch.id === selectedBranchId, idx),
        title: branch.name,
      }).addTo(map);

      // Popup with branch details & direct directions link
      const popupContent = `
        <div style="font-family: inherit; padding: 4px 2px; max-width: 260px;">
          <div style="display: inline-block; background: #fef9c3; color: #854d0e; border: 1px solid #fde047; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 12px; margin-bottom: 6px; text-transform: uppercase;">
            ${branch.tag}
          </div>
          <h4 style="margin: 0 0 6px 0; font-size: 14px; font-weight: 700; color: #1e293b; line-height: 1.3;">
            ${branch.name}
          </h4>
          <p style="margin: 0 0 8px 0; font-size: 12px; color: #64748b; line-height: 1.45;">
            ${branch.address}
          </p>
          <div style="display: flex; gap: 8px; margin-top: 8px;">
            <a href="${branch.directionsUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 4px; background: #FFD60A; color: #002244; padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: 700; text-decoration: none;">
              Get Directions &#8599;
            </a>
            <a href="tel:${branch.phone.replace(/[^0-9+]/g, '')}" style="display: inline-flex; align-items: center; gap: 4px; background: #f1f5f9; color: #334155; padding: 6px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; text-decoration: none;">
              Call Branch
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        setSelectedBranchId(branch.id);
      });

      markersRef.current[branch.id] = marker;
    });

    // Fit map bounds to encompass all three branches simultaneously with comfortable padding
    map.fitBounds(bounds, {
      padding: [45, 45],
      maxZoom: 13,
    });

    // Cleanup on unmount
    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update marker icons and pan when selected branch changes
  const handleSelectBranch = (branch: BranchLocation) => {
    setSelectedBranchId(branch.id);
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo([branch.lat, branch.lon], 14, {
        duration: 1.0,
      });
      const marker = markersRef.current[branch.id];
      if (marker) {
        setTimeout(() => {
          marker.openPopup();
        }, 800);
      }
    }
  };

  const handleResetView = () => {
    const map = mapInstanceRef.current;
    if (map) {
      const bounds = L.latLngBounds(branchLocations.map((b) => [b.lat, b.lon]));
      map.fitBounds(bounds, { padding: [45, 45], maxZoom: 13 });
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch">
        
        {/* Left Column: Interactive Branch Location Cards */}
        <div className="w-full lg:w-[420px] flex flex-col space-y-3.5">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#854D0E]">
              Select Branch to Locate
            </span>
            <button
              onClick={handleResetView}
              className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-[#854D0E] transition-colors font-medium cursor-pointer"
              title="Show all 3 branches"
            >
              <IconRefresh className="w-3.5 h-3.5" />
              <span>Show All Locations</span>
            </button>
          </div>

          {branchLocations.map((branch, idx) => {
            const isSelected = selectedBranchId === branch.id;
            return (
              <div
                key={branch.id}
                onClick={() => handleSelectBranch(branch)}
                className={`group relative p-4 sm:p-5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#004D86] text-white border-[#FFD60A]/80 shadow-[0_6px_20px_rgba(255,214,10,0.2)] ring-1 ring-[#FFD60A]/40'
                    : 'bg-white hover:bg-neutral-50 text-neutral-900 border-neutral-200/90 shadow-sm'
                }`}
              >
                {/* Branch Number & Tag */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isSelected
                          ? 'bg-[#FFD60A] text-[#002244]'
                          : 'bg-neutral-100 text-neutral-700 group-hover:bg-[#FFD60A]/20 group-hover:text-[#854D0E]'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span
                      className={`text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-[#FFD60A]/20 text-[#FFD60A] border border-[#FFD60A]/30'
                          : 'bg-[#FEF9C3] text-[#854D0E] border border-[#FDE047]'
                      }`}
                    >
                      {branch.tag}
                    </span>
                  </div>

                  <span
                    className={`text-xs font-medium transition-colors ${
                      isSelected ? 'text-[#FFD60A]' : 'text-neutral-400 group-hover:text-[#854D0E]'
                    }`}
                  >
                    Click to view map &rarr;
                  </span>
                </div>

                {/* Branch Name & Address */}
                <h4
                  className={`text-base font-bold mb-1.5 leading-snug ${
                    isSelected ? 'text-white' : 'text-neutral-900'
                  }`}
                >
                  {branch.name}
                </h4>
                <p
                  className={`text-xs leading-relaxed mb-3 ${
                    isSelected ? 'text-neutral-300' : 'text-neutral-600'
                  }`}
                >
                  {branch.address}
                </p>

                {/* Metadata & Actions */}
                <div
                  className={`pt-3 border-t flex flex-wrap items-center justify-between gap-2 text-xs ${
                    isSelected ? 'border-neutral-800 text-neutral-400' : 'border-neutral-100 text-neutral-500'
                  }`}
                >
                  <div className="flex items-center space-x-1.5">
                    <IconClock className="w-3.5 h-3.5 text-[#FFD60A]" />
                    <span className="text-[11px]">{branch.hours}</span>
                  </div>

                  <a
                    href={branch.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className={`inline-flex items-center space-x-1 font-semibold text-[11px] px-2.5 py-1 rounded-md transition-colors ${
                      isSelected
                        ? 'bg-[#FFD60A] hover:bg-[#FFE047] text-[#002244] font-bold'
                        : 'bg-neutral-100 hover:bg-[#FFD60A]/20 text-neutral-800 hover:text-[#002244]'
                    }`}
                  >
                    <IconDirections className="w-3.5 h-3.5" />
                    <span>Get Directions</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Interactive Leaflet Map */}
        <div className="flex-1 relative min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] rounded-2xl overflow-hidden border border-neutral-200 shadow-lg bg-neutral-100">
          <div
            ref={mapContainerRef}
            className="w-full h-full absolute inset-0 z-0"
            style={{ minHeight: '100%' }}
            aria-label="Interactive map displaying all three DKP Innovation branches in Bengaluru"
          />

          {/* Floating Map Legend Indicator */}
          <div className="absolute top-3 right-3 z-[1000] bg-white/95 backdrop-blur-sm border border-neutral-200/80 px-3 py-2 rounded-lg shadow-md text-xs text-neutral-700 pointer-events-auto flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFD60A] animate-pulse"></span>
            <span className="font-semibold text-neutral-800">3 Bengaluru Branches</span>
          </div>
        </div>

      </div>
    </div>
  );
};
