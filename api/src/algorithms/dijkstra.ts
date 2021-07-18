import { Block } from "../utils/map-utils";
import { PathfinderProps, Position } from "../utils/pathfinder-utils";

interface Node {
  x: number,
  y: number
  isBlocked: boolean,
}

type Grid = Node[][]

const isBlocked = (grid: Grid) => ([x,y]: Position) => grid[x][y].isBlocked === true
const getNode = (grid: Grid) => ([x,y]: Position) => grid[x][y]

const transformMapToGrid = (map: Block[][]) => {
  const grid: Grid = Array(map.length).fill(null)
  
  for (let y = 0; y < map.length; y++) {
    grid[y] = []    
    for (let x = 0; x < map[0].length; x++) {
      grid[y][x] = {
        x,
        y,
        isBlocked: map[x][y] === 1,
      }
    }
  }

  return grid
}
 
export const dijkstra = ({
  startingPosition,
  destination,
  map,
}: PathfinderProps) => {
  const grid: Grid = transformMapToGrid(map)
  if (isBlocked(grid)(startingPosition)) throw new Error("Starting position is blocked")
  if (isBlocked(grid)(destination)) throw new Error("Destination is blocked")
  const firstNode = getNode(grid)(startingPosition) 
  const lastNode = getNode(grid)(destination) 
};
