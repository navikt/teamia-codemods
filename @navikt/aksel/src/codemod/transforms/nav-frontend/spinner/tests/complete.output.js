import { Loader } from "@navikt/ds-react";

const SpinnerFixture = () => {
  return (
    <div className="fixture">
      <Loader />
      <Loader transparent />
      <Loader size="xsmall" />
      <Loader size="xsmall" />
      <Loader size="small" />
      <Loader size="medium" />
      <Loader size="large" />
      <Loader size="xlarge" />
      <Loader size="2xlarge" />
      <Loader size="3xlarge" />
      <Loader size="medium"></Loader>
      <Loader size="medium"></Loader>
      <Loader className="SomeClassName" extra1={func()} extra2="string" />
    </div>
  );
};
