# Bfme-csf-str

Use this library for convert The Battle For Middle-Earth language file

* .csf -> .str
* .csf -> .json
* .str -> .csf
* .json -> .csf

```bash
npm install bfme-csf-str
```

## Examples

Convert from .str to .csf 
```javascript
import { Csf } from "bfme-csf-str"; // or const { Csf } = require("bfme-csf-str")

async function strToCsf() {
   const bufferData = await Csf.readFromStr("lotr.str");
   await Csf.writeFile("lotr.csf", bufferData);
}

strToCsf();
```

Convert from .json to .csf 
```javascript
import { Csf } from "bfme-csf-str"; // or const { Csf } = require("bfme-csf-str")

async function jsonToCsf() {
   const bufferData = await Csf.readFromJson("lotr.json");
   await Csf.writeFile("lotr.csf", bufferData);
}

jsonToCsf();
```

Convert from .csf to .str
```javascript
import { Csf } from "bfme-csf-str"; // or const { Csf } = require("bfme-csf-str")

async function csfToStr() {
   const strData = await Csf.readFile("lotr.csf");
   await Csf.saveAsStr("lotr.str", strData);
}

csfToStr();
```
Convert from .csf to .json
```javascript
import { Csf } from "bfme-csf-str"; // or const { Csf } = require("bfme-csf-str")

async function csfToJson() {
   const jsonData = await Csf.readFile("lotr.csf");
   await Csf.saveAsJson("lotr.json", jsonData);
}

csfToJson();
```
