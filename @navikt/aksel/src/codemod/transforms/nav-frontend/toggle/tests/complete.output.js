import { ToggleGroup } from "@navikt/ds-react";

const ToggleFixture = () => {
  return (
    <div className="fixture">
      {
        // TODO: sørg for å legge til value prop i 'ToggleGroup.Item'
      }
      <ToggleGroup className="toggle">
        <ToggleGroup.Item
          extra1="extra"
          extra2={{ val: "extra" }}
          extra3={extra3}
          extra4={() => {
            return "extra";
          }}
        >
          Mandag
        </ToggleGroup.Item>
        <ToggleGroup.Item>Tirsdag</ToggleGroup.Item>
        <ToggleGroup.Item>Onsdag</ToggleGroup.Item>
      </ToggleGroup>

      {
        // TODO: toggleknapper støtter fremdeles onClick, men det er anbefalt å bruke det nye apiet til 'ToggleGroup'
        // TODO: sørg for å legge til value prop i 'ToggleGroup.Item'
        // TODO: 'multiSelect' støttes ikke i ds-react
      }
      <ToggleGroup>
        <ToggleGroup.Item>Mandag</ToggleGroup.Item>
        <ToggleGroup.Item onClick={(e) => setToggled("tirsdag")}>
          Tirsdag
        </ToggleGroup.Item>
        <ToggleGroup.Item>Onsdag</ToggleGroup.Item>
      </ToggleGroup>

      {
        // TODO: sørg for å legge til value prop i 'ToggleGroup.Item'
        // TODO: 'minstEn' støttes ikke i ds-react
      }
      <ToggleGroup>
        <ToggleGroup.Item>Mandag</ToggleGroup.Item>
        <ToggleGroup.Item>Tirsdag</ToggleGroup.Item>
        <ToggleGroup.Item>Onsdag</ToggleGroup.Item>
      </ToggleGroup>

      {
        // TODO: sørg for å legge til value prop i 'ToggleGroup.Item'
        // TODO: 'multiSelect' støttes ikke i ds-react
      }
      <ToggleGroup size="small">
        <ToggleGroup.Item>B</ToggleGroup.Item>
        <ToggleGroup.Item>
          <em style={{ paddingLeft: 2, paddingRight: 2 }}>I</em>
        </ToggleGroup.Item>
        <ToggleGroup.Item>
          <span style={{ textDecoration: "underline" }}>U</span>
        </ToggleGroup.Item>
      </ToggleGroup>

      {
        // TODO: toggleknapper støtter fremdeles onClick, men det er anbefalt å bruke det nye apiet til 'ToggleGroup'
        // TODO: sørg for å legge til value prop i 'ToggleGroup.Item'
      }
      <ToggleGroup>
        <ToggleGroup.Item>Mandag</ToggleGroup.Item>
        <ToggleGroup.Item onClick={(e) => setToggled("tirsdag")}>
          Tirsdag
        </ToggleGroup.Item>
        <ToggleGroup.Item>Onsdag</ToggleGroup.Item>
      </ToggleGroup>

      {
        // TODO: sørg for å legge til value prop i 'ToggleGroup.Item'
        // TODO: vær bevist på at at apiet til ToggleGroup har endret seg, dette kan knekke eksisterende 'onChange'
      }
      <ToggleGroup
        className="togglePure"
        onChange={(e) => thisIsFine(e)}
        size="small"
      >
        <ToggleGroup.Item>B</ToggleGroup.Item>
        <ToggleGroup.Item>
          <em style={{ paddingLeft: 2, paddingRight: 2 }}>I</em>
        </ToggleGroup.Item>
        <ToggleGroup.Item>
          <span style={{ textDecoration: "underline" }}>U</span>
        </ToggleGroup.Item>
      </ToggleGroup>
    </div>
  );
};
