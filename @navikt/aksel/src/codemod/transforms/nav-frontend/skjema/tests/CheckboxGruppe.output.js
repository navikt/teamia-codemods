import { Checkbox, CheckboxGroup } from "@navikt/ds-react";

const CheckboxGruppeFixture = () => {
  return (
    <div className="fixture">
      <CheckboxGroup legend="Hvor vil du sitte?">
        {
          // ds-react legger opp til at man bruker onChange på CheckboxGroup komponenten i stedet for individuelle Checkbox komponenter
        }

        <Checkbox />
        <Checkbox />
        <Checkbox />
      </CheckboxGroup>
      <CheckboxGroup
        legend="Hvor vil du sitte?"
        error="Feilmeldingstekst må gjenta nøkkelord fra label"
      >
        {
          // ds-react legger opp til at man bruker onChange på CheckboxGroup komponenten i stedet for individuelle Checkbox komponenter
        }

        <Checkbox />
        <Checkbox />
        <Checkbox />
      </CheckboxGroup>
      <CheckboxGroup
        legend="Hvor vil du sitte?"
        error="Feilmeldingstekst må gjenta nøkkelord fra label"
      >
        {
          // ds-react legger opp til at man bruker onChange på CheckboxGroup komponenten i stedet for individuelle Checkbox komponenter
          // TODO: ds-react støtter ikke utenFeilPropagering for CheckboxGroup
        }

        <Checkbox />
        <Checkbox error />
        <Checkbox />
      </CheckboxGroup>
    </div>
  );
};
