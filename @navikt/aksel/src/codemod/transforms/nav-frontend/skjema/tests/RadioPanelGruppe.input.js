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

const RadioPanelGruppeFixture = () => {
  return (
    <div className="fixture">
      <RadioPanelGruppe
        name="samplename"
        legend="Hvilken drikke er best?"
        radios={[
          { label: "Eplejuice", value: "juice1", id: "juice1id" },
          { label: "Appelsinjuice", value: "juice2", id: "juice2id" },
          { label: "Melk", value: "melk", disabled: true, id: "melkid" },
          { label: "Ananasjuice", value: "juice3", id: "juice4id" },
        ]}
        checked={this.state.checked}
        onChange={this.onChange}
      />
      <RadioPanelGruppe
        name="samplename"
        legend="Hvilken drikke er best?"
        radios={[
          { label: "Eplejuice", value: "juice1", id: "juice1id" },
          { label: "Appelsinjuice", value: "juice2", id: "juice2id" },
          { label: "Melk", value: "melk", disabled: true, id: "melkid" },
          { label: "Ananasjuice", value: "juice3", id: "juice4id" },
        ]}
        checked={this.state.checked}
        onChange={this.onChange}
        feil={{ feilmelding: "Her er det en feil." }}
      />
      <RadioPanelGruppe
        name="samplename"
        legend="Hvilken drikke er best?"
        radios={[
          { label: "Eplejuice", value: "juice1", id: "juice1id" },
          { label: "Appelsinjuice", value: "juice2", id: "juice2id", feil },
          { label: "Melk", value: "melk", disabled: true, id: "melkid" },
          { label: "Ananasjuice", value: "juice3", id: "juice4id" },
        ]}
        checked={this.state.checked}
        onChange={this.onChange}
        feil={{
          feilmelding: "Feilmeldingstekst må gjenta nøkkelord fra label",
        }}
        utenFeilPropagering
      />
      <RadioPanelGruppe
        name="samplename"
        legend="Hvilken drikke er best?"
        radios={[
          {
            label: "Eplejuice",
            value: "juice1",
            id: "juice1id",
            radioRef: (ref) => (juice1Ref.current = ref),
          },
          { label: "Appelsinjuice", value: "juice2", id: "juice2id" },
          { label: "Melk", value: "melk", disabled: true, id: "melkid" },
          { label: "Ananasjuice", value: "juice3", id: "juice4id" },
        ]}
        checked={this.state.checked}
        onChange={this.onChange}
        feil={{ feilmelding: "Her er det en feil." }}
      />
    </div>
  );
};
