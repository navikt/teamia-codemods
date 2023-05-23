import { Button } from "@navikt/ds-react";

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
      <Button variant="primary">KnappBase</Button>
      <Button variant="secondary">LokalNavnKnapp</Button>
      <Button variant="secondary">Normal</Button>
      <Button
        variant="secondary"
        onClick={(e) => {
          console.log(e.target.value);
        }}
      >
        Normal OnClick
      </Button>
      <Button variant="primary">Hoved</Button>
      <Button variant="danger">Fare</Button>
      <Button variant="tertiary">Flat</Button>
      <Button variant="secondary" className={"SelfClosingButton"} />
      <Button variant="secondary" loading>
        Spinner
      </Button>
      <Button variant="secondary" size="small">
        Mini
      </Button>
      <Button variant="secondary" size="small">
        Kompakt
      </Button>
      <Button variant="secondary" size="xsmall">
        <span>Mini Kompakt</span>
      </Button>
      <Button variant="secondary">
        <Cog />
        <span>Normal</span>
      </Button>
      <Button variant="secondary">
        <span>Normal</span>
        <Cog />
      </Button>

      {
        // TODO: 'mini' er blitt gjort til en del av 'size', men siden det er brukt en variabel for å definere 'mini' så kan ikke migreringscriptet automatisk konvertere.
        // TODO: 'kompakt' er blitt gjort til en del av 'size', men siden det er brukt en variabel for å definere 'kompakt' så kan ikke migreringscriptet automatisk konvertere.
        // TODO: 'spinner' er blitt gjort om til 'loading', men siden det er brukt en variabel for å definere 'spinner' så kan ikke migreringscriptet automatisk konvertere.
      }
      <Button variant="secondary" {...mini} {...kompakt} {...spinner}>
        <span>Mini Kompakt</span>
      </Button>
    </div>
  );
};
