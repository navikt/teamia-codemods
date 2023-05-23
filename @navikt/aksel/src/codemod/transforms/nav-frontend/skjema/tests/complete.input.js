import {
  FnrInput,
  FnrInputProps,
  Input,
  InputProps,
  Textarea,
  TextareaProps,
  TextareaControlled,
  TextareaControlledProps,
  Checkbox,
  CheckboxProps,
  CheckboxGruppe,
  Radio,
  RadioProps,
  RadioGruppe,
  Select,
  SelectProps,
  SkjemaGruppe,
  SkjemaGruppeProps,
  SkjemaGruppeFeilContext,
  SkjemaGruppeFeilContextProps,
  ToggleGruppe,
  ToggleGruppeProps,
  ToggleKnapp,
  ToggleKnappProps,
  RadioPanelGruppe,
  RadioPanelGruppeProps,
  RadioPanel,
  RadioPanelProps,
  CheckboksPanelGruppe,
  CheckboksPanelGruppeProps,
  CheckboksPanel,
  CheckboksPanelProps,
  BekreftCheckboksPanel,
  BekreftCheckboksPanelProps,
  Feiloppsummering,
  FeiloppsummeringProps,
  FeiloppsummeringFeil,
  Label,
  SkjemaelementFeilmelding,
} from "nav-frontend-skjema";

const SkjemaFixture = () => {
  return (
    <div className="fixture">
      <Feiloppsummering
        tittel="For å gå videre må du rette opp følgende:"
        feil={[
          { skjemaelementId: "1", feilmelding: "Du må oppgi et navn" },
          { skjemaelementId: "2", feilmelding: "Du må oppgi en adresse" },
          { skjemaelementId: "3", feilmelding: "Du må oppgi et telefonnummer" },
        ]}
      />
      <CheckboksPanelGruppe
        legend={"Velg en eller flere:"}
        checkboxes={[
          { label: "Eplejuice", value: "juice1", id: "juice1id" },
          { label: "Appelsinjuice", value: "juice2", id: "juice2id" },
          { label: "Melk", value: "melk", disabled: true, id: "melkid" },
          {
            label: "Ananasjuice",
            value: "juice3",
            id: "juice4id",
            subtext: "Subtext example",
          },
        ]}
        onChange={() => {}}
      />
      <CheckboksPanel
        key={`${checkbox.id}${checkbox.label}`}
        onChange={(event: React.SyntheticEvent<EventTarget>) =>
          onChange(event, checkbox.value)
        }
        {...checkbox}
      />
      <CheckboxGruppe legend="Hvor vil du sitte?">
        <Checkbox label={"Bakerst"} />
        <Checkbox label={"Midten"} />
        <Checkbox label={"Fremst"} />
      </CheckboxGruppe>
      ;
      <FnrInput
        label="Fødselsnummer (11 siffer)"
        bredde="S"
        value={value}
        onChange={(e) => handleChange(e)}
        onValidate={(val) => setValid(val)}
        feil={submit && !valid ? "Ugyldig fødselsnummer" : undefined}
      />
      <div style={{ display: "flex", alignItems: "center" }}>
        <Label htmlFor="min-input-2" style={{ margin: 0, marginRight: "1rem" }}>
          Mitt skjemafelt:
        </Label>
        <div style={{ flexGrow: 1 }}>
          <Input id="min-input-2" />
        </div>
      </div>
    </div>
  );
};
