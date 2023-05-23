import Alertstripe, { AlertStripe as Bar } from "nav-frontend-alertstriper";

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
        ekstra1="ekstra1"
        ekstra2={"ekstra2"}
        ekstra3
      />
      <Bar
        type="feil"
        form="inline"
        size="2rem"
        ekstra1="ekstra1"
        ekstra2={"ekstra2"}
        ekstra3
      />
      <Alertstripe type="info" ekstra1="ekstra1" ekstra2={"ekstra2"} ekstra3 />
      <Alertstripe
        type="suksess"
        ekstra1="ekstra1"
        ekstra2={"ekstra2"}
        ekstra3
      />
      <Alertstripe
        type="advarsel"
        ekstra1="ekstra1"
        ekstra2={"ekstra2"}
        ekstra3
      />
      <Alertstripe type="feil" ekstra1="ekstra1" ekstra2={"ekstra2"} ekstra3 />
      <Alertstripe
        form="inline"
        ekstra1="ekstra1"
        ekstra2={"ekstra2"}
        ekstra3
      />
      <Alertstripe size="2rem" ekstra1="ekstra1" ekstra2={"ekstra2"} ekstra3 />
      <Alertstripe
        type="feil"
        form="inline"
        size="2rem"
        ekstra1="ekstra1"
        ekstra2={"ekstra2"}
        ekstra3
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
    </div>
  );
};
