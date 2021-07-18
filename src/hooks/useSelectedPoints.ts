import { useState } from "react";
import { Position } from "../types";

enum Selection {
  STARTING_POINT = "starting-point",
  DESTINATION = "destination",
}

export const useSelectedPoints = () => {
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
