import { LinkPanel } from "@navikt/ds-react";

const KnappFixture = () => {
  return (
    <div className="fixture">
      <LinkPanel href="#FirstPanel" border>
        <LinkPanel.Title>Lenketekst</LinkPanel.Title>
        {
          // TODO: sjekk at LinkPanel.Title og LinkPanel.Description er satt riktig
          // transform kan ikke programatisk skille hva som skal være hva
          // hvis du brukte tittelprops eller linkCreator så er du nødt til å fikse opp dette selv da programatisk migrering der er utenfor scope.
        }
      </LinkPanel>
      <LinkPanel href="#SecondPanel" border>
        <LinkPanel.Title>LenkeBase</LinkPanel.Title>
        {
          // TODO: sjekk at LinkPanel.Title og LinkPanel.Description er satt riktig
          // transform kan ikke programatisk skille hva som skal være hva
          // hvis du brukte tittelprops eller linkCreator så er du nødt til å fikse opp dette selv da programatisk migrering der er utenfor scope.
        }
      </LinkPanel>
      <LinkPanel href="#FirstPanel" border={false}>
        <LinkPanel.Title>Lenketekst</LinkPanel.Title>
        {
          // TODO: sjekk at LinkPanel.Title og LinkPanel.Description er satt riktig
          // transform kan ikke programatisk skille hva som skal være hva
          // hvis du brukte tittelprops eller linkCreator så er du nødt til å fikse opp dette selv da programatisk migrering der er utenfor scope.
        }
      </LinkPanel>
      <LinkPanel href="#FirstPanel" tittelprops="normaltekst" border>
        <LinkPanel.Title>Lenketekst</LinkPanel.Title>
        {
          // TODO: sjekk at LinkPanel.Title og LinkPanel.Description er satt riktig
          // transform kan ikke programatisk skille hva som skal være hva
          // hvis du brukte tittelprops eller linkCreator så er du nødt til å fikse opp dette selv da programatisk migrering der er utenfor scope.
        }
      </LinkPanel>
      <LinkPanel href="#FirstPanel" border>
        <LinkPanel.Title>Lenketekst</LinkPanel.Title>
        {
          // TODO: sjekk at LinkPanel.Title og LinkPanel.Description er satt riktig
          // transform kan ikke programatisk skille hva som skal være hva
          // hvis du brukte tittelprops eller linkCreator så er du nødt til å fikse opp dette selv da programatisk migrering der er utenfor scope.
        }
      </LinkPanel>
    </div>
  );
};
