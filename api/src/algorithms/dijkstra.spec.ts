import { dijkstra } from "./dijkstra";

test('dijkstra algorithm', () => {
    const result = dijkstra({startingPosition: [0, 1], destination: [1, 2], map: [[0, 0, 1], [0, 1, 0], [0, 0, 0]]}) 
    console.log('result: ', result);
  expect(1 + 2).toBe(3);
});