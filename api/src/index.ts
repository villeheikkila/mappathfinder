import { App } from "@tinyhttp/app";
import { logger } from "@tinyhttp/logger";
import { cors } from "@tinyhttp/cors";
import { createFileListing, readMap } from "./utils/file-utils";
import { decodeMap } from "./utils/map-utils";
import {
  parsePathfinder,
  parsePositions,
  pathfinder,
  Pathfinder,
  PathfinderOptions,
} from "./utils/pathfinder-utils";

const app = new App();

app
  .use(logger())
  .use(cors({ origin: "*" }))
  .options("*", cors());

app.get("/maps", async (_, res) => {
  const maps = await createFileListing();
  const filteredMaps = maps.filter(({ size }) => size === 256);
  res.json({ maps: filteredMaps });
});

app.get("/maps/:id/", async (req, res) => {
  const id = req.params.id;
  const data = await readMap(id);
  const { metadata, map } = decodeMap(data);
  console.log('metadata: ', metadata);
  console.log('map: ', console.dir(map));
  res.json({ id, metadata, map: JSON.stringify(map) });
});

app.get("/pathfinders", async (_, res) => {
  res.json({ pathfinders: Object.values(Pathfinder) });
});

app.get(
  "/pathfinders/:pathfinder/:map/:startingPosition/:destination",
  async (req, res) => {
    const data = await readMap(req.params.map);
    const { map } = decodeMap(data);

    const options: PathfinderOptions = {
      pathfinder: parsePathfinder(req.params.pathfinder),
      startingPosition: parsePositions(req.params.startingPosition),
      destination: parsePositions(req.params.destination),
      map,
    };

    const path = pathfinder(options);
    res.json({ options, path });
  }
);

app.listen(3001);
