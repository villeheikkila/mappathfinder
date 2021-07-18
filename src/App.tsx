import React, { useMemo, useRef, useState } from "react";
import { Stage, Layer, Rect, Circle } from "react-konva";

enum Block {
  VOID = "white",
  OBSTACLE = "black",
  NONE = "red",
}

enum Selection {
  STARTING_POINT = "starting-point",
  DESTINATION = "destination",
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

const SIZE_MULTIPLIER = 3;

interface Metadata {
  type: string;
  height: number;
  width: number;
}

interface Map {
  metadata: Metadata;
  map: Block[][];
}

const decodeMap = (raw: string): Map => {
  const [info, data] = splitDataToSections(raw);
  const metadata = decodeMetaData(info);
  const map = decodeMapData(data);
  return { metadata, map };
};

type Position = [number, number];

const useSelectedPoints = () => {
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

interface ReadMapUserInputProps {
  setLoadedData: (data: string) => void;
}

const ReadMapUserInput = ({ setLoadedData }: ReadMapUserInputProps) => {
  const inputFile = useRef<any>(null);
  let fileReader: any;

  const handleFileRead = () => setLoadedData(fileReader.result);

  const handleFileUpload = (data: any) => {
    fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(data);
  };

  const onButtonClick = () => {
    // `current` points to the mounted file input element
    inputFile?.current?.click();
  };

  return (
    <>
      <button onClick={onButtonClick}>Upload new map</button>
      <input
        type="file"
        id="file"
        ref={inputFile}
        style={{ display: "none" }}
        onChange={({ target }) =>
          target?.files && handleFileUpload(target.files[0])
        }
      />
    </>
  );
};

const MapView = ({ mapData }: { mapData: string }) => {
  const { metadata, map } = useMemo(() => decodeMap(mapData), [mapData]);
  const { startingPoint, destination, setPoints } = useSelectedPoints();

  return (
    <div>
      <div>
        {Object.entries(metadata).map(([k, v]) => (
          <div key={k}>
            <p>
              {k}: {v}
            </p>
          </div>
        ))}
        {startingPoint && (
          <p>
            Starting position: ({`${startingPoint[0]},${startingPoint[1]}`})
          </p>
        )}
        {destination && (
          <p>Destination: ({`${destination[0]},${destination[1]}`})</p>
        )}
      </div>
      <Stage width={1200} height={1200}>
        <Layer>
          {map.map((row, x) =>
            row.map((block, y) => (
              <Rect
                key={`${x}-${y}`}
                x={x * SIZE_MULTIPLIER}
                y={y * SIZE_MULTIPLIER}
                width={SIZE_MULTIPLIER}
                height={SIZE_MULTIPLIER}
                fill={block || "white"}
                onClick={() => block === Block.VOID && setPoints([x, y])}
              />
            ))
          )}

          {startingPoint && (
            <Circle
              x={startingPoint[0] * SIZE_MULTIPLIER}
              y={startingPoint[1] * SIZE_MULTIPLIER}
              radius={SIZE_MULTIPLIER}
              fill="green"
            />
          )}
          {destination && (
            <Circle
              x={destination[0] * SIZE_MULTIPLIER}
              y={destination[1] * SIZE_MULTIPLIER}
              radius={SIZE_MULTIPLIER}
              fill="green"
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};
const App = (): JSX.Element => {
  const [mapData, setLoadedData] = useState<string | null>(null);

  return (
    <>
      <ReadMapUserInput setLoadedData={setLoadedData} />
      {!mapData ? <p>Upload a map first</p> : <MapView mapData={mapData} />}
    </>
  );
};

export default App;
