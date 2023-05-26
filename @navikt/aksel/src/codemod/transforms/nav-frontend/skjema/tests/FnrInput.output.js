import { FnrInput } from "nav-frontend-skjema";

const FnrInputFixture = () => {
  return (
    <div className="fixture">
      {
        // TODO: Denne komponenten har ingen mapping mot ds-react og kan dermed ikke migreres programatisk
      }
      <FnrInput
        label="Fødselsnummer (11 siffer)"
        bredde="S"
        value={value}
        onChange={(e) => handleChange(e)}
        onValidate={(val) => setValid(val)}
        feil={submit && !valid ? "Ugyldig fødselsnummer" : undefined}
      />
    </div>
  );
};
