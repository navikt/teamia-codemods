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

const SelectFixture = () => {
  return (
    <div className="fixture">
      <Select
        label="Hvilken land er best om sommeren?"
        selected={"Ikke støttet"}
      >
        <option value="">Velg land</option>
        <option value="norge">Norge</option>
        <option value="sverige">Sverige</option>
        <option value="danmark">Danmark</option>
      </Select>
      <Select label="Hvilken land er best om sommeren?" disabled>
        <option value="">Velg land</option>
        <option value="norge">Norge</option>
        <option value="sverige">Sverige</option>
        <option value="danmark">Danmark</option>
      </Select>
      <Select
        label="Hvilken land er best om sommeren?"
        feil="Her er det noe feil"
      >
        <option value="">Velg land</option>
        <option value="norge">Norge</option>
        <option value="sverige">Sverige</option>
        <option value="danmark">Danmark</option>
      </Select>
      <Select
        label="Hvilken land er best om sommeren?"
        description="En kort beskrivelse av listen"
      >
        <option value="">Velg land</option>
        <option value="norge">Norge</option>
        <option value="sverige">Sverige</option>
        <option value="danmark">Danmark</option>
      </Select>
      <Select label="Hvilken land er best om sommeren?" bredde="fullbredde">
        <option value="">Velg land</option>
        <option value="norge">Norge</option>
        <option value="sverige">Sverige</option>
        <option value="danmark">Danmark</option>
      </Select>
      <Select label="Hvilken land er best om sommeren?" bredde="XXL">
        <option value="">Velg land</option>
        <option value="norge">Norge</option>
        <option value="sverige">Sverige</option>
        <option value="danmark">Danmark</option>
      </Select>
      <Select label="Hvilken land er best om sommeren?" bredde="XL">
        <option value="">Velg land</option>
        <option value="norge">Norge</option>
        <option value="sverige">Sverige</option>
        <option value="danmark">Danmark</option>
      </Select>
      <Select label="Hvilken land er best om sommeren?" bredde="L">
        <option value="">Velg land</option>
        <option value="norge">Norge</option>
        <option value="sverige">Sverige</option>
        <option value="danmark">Danmark</option>
      </Select>
      <Select label="Hvilken land er best om sommeren?" bredde="M">
        <option value="">Velg land</option>
        <option value="norge">Norge</option>
        <option value="sverige">Sverige</option>
        <option value="danmark">Danmark</option>
      </Select>
      <Select label="Hvilken land er best om sommeren?" bredde="S">
        <option value="">Velg land</option>
        <option value="norge">Norge</option>
        <option value="sverige">Sverige</option>
        <option value="danmark">Danmark</option>
      </Select>
      <Select label="Hvilken land er best om sommeren?" bredde="XS">
        <option value="">Velg land</option>
        <option value="norge">Norge</option>
        <option value="sverige">Sverige</option>
        <option value="danmark">Danmark</option>
      </Select>
      <Select label="Hvilken land er best om sommeren?" bredde="XXS">
        <option value="">Velg land</option>
        <option value="norge">Norge</option>
        <option value="sverige">Sverige</option>
        <option value="danmark">Danmark</option>
      </Select>
    </div>
  );
};
