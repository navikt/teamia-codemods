import { check } from "../../../../utils/check";

const migration = "skjema";
const fixtures = [
  "complete",
  "BekreftCheckboksPanel",
  "CheckboksPanelGruppe",
  "CheckboxGruppe",
  "Feiloppsummering",
  "FnrInput",
  "Input",
  "RadioGruppe",
  "RadioPanelGruppe",
  "Select",
  "SkjemaGruppe",
  "Textarea",
  "ToggleGruppe",
];

for (const fixture of fixtures) {
  check(__dirname, {
    fixture,
    migration,
    extension: "js",
    options: {},
  });
}
