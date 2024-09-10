
import fs from "node:fs/promises";

const offset = 32;
export async function csfTostr(filePath: string) {
  if (!filePath.endsWith(".csf")) {
    throw new Error("File format must be a .csf")
  }

  try {
    await fs.access(filePath);
    const csfBuffer = await fs.readFile(filePath);
    const newBuffer = new Uint8Array(csfBuffer.byteLength - offset);

    for (let i = 0; i < newBuffer.length; i++) {
      newBuffer[i] = csfBuffer[offset + i]
    }

    const Labels: string[] = [];
    const Strings: string[] = [];
    const dataview = new DataView(newBuffer.buffer);
    let section = "LABEL_SIZE"
    let skipByte = 4;
    let bytesLen = 4;
    let stringSize = 0;

    for (let i = 0; i < newBuffer.length; i += skipByte) {

      if (section === "LABEL_SIZE") {
        bytesLen = dataview.getUint16(i, true);
        section = "LABEL_NAME"
        skipByte = 4
        continue;
      }

      if (section === "LABEL_NAME") {
        let labelStr = "";
        for (let j = 0; j < bytesLen; j++) {
          labelStr += String.fromCodePoint(Math.abs(dataview.getInt8(i + j)));
        }
        Labels.push(labelStr)
        skipByte = bytesLen
        section = "RTC"
        continue;
      }

      if (section === "RTC") {
        skipByte = 4
        section = "STRING_LENGTH"
        continue;
      }

      if (section === "STRING_LENGTH") {
        stringSize = dataview.getUint16(i, true) * 2;
        section = "STRING_VALUE"
        skipByte = 4
        continue;
      }

      if (section === "STRING_VALUE") {
        let str = ""
        for (let j = 0; j < stringSize; j += 2) {
          str += String.fromCodePoint(Math.abs(dataview.getInt16(i + j, true)) - 1)
        }

        Strings.push(str)
        section = "LABEL_SIZE"
        skipByte = stringSize + 8;
        continue;
      }
    }

    const strData = Labels.map((label, index) => {
      return `${label}\n\"${Strings[index]}\"\nEND\n\n`
    }).join("");

    const changedFilePath = filePath.replace(/\.csf$/g, ".str");
    await fs.writeFile(changedFilePath, strData);

  } catch (error) {
    console.log(error);
  }
}