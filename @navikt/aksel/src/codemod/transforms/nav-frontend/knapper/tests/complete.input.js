import KnappBase, {
  Knapp as Bar,
  Knapp,
  Hovedknapp,
  Fareknapp,
  Flatknapp,
} from "nav-frontend-knapper";

const KnappFixture = () => {
  return (
    <div className="fixture">
      <SomeEntirelyUnrelatedComponentWithSimilarProps
        type={"hoved"}
        mini
        kompakt
        className={"SelfClosingButton"}
        onClick={(e) => {
          console.log(e.target.value);
        }}
      >
        KnappBase
      </SomeEntirelyUnrelatedComponentWithSimilarProps>
      <KnappBase type={"hoved"}>KnappBase</KnappBase>
      <Bar>LokalNavnKnapp</Bar>
      <Knapp>Normal</Knapp>
      <Knapp
        onClick={(e) => {
          console.log(e.target.value);
        }}
      >
        Normal OnClick
      </Knapp>
      <Hovedknapp>Hoved</Hovedknapp>
      <Fareknapp>Fare</Fareknapp>
      <Flatknapp>Flat</Flatknapp>
      <Knapp className={"SelfClosingButton"} />
      <Knapp spinner>Spinner</Knapp>
      <Knapp mini>Mini</Knapp>
      <Knapp kompakt>Kompakt</Knapp>
      <Knapp mini kompakt>
        <span>Mini Kompakt</span>
      </Knapp>
      <Knapp>
        <Cog />
        <span>Normal</span>
      </Knapp>
      <Knapp>
        <span>Normal</span>
        <Cog />
      </Knapp>
      <Knapp {...mini} {...kompakt} {...spinner}>
        <span>Mini Kompakt</span>
      </Knapp>
    </div>
  );
};
