## Design document

I'll implement a web site that can compare the speed of various pathfinding algorithms. The user can select the map, the start and end positions and the algorithm and then the program will compute the shortest path to the target using said algorithm. The website will also display the shortest route after it has been found and tell the user how long it took. I'll use some existing maps as the data.

## Algorithms

- Dijkstra's algorithm
- A\* algorithm
- Jump Point Search

## Goal

Path searching is both useful and interesting problem with no perfect solution. The results are easy to understand and it's computationally complex enough to highlight the speed differences between different algorithms even with relatively simple inputs. It's therefore a good showcase for the importance of selecting the correct algorithm for the problem.

## Tech stack

I'll use TypeScript as the programming language. The frontend is built with Vitejs, React and  Konva. It allows selecting the map, the the algorithm, starting position and destination. The backend provides a simple API for fetching and parsing the maps as well as an API for finding the shortest path with selected algorithm. This API will also return the time it took.

## Time and Space complexity

All the selected algorithms have the time complexity of θ(|E|+|V|\*log|V|) and space complexity of θ(|V|).

## Input and execution

User can select the algorithm, map, start and end positions on the web site. The program then does the computation and returns the end result to the user.

## Source

Wikipedia and Tietorakenteet ja algoritmit book.
