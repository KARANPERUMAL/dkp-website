"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const BackgroundRippleEffect = ({
  rows = 14,
  cols = 32,
  cellSize = 54,
  className,
}: {
  rows?: number;
  cols?: number;
  cellSize?: number;
  className?: string;
}) => {
  const [clickedCell, setClickedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [rippleKey, setRippleKey] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hasAutoTriggeredRef = useRef(false);

  // Responsive grid dimension calculation to seamlessly tile edge-to-edge across all viewports
  const [gridConfig, setGridConfig] = useState({
    rows,
    cols,
    cellSize,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const updateGrid = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      if (clientWidth === 0 || clientHeight === 0) return;

      // Adjust cellSize responsively: 42px on mobile, 48px on tablet, 52px on desktop
      const effectiveCellSize = clientWidth < 640 ? 42 : clientWidth < 1024 ? 48 : 52;
      const calculatedCols = Math.ceil(clientWidth / effectiveCellSize) + 2;
      const calculatedRows = Math.ceil(clientHeight / effectiveCellSize) + 2;

      const rowsCount = Math.max(10, calculatedRows);
      const colsCount = Math.max(12, calculatedCols);

      setGridConfig({
        rows: rowsCount,
        cols: colsCount,
        cellSize: effectiveCellSize,
      });

      // Automatically trigger the single central rectangle illumination on initial mount once dimensions settle
      if (!hasAutoTriggeredRef.current) {
        hasAutoTriggeredRef.current = true;

        // Respect prefers-reduced-motion
        if (
          typeof window !== "undefined" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
          return;
        }

        setTimeout(() => {
          const exactCenterRow = Math.floor(rowsCount / 2);
          const exactCenterCol = Math.floor(colsCount / 2);
          setClickedCell({ row: exactCenterRow, col: exactCenterCol });
          setRippleKey((k) => k + 1);
        }, 320);
      }
    };

    updateGrid();

    const resizeObserver = new ResizeObserver(() => {
      updateGrid();
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute inset-0 h-full w-full flex items-center justify-center overflow-hidden",
        "[--cell-border-color:rgba(59,130,246,0.22)] [--cell-fill-color:rgba(30,58,138,0.06)] [--cell-shadow-color:rgba(56,189,248,0.30)]",
        className,
      )}
      style={{
        maskImage:
          "radial-gradient(ellipse 94% 88% at 50% 45%, black 45%, rgba(0,0,0,0.85) 75%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 94% 88% at 50% 45%, black 45%, rgba(0,0,0,0.85) 75%, transparent 100%)",
      }}
    >
      <DivGrid
        key={`base-${rippleKey}`}
        className="w-full h-full"
        rows={gridConfig.rows}
        cols={gridConfig.cols}
        cellSize={gridConfig.cellSize}
        clickedCell={clickedCell}
        onCellClick={(row, col) => {
          setClickedCell({ row, col });
          setRippleKey((k) => k + 1);
        }}
        interactive
      />
    </div>
  );
};

type DivGridProps = {
  className?: string;
  rows: number;
  cols: number;
  cellSize: number; // in pixels
  clickedCell: { row: number; col: number } | null;
  onCellClick?: (row: number, col: number) => void;
  interactive?: boolean;
};

type CellStyle = React.CSSProperties & {
  ["--delay"]?: string;
  ["--duration"]?: string;
  ["--cell-fill-color"]?: string;
  ["--cell-border-color"]?: string;
};

const DivGrid = ({
  className,
  rows,
  cols,
  cellSize,
  clickedCell = null,
  onCellClick = () => {},
  interactive = true,
}: DivGridProps) => {
  const cells = useMemo(
    () => Array.from({ length: rows * cols }, (_, idx) => idx),
    [rows, cols],
  );

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
    gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
    width: cols * cellSize,
    height: rows * cellSize,
    marginInline: "auto",
    touchAction: "pan-y",
  };

  return (
    <div className={cn("relative z-[3] select-none", className)} style={gridStyle}>
      {cells.map((idx) => {
        const rowIdx = Math.floor(idx / cols);
        const colIdx = idx % cols;

        const distance = clickedCell
          ? Math.hypot(clickedCell.row - rowIdx, clickedCell.col - colIdx)
          : 0;

        const delay = clickedCell ? Math.max(0, distance * 50) : 0; // ms
        const duration = 240 + distance * 70; // ms

        // Calculate deterministic depth tier for subtle variations across rectangles
        const depthSeed = (rowIdx * 13 + colIdx * 7 + (rowIdx % 3) * 5) % 17;
        let cellBg = "rgba(30, 58, 138, 0.055)"; // Default translucent navy fill
        let cellBorder = "rgba(59, 130, 246, 0.20)"; // Default crisp blue border

        if (depthSeed === 0 || depthSeed === 7) {
          // Tier 1: Slightly highlighted accent tiles (approx ~12% of tiles)
          cellBg = "rgba(56, 189, 248, 0.11)";
          cellBorder = "rgba(96, 165, 250, 0.34)";
        } else if (depthSeed === 3 || depthSeed === 11) {
          // Tier 2: Medium subtle blue depth tiles (approx ~12% of tiles)
          cellBg = "rgba(37, 99, 235, 0.09)";
          cellBorder = "rgba(56, 189, 248, 0.26)";
        } else if (depthSeed === 5 || depthSeed === 14) {
          // Tier 3: Soft ambient blue tiles
          cellBg = "rgba(30, 58, 138, 0.08)";
          cellBorder = "rgba(59, 130, 246, 0.23)";
        }

        const animStyle: CellStyle = clickedCell
          ? {
              "--delay": `${delay}ms`,
              "--duration": `${duration}ms`,
              "--cell-fill-color": cellBg,
              "--cell-border-color": cellBorder,
            }
          : {
              "--cell-fill-color": cellBg,
              "--cell-border-color": cellBorder,
            };

        return (
          <div
            key={idx}
            className={cn(
              "cell relative border-[0.75px] transition-all duration-200 will-change-transform cursor-pointer",
              "hover:bg-[rgba(56,189,248,0.20)] hover:border-[rgba(147,197,253,0.55)] hover:shadow-[0_0_14px_rgba(56,189,248,0.30)]",
              clickedCell && "animate-cell-ripple [animation-fill-mode:none]",
              !interactive && "pointer-events-none",
            )}
            style={{
              backgroundColor: cellBg,
              borderColor: cellBorder,
              touchAction: "pan-y",
              ...animStyle,
            }}
            onClick={
              interactive ? () => onCellClick?.(rowIdx, colIdx) : undefined
            }
          />
        );
      })}
    </div>
  );
};
