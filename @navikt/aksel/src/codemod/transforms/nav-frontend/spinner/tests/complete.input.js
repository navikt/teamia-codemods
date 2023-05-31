import { NavFrontendSpinner } from "nav-frontend-spinner";

const SpinnerFixture = () => {
  return (
    <div className="fixture">
      <NavFrontendSpinner />
      <NavFrontendSpinner transparent />
      <NavFrontendSpinner type={"XXS"} />
      <NavFrontendSpinner type={"XS"} />
      <NavFrontendSpinner type={"S"} />
      <NavFrontendSpinner type={"M"} />
      <NavFrontendSpinner type="L" />
      <NavFrontendSpinner type="XL" />
      <NavFrontendSpinner type="XXL" />
      <NavFrontendSpinner type="XXXL" />
      <NavFrontendSpinner type="InvalidType1"></NavFrontendSpinner>
      <NavFrontendSpinner
        type={() => {
          return "InvalidType2";
        }}
      ></NavFrontendSpinner>
      <NavFrontendSpinner
        className="SomeClassName"
        extra1={func()}
        extra2="string"
      />
    </div>
  );
};
