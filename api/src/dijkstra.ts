import { Block } from "./map-utils";
import { Position } from "./pathfinders";

interface PathfinderProps {
    startingPosition: Position, destination: Position, map: Block[][]
}

export const dijkstra = ({startingPosition, destination, map}: PathfinderProps) => {
    console.log('map: ', map);
    console.log('destination: ', destination);
    console.log('startingPosition: ', startingPosition);


}

