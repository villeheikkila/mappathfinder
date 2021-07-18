import path from "path";
import fs from "fs";

interface FileMetadata {
  city: string;
  version: number;
  size: number;
  path: string;
}

const directoryPath = path.join(__dirname, "/../maps");

const decodeFileName = (file: string): FileMetadata => {
  const split = file.split("_");
  const size = split[2].split(".");

  return {
    city: split[0],
    version: parseInt(split[1]),
    size: parseInt(size[0]),
    path: file,
  };
};

export const createFileListing = async (): Promise<FileMetadata[]> =>
  new Promise((resolve, reject) =>
    fs.readdir(directoryPath, (err, files) => {

      if (err) {
        reject();
      }

      const fileList: string[] = [];
      files.forEach((file) => fileList.push(file));
      const formattedFiles = fileList.map(decodeFileName);
      resolve(formattedFiles);
    })
  );

export const readMap = async (map: string): Promise<string> =>
  new Promise((resolve, reject) =>
    fs.readFile(`${directoryPath}/${map}`, "utf8", (err, data) => {
      if (err) reject(err);
      resolve(data);
    })
  );
