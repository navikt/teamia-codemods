import { check } from "../../../../utils/check";

const migration = "toggle";
const fixtures = ["complete"];

for (const fixture of fixtures) {
  check(__dirname, {
    fixture,
    migration,
    extension: "js",
    options: {},
  });
}
