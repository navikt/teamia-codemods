import { TextField, Label } from "@navikt/ds-react";

const InputFixture = () => {
  return (
    <div className="fixture">
      <TextField label="Inputfelt-label" />
      <Label htmlFor="min-input">Mitt skjemafelt:</Label>
      <TextField id="min-input" />
      <TextField
        aria-label="Mitt skjemafelt:"
        placeholder="Her kan det skrives"
      />
      <TextField
        aria-labelledby="id-til-html-element-med-label-tekst"
        placeholder="Her kan det skrives"
      />
      <TextField
        label="Inputfelt-nummer"
        inputMode="numeric"
        pattern="[0-9]*"
      />
      <TextField
        label={
          <div style={{ display: "flex" }}>
            Inputfelt-label
            <Hjelpetekst style={{ marginLeft: "0.5rem" }}>
              Innholdet vil vises når brukeren klikker på knappen.
            </Hjelpetekst>
          </div>
        }
      />
      <TextField label="Inputfelt-label" disabled />
      <TextField
        label="Inputfelt-label"
        description="En kort beskrivelse av feltet"
      />
      <TextField label="Inputfelt-label" error="Her er det noe feil" />
      <TextField label="Inputfelt-label" error />
      <TextField
        label="Fullbredde inputfelt:"
        style={{
          width: "100%",
        }}
      />
      <TextField
        label="XXL inputfelt"
        style={{
          width: "420px",
        }}
      />
      <TextField
        label="XL inputfelt"
        style={{
          width: "350px",
        }}
      />
      <TextField
        label="L inputfelt"
        style={{
          width: "280px",
        }}
      />
      <TextField
        label="M inputfelt"
        style={{
          width: "210px",
        }}
      />
      <TextField
        label="S inputfelt"
        style={{
          width: "140px",
        }}
      />
      <TextField
        label="XS inputfelt"
        style={{
          width: "70px",
        }}
      />
      <TextField
        label="XXS inputfelt"
        style={{
          width: "35px",
        }}
      />
      <TextField size="small" />
    </div>
  );
};
