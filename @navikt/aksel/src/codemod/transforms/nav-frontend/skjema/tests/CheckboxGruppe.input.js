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

const CheckboxGruppeFixture = () => {
  return (
    <div className="fixture">
      <CheckboxGruppe legend="Hvor vil du sitte?">
        <Checkbox label={"Bakerst"} disabled />
        <Checkbox label={"Midten"} />
        <Checkbox label={"Fremst"} />
      </CheckboxGruppe>
      <CheckboxGruppe
        legend="Hvor vil du sitte?"
        feil="Feilmeldingstekst må gjenta nøkkelord fra label"
      >
        <Checkbox label={"Bakerst"} />
        <Checkbox label={"Midten"} />
        <Checkbox label={"Fremst"} />
      </CheckboxGruppe>
      <CheckboxGruppe
        legend="Hvor vil du sitte?"
        feil="Feilmeldingstekst må gjenta nøkkelord fra label"
        utenFeilPropagering
      >
        <Checkbox label={"Bakerst"} />
        <Checkbox label={"Midten"} feil />
        <Checkbox label={"Fremst"} />
      </CheckboxGruppe>
    </div>
  );
};
