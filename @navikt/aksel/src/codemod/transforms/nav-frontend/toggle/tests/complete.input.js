import {
  ToggleGruppePure,
  ToggleGruppe,
  ToggleKnappPure,
  ToggleKnapp,
} from "nav-frontend-toggle";

const ToggleFixture = () => {
  return (
    <div className="fixture">
      <ToggleGruppe
        className="toggle"
        defaultToggles={[
          {
            children: "Mandag",
            pressed: true,
            extra1: "extra",
            extra2: { val: "extra" },
            extra3,
            extra4: () => {
              return "extra";
            },
          },
          { children: "Tirsdag" },
          { children: "Onsdag" },
        ]}
      />
      <ToggleGruppe
        defaultToggles={[
          { children: "Mandag", pressed: true },
          { children: "Tirsdag", onClick: (e) => setToggled("tirsdag") },
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
      <ToggleGruppePure
        toggles={[
          { children: "Mandag", pressed: true },
          { children: "Tirsdag", onClick: (e) => setToggled("tirsdag") },
          { children: "Onsdag" },
        ]}
      />
      <ToggleGruppePure
        className="togglePure"
        onChange={(e) => thisIsFine(e)}
        toggles={[
          { children: "B", pressed: true },
          { children: <em style={{ paddingLeft: 2, paddingRight: 2 }}>I</em> },
          { children: <span style={{ textDecoration: "underline" }}>U</span> },
        ]}
        kompakt
      />
    </div>
  );
};
