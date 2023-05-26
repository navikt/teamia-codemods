import { SkjemaGruppe } from "nav-frontend-skjema";

import { TextField, Textarea } from "@navikt/ds-react";

const SkjemaGruppeFixture = () => {
  return (
    <div className="fixture">
      {
        // TODO: Denne komponenten har ingen mapping mot ds-react og kan dermed ikke migreres programatisk
      }
      <SkjemaGruppe>
        <TextField label="Fornavn" />
        <TextField label="Etternavn" />
      </SkjemaGruppe>

      {
        // TODO: Denne komponenten har ingen mapping mot ds-react og kan dermed ikke migreres programatisk
      }
      <SkjemaGruppe legend="Kontaktperson">
        <TextField label="Fornavn" />
        <TextField label="Etternavn" />
      </SkjemaGruppe>

      {
        // TODO: Denne komponenten har ingen mapping mot ds-react og kan dermed ikke migreres programatisk
      }
      <SkjemaGruppe legend={<Undertittel>Kontaktperson</Undertittel>}>
        <TextField label="Fornavn" />
        <TextField label="Etternavn" />
      </SkjemaGruppe>

      {
        // TODO: Denne komponenten har ingen mapping mot ds-react og kan dermed ikke migreres programatisk
      }
      <SkjemaGruppe
        legend="Kontaktperson"
        description="Personen som noen kan kontakte"
      >
        <TextField label="Fornavn" />
        <TextField label="Etternavn" />
      </SkjemaGruppe>

      {
        // TODO: Denne komponenten har ingen mapping mot ds-react og kan dermed ikke migreres programatisk
      }
      <SkjemaGruppe feil="Her er det noe feil">
        <TextField label="Fornavn" />
        <TextField label="Etternavn" />
        <Textarea label="Textarea-label" />
      </SkjemaGruppe>

      {
        // TODO: Denne komponenten har ingen mapping mot ds-react og kan dermed ikke migreres programatisk
      }
      <SkjemaGruppe feil="Her er det noe feil" utenFeilPropagering>
        <TextField label="Fornavn" />
        <TextField label="Etternavn" error="Feilen er her!" />
        <TextField label="Adresse" />
      </SkjemaGruppe>

      {
        // TODO: Denne komponenten har ingen mapping mot ds-react og kan dermed ikke migreres programatisk
      }
      <SkjemaGruppe tag="div">
        <TextField label="Fornavn" />
        <TextField label="Etternavn" />
      </SkjemaGruppe>
    </div>
  );
};
