import { Textarea, Textarea } from "@navikt/ds-react";

const TextareaFixture = () => {
  return (
    <div className="fixture">
      <Textarea label="Textarea-label" />
      <Textarea label="Textarea-label" maxLength={0} />
      <Textarea label="Textarea-label" disabled />
      <Textarea label="Textarea-label" error="Her er det noe feil." />
      <Textarea
        label="Textarea-label"
        description="Beskriv kort din situasjon"
      />
      <Textarea
        value={this.state.value}
        onChange={(e) => this.setState({ value: e.target.value })}
      />
    </div>
  );
};
