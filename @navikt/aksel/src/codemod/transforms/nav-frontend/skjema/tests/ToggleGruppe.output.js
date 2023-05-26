import { ToggleGruppe } from "nav-frontend-skjema";

const ToggleGruppeFixture = () => {
  return (
    <div className="fixture">
      {
        // TODO: Denne komponenten har ingen mapping mot ds-react og kan dermed ikke migreres programatisk
      }
      <ToggleGruppe
        defaultToggles={[
          { children: "Mandag", pressed: true },
          { children: "Tirsdag" },
          { children: "Onsdag" },
        ]}
      />

      {
        // TODO: Denne komponenten har ingen mapping mot ds-react og kan dermed ikke migreres programatisk
      }
      <ToggleGruppe
        defaultToggles={[
          { children: "Mandag", pressed: true },
          { children: "Tirsdag" },
          { children: "Onsdag" },
        ]}
        multiSelect
      />

      {
        // TODO: Denne komponenten har ingen mapping mot ds-react og kan dermed ikke migreres programatisk
      }
      <ToggleGruppe
        defaultToggles={[
          { children: "Mandag" },
          { children: "Tirsdag" },
          { children: "Onsdag" },
        ]}
        minstEn
      />

      {
        // TODO: Denne komponenten har ingen mapping mot ds-react og kan dermed ikke migreres programatisk
      }
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
