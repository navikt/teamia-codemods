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

const TextareaFixture = () => {
  return (
    <div className="fixture">
      <TextareaControlled label="Textarea-label" />
      <TextareaControlled label="Textarea-label" maxLength={0} />
      <TextareaControlled label="Textarea-label" disabled />
      <TextareaControlled label="Textarea-label" feil="Her er det noe feil." />
      <TextareaControlled
        label="Textarea-label"
        description="Beskriv kort din situasjon"
      />
      <Textarea
        value={this.state.value}
        onChange={(e) => this.setState({ value: e.target.value })}
      />
    </div>
  );
};
