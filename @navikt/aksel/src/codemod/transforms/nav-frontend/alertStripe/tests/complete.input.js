import Alertstripe, {
  default as Bar,
  AlertStripeInfo,
  AlertStripeSuksess,
  AlertStripeAdvarsel,
  AlertStripeFeil,
  AlertStripeFeil as AnnetNavn,
} from "nav-frontend-alertstriper";
import KnappBase, {
  Knapp,
  Hovedknapp,
  Fareknapp,
  Flatknapp,
} from "nav-frontend-knapper";

const AlertStripeFixture = () => {
  return (
    <div className="fixture">
      <Foo type="feil" form="inline" size="2rem" />
      <Bar type="feil" form="inline" size="2rem" />
      <Alertstripe type="info" />
      <Alertstripe type="suksess" />
      <Alertstripe type="advarsel" />
      <Alertstripe type="feil" />
      <Alertstripe form="inline" />
      <Alertstripe size="2rem" />
      <Alertstripe type="feil" form="inline" size="2rem" />

      <Foo
        type="feil"
        form="inline"
        size="2rem"
        extra1="extra1"
        extra2={"extra2"}
        extra3
      />
      <Bar
        type="feil"
        form="inline"
        size="2rem"
        extra1="extra1"
        extra2={"extra2"}
        extra3
      />
      <Alertstripe type="info" extra1="extra1" extra2={"extra2"} extra3 />
      <Alertstripe type="suksess" extra1="extra1" extra2={"extra2"} extra3 />
      <Alertstripe type="advarsel" extra1="extra1" extra2={"extra2"} extra3 />
      <Alertstripe type="feil" extra1="extra1" extra2={"extra2"} extra3 />
      <Alertstripe form="inline" extra1="extra1" extra2={"extra2"} extra3 />
      <Alertstripe size="2rem" extra1="extra1" extra2={"extra2"} extra3 />
      <Alertstripe
        type="feil"
        form="inline"
        size="2rem"
        extra1="extra1"
        extra2={"extra2"}
        extra3
      />

      <Foo type="feil" form="inline" size="2rem">
        Text
      </Foo>
      <Bar type="feil" form="inline" size="2rem">
        Text
      </Bar>
      <Alertstripe type="info">Text</Alertstripe>
      <Alertstripe type="suksess">Text</Alertstripe>
      <Alertstripe type="advarsel">Text</Alertstripe>
      <Alertstripe type="feil">Text</Alertstripe>
      <Alertstripe form="inline">Text</Alertstripe>
      <Alertstripe size="1rem">Text</Alertstripe>
      <Alertstripe type="feil" form="inline" size="2rem">
        Text
      </Alertstripe>

      <Foo type={"feil"} form={"inline"} size={"1em"} />
      <Bar type={"feil"} form={"inline"} size={"1em"} />
      <Alertstripe type={"info"} />
      <Alertstripe type={"suksess"} />
      <Alertstripe type={"advarsel"} />
      <Alertstripe type={"feil"} />
      <Alertstripe form={"inline"} />
      <Alertstripe size={"23px"} />
      <Alertstripe type={"feil"} form={"inline"} size={"22"} />
      <Alertstripe {...type} {...size} {...form} />

      <AlertStripeInfo />
      <AlertStripeSuksess />
      <AlertStripeAdvarsel />
      <AlertStripeFeil />
      <AnnetNavn />
    </div>
  );
};
