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
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Responsive grid dimension calculation
  const [gridConfig, setGridConfig] = useState({
    rows,
    cols,
    cellSize,
    interactive: true,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    // Visibility observer to pause/halt when scrolled out of view
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    visibilityObserver.observe(containerRef.current);

    const updateGrid = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      if (clientWidth === 0 || clientHeight === 0) return;

      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const mobileView = clientWidth < 768;
      setIsMobile(mobileView);

      if (mobileView) {
        // Mobile (<768px): Light static grid with larger cells to slash DOM nodes by ~75%
        // ~6 cols x 10 rows = ~60 cells max (vs 250+ previously)
        const mobileCellSize = 72;
        const calculatedCols = Math.min(6, Math.ceil(clientWidth / mobileCellSize) + 1);
        const calculatedRows = Math.min(10, Math.ceil(clientHeight / mobileCellSize) + 1);

        setGridConfig({
          rows: Math.max(6, calculatedRows),
          cols: Math.max(5, calculatedCols),
          cellSize: mobileCellSize,
          interactive: false,
        });
        return;
      }

      // Desktop & Tablet (>=768px): Full dynamic ripple grid
      const effectiveCellSize = clientWidth < 1024 ? 48 : 52;
      const calculatedCols = Math.ceil(clientWidth / effectiveCellSize) + 2;
      const calculatedRows = Math.ceil(clientHeight / effectiveCellSize) + 2;

      const rowsCount = Math.max(10, calculatedRows);
      const colsCount = Math.max(12, calculatedCols);

      setGridConfig({
        rows: rowsCount,
        cols: colsCount,
        cellSize: effectiveCellSize,
        interactive: true,
      });

      // Desktop auto-trigger: single central illumination on initial mount once settled
      if (!hasAutoTriggeredRef.current && !prefersReducedMotion) {
        hasAutoTriggeredRef.current = true;
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
    return () => {
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute inset-0 h-full w-full flex items-center justify-center overflow-hidden",
        "[--cell-border-color:rgba(255,255,255,0.18)] [--cell-fill-color:rgba(255,255,255,0.04)] [--cell-shadow-color:rgba(255,255,255,0.30)]",
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
        key={isMobile ? "mobile-grid" : `base-${rippleKey}`}
        className="w-full h-full"
        rows={gridConfig.rows}
        cols={gridConfig.cols}
        cellSize={gridConfig.cellSize}
        clickedCell={isMobile || !isVisible ? null : clickedCell}
        onCellClick={
          gridConfig.interactive && isVisible
            ? (row, col) => {
                setClickedCell({ row, col });
                setRippleKey((k) => k + 1);
              }
            : undefined
        }
        interactive={gridConfig.interactive && !isMobile}
      />
    </div>
  );
};

type DivGridProps = {
  className?: string;
  rows: number;
  cols: number;
  cellSize: number;
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
  onCellClick,
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

        const delay = clickedCell ? Math.max(0, distance * 50) : 0;
        const duration = 240 + distance * 70;

        // Deterministic depth tier for subtle variations across rectangles
        const depthSeed = (rowIdx * 13 + colIdx * 7 + (rowIdx % 3) * 5) % 17;
        let cellBg = "rgba(255, 255, 255, 0.04)";
        let cellBorder = "rgba(255, 255, 255, 0.16)";

        if (depthSeed === 0 || depthSeed === 7) {
          cellBg = "rgba(255, 255, 255, 0.10)";
          cellBorder = "rgba(255, 255, 255, 0.28)";
        } else if (depthSeed === 3 || depthSeed === 11) {
          cellBg = "rgba(255, 255, 255, 0.07)";
          cellBorder = "rgba(255, 255, 255, 0.22)";
        } else if (depthSeed === 5 || depthSeed === 14) {
          cellBg = "rgba(255, 255, 255, 0.05)";
          cellBorder = "rgba(255, 255, 255, 0.19)";
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
              "cell relative border-[0.75px] transition-all duration-200",
              interactive && "cursor-pointer hover:bg-[rgba(255,255,255,0.22)] hover:border-[rgba(255,255,255,0.65)] hover:shadow-[0_0_14px_rgba(255,255,255,0.35)] will-change-transform",
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
              interactive && onCellClick
                ? () => onCellClick(rowIdx, colIdx)
                : undefined
            }
          />
        );
      })}
    </div>
  );
};
