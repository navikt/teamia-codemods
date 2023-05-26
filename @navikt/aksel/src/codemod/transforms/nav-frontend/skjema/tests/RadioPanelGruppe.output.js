import { RadioPanelGruppe } from "nav-frontend-skjema";

const RadioPanelGruppeFixture = () => {
  return (
    <div className="fixture">
      {
        // TODO: Denne komponenten har ingen mapping mot ds-react og kan dermed ikke migreres programatisk
      }
      <RadioPanelGruppe
        name="samplename"
        legend="Hvilken drikke er best?"
        radios={[
          { label: "Eplejuice", value: "juice1", id: "juice1id" },
          { label: "Appelsinjuice", value: "juice2", id: "juice2id" },
          { label: "Melk", value: "melk", disabled: true, id: "melkid" },
          { label: "Ananasjuice", value: "juice3", id: "juice4id" },
        ]}
        checked={this.state.checked}
        onChange={this.onChange}
      />

      {
        // TODO: Denne komponenten har ingen mapping mot ds-react og kan dermed ikke migreres programatisk
      }
      <RadioPanelGruppe
        name="samplename"
        legend="Hvilken drikke er best?"
        radios={[
          { label: "Eplejuice", value: "juice1", id: "juice1id" },
          { label: "Appelsinjuice", value: "juice2", id: "juice2id" },
          { label: "Melk", value: "melk", disabled: true, id: "melkid" },
          { label: "Ananasjuice", value: "juice3", id: "juice4id" },
        ]}
        checked={this.state.checked}
        onChange={this.onChange}
        feil={{ feilmelding: "Her er det en feil." }}
      />

      {
        // TODO: Denne komponenten har ingen mapping mot ds-react og kan dermed ikke migreres programatisk
      }
      <RadioPanelGruppe
        name="samplename"
        legend="Hvilken drikke er best?"
        radios={[
          { label: "Eplejuice", value: "juice1", id: "juice1id" },
          { label: "Appelsinjuice", value: "juice2", id: "juice2id", feil },
          { label: "Melk", value: "melk", disabled: true, id: "melkid" },
          { label: "Ananasjuice", value: "juice3", id: "juice4id" },
        ]}
        checked={this.state.checked}
        onChange={this.onChange}
        feil={{
          feilmelding: "Feilmeldingstekst må gjenta nøkkelord fra label",
        }}
        utenFeilPropagering
      />

      {
        // TODO: Denne komponenten har ingen mapping mot ds-react og kan dermed ikke migreres programatisk
      }
      <RadioPanelGruppe
        name="samplename"
        legend="Hvilken drikke er best?"
        radios={[
          {
            label: "Eplejuice",
            value: "juice1",
            id: "juice1id",
            radioRef: (ref) => (juice1Ref.current = ref),
          },
          { label: "Appelsinjuice", value: "juice2", id: "juice2id" },
          { label: "Melk", value: "melk", disabled: true, id: "melkid" },
          { label: "Ananasjuice", value: "juice3", id: "juice4id" },
        ]}
        checked={this.state.checked}
        onChange={this.onChange}
        feil={{ feilmelding: "Her er det en feil." }}
      />
    </div>
  );
};
