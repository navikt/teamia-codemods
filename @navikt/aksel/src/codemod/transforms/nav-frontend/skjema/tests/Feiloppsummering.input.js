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

const FeiloppsummeringFixture = () => {
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
      <Feiloppsummering
        tittel="For å gå videre må du rette opp følgende:"
        feil={errors}
        customFeilRender={customRender}
        innerRef={refToElement}
      />
    </div>
  );
};
