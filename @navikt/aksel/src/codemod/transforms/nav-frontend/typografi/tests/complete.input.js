import TypografiBase, {
  Element,
  Feilmelding,
  Sidetittel,
  Innholdstittel,
  Systemtittel,
  Undertittel,
  Ingress,
  Normaltekst,
  Undertekst,
  UndertekstBold,
} from "nav-frontend-typografi";
const ToggleFixture = () => {
  return (
    <div className="fixture">
      <Sidetittel>Sidetittel</Sidetittel>
      <TypografiBase type="sidetittel">Sidetittel-base</TypografiBase>
      <Innholdstittel tag="p">Innholdstittel</Innholdstittel>
      <TypografiBase type="innholdstittel">Innholdstittel-base</TypografiBase>
      <Systemtittel>Systemtittel</Systemtittel>
      <TypografiBase type="systemtittel">Systemtittel-base</TypografiBase>
      <Undertittel>Undertittel</Undertittel>
      <TypografiBase type="undertittel">Undertittel-base</TypografiBase>
      <Ingress>Ingress</Ingress>
      <TypografiBase type="ingress">Ingress-base</TypografiBase>
      <Element>Element</Element>
      <TypografiBase type="element">Element-base</TypografiBase>
      <Feilmelding>Feilmelding</Feilmelding>
      <TypografiBase type="feilmelding">Feilmelding-base</TypografiBase>
      <Normaltekst>Normaltekst</Normaltekst>
      <TypografiBase type="normaltekst">Normaltekst-base</TypografiBase>
      <Undertekst>Undertekst</Undertekst>
      <TypografiBase type="undertekst">Undertekst-base</TypografiBase>
      <UndertekstBold>UndertekstBold</UndertekstBold>
      <TypografiBase type="undertekstBold">UndertekstBold-base</TypografiBase>
      <Sidetittel tag="h4">Sidetittel</Sidetittel>
      <TypografiBase tag="h4" type="sidetittel">
        Sidetittel-base
      </TypografiBase>
    </div>
  );
};
