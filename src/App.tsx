import React from "react";
import { Button } from "./components/Button";
import { MapView } from "./components/MapView";
import { Select } from "./components/Select";
import { useMap } from "./hooks/useMap";
import { usePathfinder } from "./hooks/usePathfinder";
import { useSelectedPoints } from "./hooks/useSelectedPoints";

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
      <div style={{ width: "200px" }}>
        <label style={{ display: "flex", flexDirection: "column" }}>
          Select the city
          <Select
            options={availableMaps
              .map((map) => ({
                value: map.path,
                label: `${map.city} ${map.version}`,
              }))
              .concat({ label: "-", value: "-" })}
            onChange={({ target }) => onMapChange(target.value)}
            selected={currentMap?.id || "-"}
          />
        </label>
        <Select
          options={availablePathFinders.map((pathfinder) => ({
            value: pathfinder,
            label: pathfinder,
          }))}
          onChange={({ target }) => onPathfinderChange(target.value)}
        />

        <Button
          onClick={() => findShortestPath()}
          disabled={!destination || !startingPoint}
        >
          Find shortest path
        </Button>
      </div>
      {currentMap && (
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
