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

const SkjemaGruppeFixture = () => {
  return (
    <div className="fixture">
      <SkjemaGruppe>
        <Input label="Fornavn" />
        <Input label="Etternavn" />
      </SkjemaGruppe>
      <SkjemaGruppe legend="Kontaktperson">
        <Input label="Fornavn" />
        <Input label="Etternavn" />
      </SkjemaGruppe>
      <SkjemaGruppe legend={<Undertittel>Kontaktperson</Undertittel>}>
        <Input label="Fornavn" />
        <Input label="Etternavn" />
      </SkjemaGruppe>
      <SkjemaGruppe
        legend="Kontaktperson"
        description="Personen som noen kan kontakte"
      >
        <Input label="Fornavn" />
        <Input label="Etternavn" />
      </SkjemaGruppe>
      <SkjemaGruppe feil="Her er det noe feil">
        <Input label="Fornavn" />
        <Input label="Etternavn" />
        <TextareaControlled label="Textarea-label" />
      </SkjemaGruppe>
      <SkjemaGruppe feil="Her er det noe feil" utenFeilPropagering>
        <Input label="Fornavn" />
        <Input label="Etternavn" feil="Feilen er her!" />
        <Input label="Adresse" />
      </SkjemaGruppe>
      <SkjemaGruppe tag="div">
        <Input label="Fornavn" />
        <Input label="Etternavn" />
      </SkjemaGruppe>
    </div>
  );
};
