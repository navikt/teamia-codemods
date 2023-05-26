import { ConfirmationPanel } from "@navikt/ds-react";

const BekreftCheckboksPanelFixture = () => {
  return (
    <div className="fixture">
      <ConfirmationPanel
        label="Ja, jeg samtykker"
        checked={isChecked}
        onChange={(e) => setIsChecked(e.target.checked)}
      >
        For å komme videre må du gi oss lov til å hente inn og bruke
        opplysninger om deg.{" "}
        <Lenke href="#">
          Les om hvilke opplysninger vi henter og hvordan vi bruker dem.
        </Lenke>
      </ConfirmationPanel>
      <ConfirmationPanel
        label="Jeg bekrefter at opplysningene jeg har gitt, er riktige og fullstendige"
        checked={isChecked}
        onChange={(e) => setIsChecked(e.target.checked)}
        error="Du må bekrefte dette før du kan sende inn søknaden."
      >
        Jeg vet at jeg kan miste retten til sykepenger hvis opplysningene jeg
        gir, ikke er riktige eller fullstendige.
      </ConfirmationPanel>
    </div>
  );
};
