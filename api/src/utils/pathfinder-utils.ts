import { dijkstra } from "../algorithms/dijkstra"
import { Block } from "./map-utils"
import { assertNever } from "./utils"

export enum Pathfinder {
  DIJKSTRA = "dijkstra"
}

export type Position = [number, number]

export type PathfinderOptions = {
  pathfinder: Pathfinder
  startingPosition: Position
  destination: Position
  map: Block[][]
}

export interface PathfinderProps {
  startingPosition: Position;
  destination: Position;
  map: Block[][];
}


export const parsePositions = (position: string): Position => {
  const split = position.split("&")
  const x = split[0].replace("x=", "")
  const y = split[1].replace("y=", "")
  return [parseInt(x), parseInt(y)]
}

export const parsePathfinder = (pathfinder: string): Pathfinder => {
  switch (pathfinder) {
    case Pathfinder.DIJKSTRA: return Pathfinder.DIJKSTRA
    default: throw new Error("selected pathfinder is not supported")
  }
}

export const pathfinder = ({ pathfinder, ...parameters }: PathfinderOptions) => {
  switch (pathfinder) {
    case Pathfinder.DIJKSTRA: {
      return dijkstra(parameters)
    }
    default: {
      assertNever(pathfinder)
    }
  }

}