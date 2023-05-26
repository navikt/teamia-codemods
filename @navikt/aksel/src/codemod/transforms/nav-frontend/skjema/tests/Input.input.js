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

const InputFixture = () => {
  return (
    <div className="fixture">
      <Input label="Inputfelt-label" />
      <Label htmlFor="min-input">Mitt skjemafelt:</Label>
      <Input id="min-input" />
      <Input aria-label="Mitt skjemafelt:" placeholder="Her kan det skrives" />
      <Input
        aria-labelledby="id-til-html-element-med-label-tekst"
        placeholder="Her kan det skrives"
      />
      <Input label="Inputfelt-nummer" inputMode="numeric" pattern="[0-9]*" />
      <Input
        label={
          <div style={{ display: "flex" }}>
            Inputfelt-label
            <Hjelpetekst style={{ marginLeft: "0.5rem" }}>
              Innholdet vil vises når brukeren klikker på knappen.
            </Hjelpetekst>
          </div>
        }
      />
      <Input label="Inputfelt-label" disabled />
      <Input
        label="Inputfelt-label"
        description="En kort beskrivelse av feltet"
      />
      <Input label="Inputfelt-label" feil="Her er det noe feil" />
      <Input label="Inputfelt-label" feil />
      <Input label="Fullbredde inputfelt:" bredde="fullbredde" />
      <Input label="XXL inputfelt" bredde="XXL" />
      <Input label="XL inputfelt" bredde="XL" />
      <Input label="L inputfelt" bredde="L" />
      <Input label="M inputfelt" bredde="M" />
      <Input label="S inputfelt" bredde="S" />
      <Input label="XS inputfelt" bredde="XS" />
      <Input label="XXS inputfelt" bredde="XXS" />
      <Input mini />
    </div>
  );
};
