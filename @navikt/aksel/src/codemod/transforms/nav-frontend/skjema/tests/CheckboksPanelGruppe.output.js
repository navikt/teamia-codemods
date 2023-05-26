import { CheckboksPanelGruppe } from "nav-frontend-skjema";

const CheckboksPanelGruppeFixture = () => {
  return (
    <div className="fixture">
      {
        // TODO: Denne komponenten har ingen mapping mot ds-react og kan dermed ikke migreres programatisk
      }
      <CheckboksPanelGruppe
        legend={"Velg en eller flere:"}
        checkboxes={[
          { label: "Eplejuice", value: "juice1", id: "juice1id" },
          { label: "Appelsinjuice", value: "juice2", id: "juice2id" },
          { label: "Melk", value: "melk", disabled: true, id: "melkid" },
          {
            label: "Ananasjuice",
            value: "juice3",
            id: "juice4id",
            subtext: "Subtext example",
          },
        ]}
        onChange={() => {}}
      />

      {
        // TODO: Denne komponenten har ingen mapping mot ds-react og kan dermed ikke migreres programatisk
      }
      <CheckboksPanelGruppe
        legend={"Velg en eller flere:"}
        checkboxes={[
          { label: "Eplejuice", value: "juice1", id: "juice1id" },
          { label: "Appelsinjuice", value: "juice2", id: "juice2id" },
          { label: "Melk", value: "melk", disabled: true, id: "melkid" },
          {
            label: "Ananasjuice",
            value: "juice3",
            id: "juice4id",
            subtext: "Subtext example",
          },
        ]}
        onChange={() => {}}
        feil="Feilmeldingstekst må gjenta nøkkelord fra label"
      />

      {
        // TODO: Denne komponenten har ingen mapping mot ds-react og kan dermed ikke migreres programatisk
      }
      <CheckboksPanelGruppe
        legend={"Velg en eller flere:"}
        checkboxes={[
          { label: "Eplejuice", value: "juice1", id: "juice1id" },
          {
            label: "Appelsinjuice",
            value: "juice2",
            id: "juice2id",
            feil: true,
          },
          { label: "Melk", value: "melk", disabled: true, id: "melkid" },
          {
            label: "Ananasjuice",
            value: "juice3",
            id: "juice4id",
            subtext: "Subtext example",
          },
        ]}
        onChange={() => {}}
        feil="Feilmeldingstekst må gjenta nøkkelord fra label"
        utenFeilPropagering
      />
    </div>
  );
};
