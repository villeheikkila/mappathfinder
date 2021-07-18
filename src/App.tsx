import React from "react";
import { MapView } from "./components/MapView";
import { useMap } from "./hooks/useMap";
import { usePathfinder } from "./hooks/usePathfinder";
import { useSelectedPoints } from "./hooks/useSelectedPoints";
import { capitalize } from "./utils";

const App = (): JSX.Element => {
  const { startingPoint, destination, setPoints } = useSelectedPoints();
  const { availableMaps, currentMap, onMapChange } = useMap();
  const { availablePathFinders, onPathfinderChange, findShortestPath } =
    usePathfinder({
      startingPoint,
      destination,
      mapId: currentMap?.id,
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
      <button
        onClick={() => findShortestPath()}
        disabled={!destination || !startingPoint}
      >
        Find shortest path
      </button>
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
