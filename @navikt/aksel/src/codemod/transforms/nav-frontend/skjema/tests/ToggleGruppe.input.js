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

const ToggleGruppeFixture = () => {
  return (
    <div className="fixture">
      <ToggleGruppe
        defaultToggles={[
          { children: "Mandag", pressed: true },
          { children: "Tirsdag" },
          { children: "Onsdag" },
        ]}
      />
      <ToggleGruppe
        defaultToggles={[
          { children: "Mandag", pressed: true },
          { children: "Tirsdag" },
          { children: "Onsdag" },
        ]}
        multiSelect
      />
      <ToggleGruppe
        defaultToggles={[
          { children: "Mandag" },
          { children: "Tirsdag" },
          { children: "Onsdag" },
        ]}
        minstEn
      />
      <ToggleGruppe
        defaultToggles={[
          { children: "B", pressed: true },
          { children: <em style={{ paddingLeft: 2, paddingRight: 2 }}>I</em> },
          { children: <span style={{ textDecoration: "underline" }}>U</span> },
        ]}
        multiSelect
        kompakt
      />
    </div>
  );
};
