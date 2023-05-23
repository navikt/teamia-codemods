import Lenke from "nav-frontend-lenker";

const LenkeFixture = () => {
  return (
    <div className="fixture">
      Dette er en <Lenke href="#">tekstlenke</Lenke> i en setning. Dette er en{" "}
      <Lenke
        href="#"
        className="KlasseNavn"
        ariaLabel="Arialabel"
        onClick={(e) => {
          console.log(e);
        }}
        target="Target"
      >
        tekstlenke
      </Lenke>{" "}
      i en setning. Dette er en selvlukkende{" "}
      <Lenke
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
