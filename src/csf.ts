import fsPromises from "node:fs/promises";
import { CsfHeader } from "./csfHeader";
import { CsfLabel } from "./csfLabel";
import { CsfString } from "./csfString";

type CsfStructType = {
  label: string,
  string: string
}

export class Csf {
  static #language: number = 0;
  constructor() {
  }

  static get language() {
    return this.#language
  }

  static set language(lang: number) {
    this.#language = lang;
  }

  static #parseCsf(csfBuffer: Buffer) {
    const dataview = new DataView(csfBuffer.buffer);
    let offset = 4;
    const strData = [];

    for (let i = 32; i < csfBuffer.length; i += offset) {
      offset = 4;
      let labelLen = dataview.getUint32(i, true);
      let label = "";
      let string = "";
      offset = 4;
      for (let j = 0; j < labelLen; j++) {
        label += String.fromCodePoint(dataview.getInt8(i + offset + j));
      }
      offset += labelLen + 4;
      let stringLen = dataview.getUint32(i + offset, true) * 2;
      offset += 4;
      for (let j = 0; j < stringLen; j += 2) {
        string += String.fromCodePoint(~dataview.getInt16(i + offset + j, true))
      }
      strData.push({
        label: label,
        string: string
      })
      offset += stringLen + 8;
    }
    return strData;
  }

  static sortByLabel(data: CsfStructType[], type: "up" | "down") {
    if (data == null) return;
    switch (type) {
      case "up":
        return data.sort((a, b) => {
          const labelA = a.label.toUpperCase();
          const labelB = b.label.toUpperCase();
          if (labelA > labelB) return 1
          if (labelA < labelB) return -1
          return 0
        });
      case "down":
        return data.sort((a, b) => {
          const labelA = a.label.toUpperCase();
          const labelB = b.label.toUpperCase();
          if (labelA < labelB) return 1
          if (labelA > labelB) return -1
          return 0
        });
    }
  }

  static async readFile(filePath: string) {
    if (!filePath.endsWith(".csf")) {
      throw new Error("File format must be a .csf")
    }

    try {
      await fsPromises.access(filePath);
      const csfBuffer = await fsPromises.readFile(filePath);
      const data = this.#parseCsf(csfBuffer);
      return data
    } catch (error) {
      console.log(error);
    }
  }

  static async saveAsStr(filePath: string, data: CsfStructType[]) {

    if (!filePath.endsWith(".str")) {
      throw new Error("File format must be a .str")
    }

    try {

      const strData = data.map(({ label, string }) => {
        return `${label}\n\"${string}\"\nEND\n\n`;
      }).join("");

      await fsPromises.writeFile(filePath, strData);
    } catch (error) {
      console.log(error);
    }
  }

  static async saveAsJson(filePath: string, data: CsfStructType[]) {
    if (!filePath.endsWith(".json")) {
      throw new Error("File format must be a .json")
    }

    try {
      const obj: { [lbl: string]: { [rpl: string]: string } } = {};
      for (const { label, string } of data) {
        const lb = label.match(/^\w+/g)?.[0];
        const rpl = label.replace(/^\w+:/g, "");
        if (lb && rpl) {
          obj[lb] = obj[lb] ?? {}
          obj[lb][rpl] = string
        }
      }

      await fsPromises.writeFile(filePath, JSON.stringify(obj, null, 2));
    } catch (error) {
      console.log(error);
    }
  }

  static async readfromStr(filePath: string) {
    if (!filePath.endsWith(".str")) {
      throw new Error("File format must be a .str");
    }

    try {
      await fsPromises.access(filePath);
      const strData = await fsPromises.readFile(filePath, { encoding: 'utf-8' });
      const labels = strData.replace(/^"([\s\S])*?"$/gm, "").match(/^\w+:.+/gm);
      const strings = strData.match(/^"([\s\S])*?"$/gm)?.map((el: string) => el.replace(/^"|"$/g, ""));
      console.log("strings -> ", strings?.length);
      console.log("labels -> ", labels?.length);

      if (!labels || !strings || (labels.length !== strings.length)) {
        throw new Error("");
      }

      const buffer = [];
      buffer[0] = new CsfHeader({ labelsCount: labels.length }).buffer;

      for (let i = 0; i < labels.length; i++) {
        const labelBuffer = new CsfLabel(labels[i]).buffer;
        const stringBuffer = new CsfString(strings[i]).buffer
        const tmpBuffer = Buffer.concat([labelBuffer, stringBuffer]);
        buffer.push(tmpBuffer)
      }
      const csfBuffer = Buffer.concat(buffer);
      return csfBuffer
    } catch (error) {
      console.log(error);
    }
  }

  static async readfromJson(filePath: string) {
    if (!filePath.endsWith(".json")) {
      throw new Error("File format must be a .json");
    }

    try {
      await fsPromises.access(filePath);
      const data = await fsPromises.readFile(filePath, { encoding: 'utf-8' });
      const jsonData: {
        [tag: string]: {
          [label: string]: string
        }
      } = JSON.parse(data);

      const newData: { label: string, string: string }[] = [];

      for (const key of Object.keys(jsonData)) {
        for (const elem of Object.entries(jsonData[key])) {
          const label = `${key}:${elem[0]}`;
          const string = elem[1]
          newData.push({
            label: label,
            string: string
          })
        }
      }

      const buffer = [];
      buffer[0] = new CsfHeader({ labelsCount: newData.length, language: this.#language }).buffer
      for (const { label, string } of newData) {
        const labelBuffer = new CsfLabel(label).buffer
        const stringBuffer = new CsfString(string).buffer
        const tmpBuffer = Buffer.concat([labelBuffer, stringBuffer]);
        buffer.push(tmpBuffer)
      }
      const csfBuffer = Buffer.concat(buffer);
      return csfBuffer;
    } catch (error) {
      console.log(error);
    }
  }

  static async writeFile(filePath: string, data: Buffer) {
    if (!filePath.endsWith(".csf")) {
      throw new Error("File format must be a .csf")
    }

    try {
      await fsPromises.writeFile(filePath, data);
      console.log("Csf file is successfully created");
    } catch (error) {
      console.log(error);
    }
  }
}