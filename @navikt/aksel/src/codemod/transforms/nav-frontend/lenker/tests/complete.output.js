import { Link } from "@navikt/ds-react";

const LenkeFixture = () => {
  return (
    <div className="fixture">
      Dette er en <Link href="#">tekstlenke</Link> i en setning. Dette er en{" "}
      <Link
        href="#"
        className="KlasseNavn"
        ariaLabel="Arialabel"
        onClick={(e) => {
          console.log(e);
        }}
        target="Target"
      >
        tekstlenke
      </Link>{" "}
      i en setning. Dette er en selvlukkende{" "}
      <Link
        href="#"
        className="KlasseNavn"
        ariaLabel="Arialabel"
        onClick={(e) => {
          console.log(e);
        }}
        target="Target"
      />
    </div>
  );
};
