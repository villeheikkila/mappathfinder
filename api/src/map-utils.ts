enum Block {
  VOID = 0,
  OBSTACLE = 1,
  NONE = 0,
}

interface Metadata {
  type: string;
  height: number;
  width: number;
}

export interface MapData {
  metadata: Metadata;
  map: Block[][];
}

const stringToBlock = (block: string) => {
  switch (block) {
    case ".": {
      return Block.VOID;
    }
    case "@": {
      return Block.OBSTACLE;
    }
    default: {
      return Block.NONE;
    }
  }
};

const splitDataToSections = (raw: string) => {
  const rows = raw.split("\n");
  const metadata = rows.slice(0, 3);
  const data = rows.slice(4);
  return [metadata, data];
};

const decodeMetaData = (data: string[]) => {
  if (data.length !== 3)
    throw new Error("Metadata array must have the length of 3");

  return {
    type: data[0].replace("type ", ""),
    height: parseInt(data[1].replace("height ", "")),
    width: parseInt(data[2].replace("width ", "")),
  };
};

const decodeMapData = (data: string[]) =>
  data.map((row) => row.split("").map(stringToBlock));

export const decodeMap = (raw: string): MapData => {
  const [info, data] = splitDataToSections(raw);
  const metadata = decodeMetaData(info);
  const map = decodeMapData(data);
  return { metadata, map };
};
