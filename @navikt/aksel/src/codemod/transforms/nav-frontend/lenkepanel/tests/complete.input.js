import Lenkepanel, { LenkepanelBase } from "nav-frontend-lenkepanel";

const KnappFixture = () => {
  return (
    <div className="fixture">
      <Lenkepanel href="#FirstPanel" border>
        Lenketekst
      </Lenkepanel>
      <LenkepanelBase href="#SecondPanel" border>
        LenkeBase
      </LenkepanelBase>
      <Lenkepanel href="#FirstPanel">Lenketekst</Lenkepanel>
      <Lenkepanel href="#FirstPanel" tittelprops="normaltekst" border>
        Lenketekst
      </Lenkepanel>
      <Lenkepanel
        href="#FirstPanel"
        linkCreator={(props) => <a {...props}>{props.children}</a>}
        border
      >
        Lenketekst
      </Lenkepanel>
    </div>
  );
};
