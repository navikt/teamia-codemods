import { check } from "../../../../utils/check";

const migration = "popover";
const fixtures = ["complete"];

for (const fixture of fixtures) {
  check(__dirname, {
    fixture,
    migration,
    extension: "js",
    options: {},
  });
}
