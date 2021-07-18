import React, { useEffect, useMemo, useRef, useState } from "react";
import { Stage, Layer, Rect, Circle } from "react-konva";

enum Selection {
  STARTING_POINT = "starting-point",
  DESTINATION = "destination",
}

type Position = [number, number];

const useSelectedPoints = () => {
  const [startingPoint, setStartingPoint] = useState<Position | null>(null);
  const [currentSelector, setCurrentSelector] = useState<Selection>(
    Selection.STARTING_POINT
  );

  const [destination, setDestination] = useState<Position | null>(null);

  const setPoints = (position: [number, number]) => {
    if (currentSelector === Selection.STARTING_POINT) {
      setStartingPoint(position);
      setCurrentSelector(Selection.DESTINATION);
    } else {
      setDestination(position);
      setCurrentSelector(Selection.STARTING_POINT);
    }
  };

  return {
    startingPoint,
    destination,
    setPoints,
  };
};

enum Block {
  VOID = 0,
  OBSTACLE = 1,
  NONE = 0,
}

interface Metadata {
  type: string;
  height: number;
  width: number;
  path: string
}

export interface MapData {
  metadata: Metadata;
  map: Block[][];
}

export interface MapDataWire {
  id: string
  metadata: Metadata;
  map: string;
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

interface FileMetadata {
  city: string;
  version: number;
  size: number;
  path: string;
}

const SIZE_MULTIPLIER = 3;

interface MapViewProps {
  metadata: Metadata;
  map: Block[][];
  startingPoint: Position | null;
  destination: Position | null;
  setPoints: (position: Position) => void;
}

const MapView = ({
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

const useMaps = () => {
  const [currentMap, setCurrentMap] = useState<MapDataWire | null>(null);
  const [availableMaps, setAvailableMaps] = useState<FileMetadata[] | null>(
    null
  );

  const onMapChange = (id: string) => {
    fetch(`http://localhost:3001/maps/${id}`)
      .then((response) => response.json())
      .then((data: MapDataWire) => setCurrentMap(data));
  };

  useEffect(() => {
    fetch("http://localhost:3001/maps")
      .then((response) => response.json())
      .then(({ maps }: { maps: FileMetadata[] }) => setAvailableMaps(maps));
  }, []);

  return { availableMaps, onMapChange, currentMap };
};

export enum Pathfinder {
  DIJKSTRA = "dijkstra",
}

interface UsePathFinderProps {
  startingPoint: Position | null;
  destination: Position | null;
  mapId: string | undefined
}

const usePathfinders = ({ startingPoint, destination, mapId }: UsePathFinderProps) => {
  const [selectedPathfinder, setSelectedPathfinder] = useState<Pathfinder>(
    Pathfinder.DIJKSTRA
  );
  const [availablePathFinders, setAvailablePathFinders] = useState<
    Pathfinder[] | null
  >(null);
  const [shortestPath, setShortestPath] = useState<number[][] | null>(null)

  useEffect(() => {
    fetch("http://localhost:3001/pathfinders")
      .then((response) => response.json())
      .then(({ pathfinders }: { pathfinders: Pathfinder[] }) =>
        setAvailablePathFinders(pathfinders)
      );
  }, []);

  const onPathfinderChange = (value: string) => {
    if (!availablePathFinders) return null;
    const found = availablePathFinders.find(
      (pathfinder) => pathfinder === value
    );
    if (!found) return null;
    setSelectedPathfinder(found);
  };

  const findShortestPath = () => {
    if (!destination || !startingPoint || !mapId) return null
    fetch(
      `http://localhost:3001/pathfinders/${selectedPathfinder}/${mapId}/x=${startingPoint[0]}&y=${startingPoint[1]}/x=${destination[0]}&y=${destination[1]}`,
    ).then((response) => response.json())
    .then(data => setShortestPath(data))
  };

  return { availablePathFinders, onPathfinderChange, findShortestPath };
};

const capitalize = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

const App = (): JSX.Element => {
  const { startingPoint, destination, setPoints } = useSelectedPoints();
  const { availableMaps, currentMap, onMapChange } = useMaps();
  const { availablePathFinders, onPathfinderChange, findShortestPath } = usePathfinders({
    startingPoint,
    destination,
    mapId: currentMap?.id
  });
  if (!availableMaps || !availablePathFinders) return <></>;

  return (
    <>
      <select onChange={({ target }) => onMapChange(target.value)}>
        {availableMaps.map((map) => (
          <option key={map.path} value={map.path}>
            {map.city} {map.version}
          </option>
        ))}
      </select>
      <select onChange={({ target }) => onPathfinderChange(target.value)}>
        {availablePathFinders.map((pathfinder) => (
          <option key={pathfinder} value={pathfinder}>
            {capitalize(pathfinder)}
          </option>
        ))}
      </select>
      <button onClick={() => findShortestPath()} disabled={!destination || !startingPoint}>Find shortest path</button>
      {!currentMap ? (
        <p>Select a map</p>
      ) : (
        <MapView
          metadata={currentMap.metadata}
          map={JSON.parse(currentMap.map)}
          startingPoint={startingPoint}
          destination={destination}
          setPoints={setPoints}
        />
      )}
    </>
  );
};

export default App;
