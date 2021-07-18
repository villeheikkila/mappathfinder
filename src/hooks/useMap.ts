import React, { useEffect, useState } from "react";
import { Block } from "../types";

export interface Metadata {
  type: string;
  height: number;
  width: number;
  path: string;
}

export interface MapData {
  metadata: Metadata;
  map: Block[][];
}

export interface MapDataWire {
  id: string;
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

export const useMap = () => {
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
