import { ErrorSummary } from "@navikt/ds-react";

const FeiloppsummeringFixture = () => {
  return (
    <div className="fixture">
      <ErrorSummary heading="For å gå videre må du rette opp følgende:">
        {[
          { skjemaelementId: "1", feilmelding: "Du må oppgi et navn" },
          { skjemaelementId: "2", feilmelding: "Du må oppgi en adresse" },
          { skjemaelementId: "3", feilmelding: "Du må oppgi et telefonnummer" },
        ].map((error) => (
          <ErrorSummary.Item href={`#${error.skjemaelementId}`}>
            {error.feilmelding}
          </ErrorSummary.Item>
        ))}
      </ErrorSummary>
      <ErrorSummary
        heading="For å gå videre må du rette opp følgende:"
        ref={refToElement}
      >
        {errors.map(customRender)}
      </ErrorSummary>
    </div>
  );
};
