import fs from "node:fs/promises";
import { csfHeaderToBuffer } from "./csfHeader";
import { csfLabelToBuffer } from "./csfLabel";
import { csfStringToBuffer } from "./csfString";

export async function strTocsf(filePath: string) {

  if (!filePath.endsWith(".str")) {
    throw new Error("File format must be a .str");
  }

  try {
    await fs.access(filePath);
    const strData = await fs.readFile(filePath, { encoding: 'utf-8' });
    const splitData = strData.split(/^END/gmi);
    const filterData = splitData.filter(el => el.trim() !== "");
    const data = filterData.map(el => el.trim());

    const newStrData = [];

    for (const elem of data) {
      const header = elem.split("\n");
      const label = header[0];
      let string = "";

      for (let i = 1; i < header.length; i++) {
        string += header[i]
      }
      string = string.replace(/^"|"$/g, "");

      newStrData.push({ label: label, string: string })
    }

    const buffer = [];
    buffer[0] = csfHeaderToBuffer(newStrData.length, 10);

    for (const elem of newStrData) {
      const labelBuffer = csfLabelToBuffer(elem.label)
      const stringBuffer = csfStringToBuffer(elem.string)
      const tmpBuffer = Buffer.concat([labelBuffer, stringBuffer]);
      buffer.push(tmpBuffer)
    }

    const dataBuffer = Buffer.concat(buffer)

    const changedFilePath = filePath.replace(/\.str$/g, ".csf");
    fs.writeFile(changedFilePath, dataBuffer);

    console.log("File is converted from str to csf");
  } catch (error) {
    console.log(error);
  }
}