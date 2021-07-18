import React from "react";
import { useMemo } from "react";
import { Circle, Layer, Rect, Stage } from "react-konva";
import { Metadata } from "../hooks/useMap";
import { Block, Position } from "../types";

const SIZE_MULTIPLIER = 3;

interface MapViewProps {
  metadata: Metadata;
  map: Block[][];
  startingPoint: Position | null;
  destination: Position | null;
  setPoints: (position: Position) => void;
}

const blockToColor = (block: Block) => {
  switch (block) {
    case Block.NONE:
      return "white";
    case Block.OBSTACLE:
      return "black";
    default:
      return "white";
  }
};

export const MapView = ({
  metadata,
  map,
  startingPoint,
  destination,
  setPoints,
}: MapViewProps) => {
  const cachedMap = useMemo(
    () => (
      <>
        {map.map((row, x) =>
          row.map((block, y) => (
            <Rect
              key={`${x}-${y}`}
              x={x * SIZE_MULTIPLIER}
              y={y * SIZE_MULTIPLIER}
              width={SIZE_MULTIPLIER}
              height={SIZE_MULTIPLIER}
              fill={blockToColor(block)}
            />
          ))
        )}
      </>
    ),
    [map]
  );

  return (
    <div>
      <div>
        {Object.entries(metadata).map(([k, v]) => (
          <div key={k}>
            <p>
              {k}: {v}
            </p>
          </div>
        ))}
        {startingPoint && (
          <p>
            Starting position: ({`${startingPoint[0]},${startingPoint[1]}`})
          </p>
        )}
        {destination && (
          <p>Destination: ({`${destination[0]},${destination[1]}`})</p>
        )}
      </div>
      <Stage
        width={metadata.width * 3}
        height={metadata.height * 3}
        onClick={(e) => {
          const [x, y] = [
            e.target.attrs.x / SIZE_MULTIPLIER,
            e.target.attrs.y / SIZE_MULTIPLIER,
          ];
          const isPossible = map[x][y] === 0;
          if (isPossible) {
            setPoints([x, y]);
          }
        }}
      >
        <Layer>
          {cachedMap}

          {startingPoint && (
            <Circle
              x={startingPoint[0] * SIZE_MULTIPLIER}
              y={startingPoint[1] * SIZE_MULTIPLIER}
              radius={SIZE_MULTIPLIER}
              fill="green"
            />
          )}
          {destination && (
            <Circle
              x={destination[0] * SIZE_MULTIPLIER}
              y={destination[1] * SIZE_MULTIPLIER}
              radius={SIZE_MULTIPLIER}
              fill="red"
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};
