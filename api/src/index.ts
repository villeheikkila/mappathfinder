import { App } from "@tinyhttp/app";
import { logger } from "@tinyhttp/logger";
import { cors } from "@tinyhttp/cors";
import { createFileListing, readMap } from "./file-utils";
import { decodeMap } from "./map-utils";
import { Pathfinders } from "./pathfinders";

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
  const data = await readMap(req.params.id);
  const { metadata, map } = decodeMap(data);
  res.json({ metadata, map: JSON.stringify(map) });
});

app.get("/pathfinders", async (_, res) => {
  res.json({ pathfinders: Object.values(Pathfinders) });
});

app.listen(3001);
