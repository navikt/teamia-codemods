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

const BekreftCheckboksPanelFixture = () => {
  return (
    <div className="fixture">
      <BekreftCheckboksPanel
        label="Ja, jeg samtykker"
        checked={isChecked}
        onChange={(e) => setIsChecked(e.target.checked)}
      >
        For å komme videre må du gi oss lov til å hente inn og bruke
        opplysninger om deg.{" "}
        <Lenke href="#">
          Les om hvilke opplysninger vi henter og hvordan vi bruker dem.
        </Lenke>
      </BekreftCheckboksPanel>
      <BekreftCheckboksPanel
        label="Jeg bekrefter at opplysningene jeg har gitt, er riktige og fullstendige"
        checked={isChecked}
        onChange={(e) => setIsChecked(e.target.checked)}
        feil="Du må bekrefte dette før du kan sende inn søknaden."
      >
        Jeg vet at jeg kan miste retten til sykepenger hvis opplysningene jeg
        gir, ikke er riktige eller fullstendige.
      </BekreftCheckboksPanel>
    </div>
  );
};
