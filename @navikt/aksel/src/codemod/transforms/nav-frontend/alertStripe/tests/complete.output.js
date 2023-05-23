import { Alert } from "@navikt/ds-react";

const AlertStripeFixture = () => {
  return (
    <div className="fixture">
      <Foo type="feil" form="inline" size="2rem" />
      <Alert variant="error" inline size="medium" />
      <Alert variant="info" />
      <Alert variant="success" />
      <Alert variant="warning" />
      <Alert variant="error" />
      <Alert inline />
      <Alert size="medium" />
      <Alert variant="error" inline size="medium" />
      <Foo
        type="feil"
        form="inline"
        size="2rem"
        ekstra1="ekstra1"
        ekstra2={"ekstra2"}
        ekstra3
      />
      <Alert
        variant="error"
        inline
        size="medium"
        ekstra1="ekstra1"
        ekstra2={"ekstra2"}
        ekstra3
      />
      <Alert variant="info" ekstra1="ekstra1" ekstra2={"ekstra2"} ekstra3 />
      <Alert variant="success" ekstra1="ekstra1" ekstra2={"ekstra2"} ekstra3 />
      <Alert variant="warning" ekstra1="ekstra1" ekstra2={"ekstra2"} ekstra3 />
      <Alert variant="error" ekstra1="ekstra1" ekstra2={"ekstra2"} ekstra3 />
      <Alert inline ekstra1="ekstra1" ekstra2={"ekstra2"} ekstra3 />
      <Alert size="medium" ekstra1="ekstra1" ekstra2={"ekstra2"} ekstra3 />
      <Alert
        variant="error"
        inline
        size="medium"
        ekstra1="ekstra1"
        ekstra2={"ekstra2"}
        ekstra3
      />
      <Foo type="feil" form="inline" size="2rem">
        Text
      </Foo>
      <Alert variant="error" inline size="medium">
        Text
      </Alert>
      <Alert variant="info">Text</Alert>
      <Alert variant="success">Text</Alert>
      <Alert variant="warning">Text</Alert>
      <Alert variant="error">Text</Alert>
      <Alert inline>Text</Alert>
      <Alert size="small">Text</Alert>
      <Alert variant="error" inline size="medium">
        Text
      </Alert>
      <Foo type={"feil"} form={"inline"} size={"1em"} />
      <Alert variant="error" inline size="small" />
      <Alert variant="info" />
      <Alert variant="success" />
      <Alert variant="warning" />
      <Alert variant="error" />
      <Alert inline />
      <Alert size="small" />
      <Alert variant="error" inline size="small" />

      {
        // TODO: 'type' er blitt gjort om til 'variant', men siden det er brukt en variabel for å definere 'type' så kan ikke migreringscriptet automatisk konvertere.
        // TODO: 'size' er blitt gjort om til 'size="small"|"medium"', men siden det er brukt en variabel for å definere 'size' så kan ikke migreringscriptet automatisk konvertere.
        // TODO: 'form' er blitt gjort om til 'inline=boolean', men siden det er brukt en variabel for å definere 'form' så kan ikke migreringscriptet automatisk konvertere.
      }
      <Alert {...type} {...size} {...form} />
    </div>
  );
};
