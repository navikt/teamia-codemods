import {
  Heading,
  Ingress,
  Label,
  ErrorMessage,
  BodyShort,
  Detail,
} from "@navikt/ds-react";
const ToggleFixture = () => {
  return (
    <div className="fixture">
      <Heading size="xlarge">Sidetittel</Heading>
      <Heading type="sidetittel" size="xlarge">
        Sidetittel-base
      </Heading>
      <Heading size="large" as="p">
        Innholdstittel
      </Heading>
      <Heading type="innholdstittel" size="large">
        Innholdstittel-base
      </Heading>
      <Heading size="medium">Systemtittel</Heading>
      <Heading type="systemtittel" size="medium">
        Systemtittel-base
      </Heading>
      <Heading size="small">Undertittel</Heading>
      <Heading type="undertittel" size="small">
        Undertittel-base
      </Heading>
      <Ingress>Ingress</Ingress>
      <Ingress type="ingress">Ingress-base</Ingress>
      <Label>Element</Label>
      <Label type="element">Element-base</Label>
      <ErrorMessage>Feilmelding</ErrorMessage>
      <ErrorMessage type="feilmelding">Feilmelding-base</ErrorMessage>
      <BodyShort>Normaltekst</BodyShort>
      <BodyShort type="normaltekst">Normaltekst-base</BodyShort>
      <Detail>Undertekst</Detail>
      <Detail type="undertekst">Undertekst-base</Detail>
      <Detail>UndertekstBold</Detail>
      <Detail type="undertekstBold">UndertekstBold-base</Detail>
      <Heading size="xlarge" level="4">
        Sidetittel
      </Heading>
      <Heading type="sidetittel" size="xlarge" level="4">
        Sidetittel-base
      </Heading>
    </div>
  );
};
