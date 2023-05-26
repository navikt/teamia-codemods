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

const RadioGruppeFixture = () => {
  return (
    <div className="fixture">
      <Radio label={"Radio-label"} name="minRadioKnapp" />
      <Radio label={"Radio-label"} name="minRadioKnapp" disabled />
      <RadioGruppe legend="Hvor vil du sitte?" tag="div">
        <Radio label={"Bakerst"} name="sitteplass" onChange={func} />
        <Radio label={"Midten"} name="sitteplass" />
        <Radio label={"Fremst"} name="sitteplass" />
      </RadioGruppe>
      <RadioGruppe
        legend="Hvor vil du sitte?"
        feil="Feilmeldingstekst må gjenta nøkkelord fra label"
      >
        <Radio label={"Bakerst"} name="sitteplass" />
        <Radio label={"Midten"} name="sitteplass" />
        <Radio label={"Fremst"} name="sitteplass" />
      </RadioGruppe>
      <RadioGruppe
        legend="Hvor vil du sitte?"
        feil="Feilmeldingstekst må gjenta nøkkelord fra label"
        utenFeilPropagering
      >
        <Radio label={"Bakerst"} name="sitteplass" />
        <Radio label={"Midten"} name="sitteplass" feil />
        <Radio label={"Fremst"} name="sitteplass" />
      </RadioGruppe>
    </div>
  );
};
