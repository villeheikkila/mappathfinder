import { useEffect, useState } from "react";
import { Position } from "../types";

export enum Pathfinder {
  DIJKSTRA = "dijkstra",
}

interface UsePathFinderProps {
  startingPoint: Position | null;
  destination: Position | null;
  mapId: string | undefined;
}

export const usePathfinder = ({
  startingPoint,
  destination,
  mapId,
}: UsePathFinderProps) => {
  const [selectedPathfinder, setSelectedPathfinder] = useState<Pathfinder>(
    Pathfinder.DIJKSTRA
  );
  const [availablePathFinders, setAvailablePathFinders] = useState<
    Pathfinder[] | null
  >(null);
  const [shortestPath, setShortestPath] = useState<number[][] | null>(null);

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
    if (!destination || !startingPoint || !mapId) return null;
    fetch(
      `http://localhost:3001/pathfinders/${selectedPathfinder}/${mapId}/x=${startingPoint[0]}&y=${startingPoint[1]}/x=${destination[0]}&y=${destination[1]}`
    )
      .then((response) => response.json())
      .then((data) => setShortestPath(data));
  };

  return { availablePathFinders, onPathfinderChange, findShortestPath };
};
