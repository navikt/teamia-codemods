import KnappBase, {
  Knapp,
  Hovedknapp,
  Fareknapp,
  Flatknapp,
} from "nav-frontend-knapper";
import { Alert } from "@navikt/ds-react";

const AlertStripeFixture = () => {
  return (
    <div className="fixture">
      <Foo type="feil" form="inline" size="2rem" />
      <Alert size="medium" variant="error" inline />
      <Alert variant="info" />
      <Alert variant="success" />
      <Alert variant="warning" />
      <Alert variant="error" />
      <Alert variant="info" inline />
      <Alert size="medium" variant="info" />
      <Alert size="medium" variant="error" inline />
      <Foo
        type="feil"
        form="inline"
        size="2rem"
        extra1="extra1"
        extra2={"extra2"}
        extra3
      />
      <Alert
        size="medium"
        extra1="extra1"
        extra2={"extra2"}
        extra3
        variant="error"
        inline
      />
      <Alert extra1="extra1" extra2={"extra2"} extra3 variant="info" />
      <Alert extra1="extra1" extra2={"extra2"} extra3 variant="success" />
      <Alert extra1="extra1" extra2={"extra2"} extra3 variant="warning" />
      <Alert extra1="extra1" extra2={"extra2"} extra3 variant="error" />
      <Alert extra1="extra1" extra2={"extra2"} extra3 variant="info" inline />
      <Alert
        size="medium"
        extra1="extra1"
        extra2={"extra2"}
        extra3
        variant="info"
      />
      <Alert
        size="medium"
        extra1="extra1"
        extra2={"extra2"}
        extra3
        variant="error"
        inline
      />
      <Foo type="feil" form="inline" size="2rem">
        Text
      </Foo>
      <Alert size="medium" variant="error" inline>
        Text
      </Alert>
      <Alert variant="info">Text</Alert>
      <Alert variant="success">Text</Alert>
      <Alert variant="warning">Text</Alert>
      <Alert variant="error">Text</Alert>
      <Alert variant="info" inline>
        Text
      </Alert>
      <Alert size="small" variant="info">
        Text
      </Alert>
      <Alert size="medium" variant="error" inline>
        Text
      </Alert>
      <Foo type={"feil"} form={"inline"} size={"1em"} />
      <Alert size="small" variant="error" inline />
      <Alert variant="info" />
      <Alert variant="success" />
      <Alert variant="warning" />
      <Alert variant="error" />
      <Alert variant="info" inline />
      <Alert size="small" variant="info" />
      <Alert size="small" variant="error" inline />

      {
        // TODO: 'type' er blitt gjort om til 'variant', men siden det er brukt en variabel for å definere 'type' så kan ikke migreringscriptet automatisk konvertere.
        // TODO: 'size' er blitt gjort om til 'size="small"|"medium"', men siden det er brukt en variabel for å definere 'size' så kan ikke migreringscriptet automatisk konvertere.
        // TODO: 'form' er blitt gjort om til 'inline=boolean', men siden det er brukt en variabel for å definere 'form' så kan ikke migreringscriptet automatisk konvertere.
      }
      <Alert {...type} {...size} {...form} variant="info" />
      <Alert variant="info" />
      <Alert variant="success" />
      <Alert variant="warning" />
      <Alert variant="error" />
      <Alert variant="error" />
    </div>
  );
};
