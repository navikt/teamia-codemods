import { Radio, RadioGroup } from "@navikt/ds-react";

const RadioGruppeFixture = () => {
  return (
    <div className="fixture">
      {
        // TODO: i ds-react settes 'name' i RadioGroup i stedet for i Radio komponentene
        // TODO: ds-react krever en 'value' prop for Radio komponenter
      }
      <Radio value="" name="minRadioKnapp" />

      {
        // TODO: i ds-react settes 'name' i RadioGroup i stedet for i Radio komponentene
        // TODO: ds-react krever en 'value' prop for Radio komponenter
      }
      <Radio value="" name="minRadioKnapp" disabled />

      {
        // TODO: 'tag' er ikke støttet i RadioGroup
      }
      <RadioGroup legend="Hvor vil du sitte?" name="sitteplass">
        {
          // TODO: i ds-react settes 'name' i RadioGroup i stedet for i Radio komponentene
          // TODO: ds-react har lagt opp til at 'onChange' event handler blir satt i RadioGroup komponenten
          // TODO: ds-react krever en 'value' prop for Radio komponenter
        }
        <Radio value="" onChange={func} />

        {
          // TODO: i ds-react settes 'name' i RadioGroup i stedet for i Radio komponentene
          // TODO: ds-react krever en 'value' prop for Radio komponenter
        }
        <Radio value="" />

        {
          // TODO: i ds-react settes 'name' i RadioGroup i stedet for i Radio komponentene
          // TODO: ds-react krever en 'value' prop for Radio komponenter
        }
        <Radio value="" />
      </RadioGroup>
      <RadioGroup
        legend="Hvor vil du sitte?"
        error="Feilmeldingstekst må gjenta nøkkelord fra label"
        name="sitteplass"
      >
        {
          // TODO: i ds-react settes 'name' i RadioGroup i stedet for i Radio komponentene
          // TODO: ds-react krever en 'value' prop for Radio komponenter
        }
        <Radio value="" />

        {
          // TODO: i ds-react settes 'name' i RadioGroup i stedet for i Radio komponentene
          // TODO: ds-react krever en 'value' prop for Radio komponenter
        }
        <Radio value="" />

        {
          // TODO: i ds-react settes 'name' i RadioGroup i stedet for i Radio komponentene
          // TODO: ds-react krever en 'value' prop for Radio komponenter
        }
        <Radio value="" />
      </RadioGroup>

      {
        // TODO: 'utenFeilPropagering' er ikke støttet i RadioGroup
      }
      <RadioGroup
        legend="Hvor vil du sitte?"
        error="Feilmeldingstekst må gjenta nøkkelord fra label"
        name="sitteplass"
      >
        {
          // TODO: i ds-react settes 'name' i RadioGroup i stedet for i Radio komponentene
          // TODO: ds-react krever en 'value' prop for Radio komponenter
        }
        <Radio value="" />

        {
          // TODO: i ds-react settes 'name' i RadioGroup i stedet for i Radio komponentene
          // TODO: i ds-react blir feil/error håndtert i RadioGroup komponenten
          // TODO: ds-react krever en 'value' prop for Radio komponenter
        }
        <Radio value="" />

        {
          // TODO: i ds-react settes 'name' i RadioGroup i stedet for i Radio komponentene
          // TODO: ds-react krever en 'value' prop for Radio komponenter
        }
        <Radio value="" />
      </RadioGroup>
    </div>
  );
};
