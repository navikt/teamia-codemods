import {
  FnrInput,
  FnrInputProps,
  Input,
  InputProps,
  Textarea,
  TextareaProps,
  TextareaControlled,
  TextareaControlledProps,
  Checkbox,
  CheckboxProps,
  CheckboxGruppe,
  Radio,
  RadioProps,
  RadioGruppe,
  Select,
  SelectProps,
  SkjemaGruppe,
  SkjemaGruppeProps,
  SkjemaGruppeFeilContext,
  SkjemaGruppeFeilContextProps,
  ToggleGruppe,
  ToggleGruppeProps,
  ToggleKnapp,
  ToggleKnappProps,
  RadioPanelGruppe,
  RadioPanelGruppeProps,
  RadioPanel,
  RadioPanelProps,
  CheckboksPanelGruppe,
  CheckboksPanelGruppeProps,
  CheckboksPanel,
  CheckboksPanelProps,
  BekreftCheckboksPanel,
  BekreftCheckboksPanelProps,
  Feiloppsummering,
  FeiloppsummeringProps,
  FeiloppsummeringFeil,
  Label,
  SkjemaelementFeilmelding,
} from "nav-frontend-skjema";

const SkjemaFixture = () => {
  return (
    <div className="fixture">
      <BekreftCheckboksPanel
        label="Ja, jeg samtykker"
        checked={isChecked}
        onChange={(e) => setIsChecked(e.target.checked)}
      >
        For å komme videre må du gi oss lov til å hente inn og bruke
        opplysninger om deg.{" "}
        <Lenke href="#">
          Les om hvilke opplysninger vi henter og hvordan vi bruker dem.
        </Lenke>
      </BekreftCheckboksPanel>
      <BekreftCheckboksPanel
        label="Jeg bekrefter at opplysningene jeg har gitt, er riktige og fullstendige"
        checked={isChecked}
        onChange={(e) => setIsChecked(e.target.checked)}
        feil="Du må bekrefte dette før du kan sende inn søknaden."
      >
        Jeg vet at jeg kan miste retten til sykepenger hvis opplysningene jeg
        gir, ikke er riktige eller fullstendige.
      </BekreftCheckboksPanel>
      <CheckboksPanelGruppe
        legend={"Velg en eller flere:"}
        checkboxes={[
          { label: "Eplejuice", value: "juice1", id: "juice1id" },
          { label: "Appelsinjuice", value: "juice2", id: "juice2id" },
          { label: "Melk", value: "melk", disabled: true, id: "melkid" },
          {
            label: "Ananasjuice",
            value: "juice3",
            id: "juice4id",
            subtext: "Subtext example",
          },
        ]}
        onChange={() => {}}
      />
      <CheckboksPanelGruppe
        legend={"Velg en eller flere:"}
        checkboxes={[
          { label: "Eplejuice", value: "juice1", id: "juice1id" },
          { label: "Appelsinjuice", value: "juice2", id: "juice2id" },
          { label: "Melk", value: "melk", disabled: true, id: "melkid" },
          {
            label: "Ananasjuice",
            value: "juice3",
            id: "juice4id",
            subtext: "Subtext example",
          },
        ]}
        onChange={() => {}}
        feil="Feilmeldingstekst må gjenta nøkkelord fra label"
      />
      <CheckboksPanelGruppe
        legend={"Velg en eller flere:"}
        checkboxes={[
          { label: "Eplejuice", value: "juice1", id: "juice1id" },
          {
            label: "Appelsinjuice",
            value: "juice2",
            id: "juice2id",
            feil: true,
          },
          { label: "Melk", value: "melk", disabled: true, id: "melkid" },
          {
            label: "Ananasjuice",
            value: "juice3",
            id: "juice4id",
            subtext: "Subtext example",
          },
        ]}
        onChange={() => {}}
        feil="Feilmeldingstekst må gjenta nøkkelord fra label"
        utenFeilPropagering
      />
      <CheckboxGruppe legend="Hvor vil du sitte?">
        <Checkbox label={"Bakerst"} disabled />
        <Checkbox label={"Midten"} />
        <Checkbox label={"Fremst"} />
      </CheckboxGruppe>
      <CheckboxGruppe
        legend="Hvor vil du sitte?"
        feil="Feilmeldingstekst må gjenta nøkkelord fra label"
      >
        <Checkbox label={"Bakerst"} />
        <Checkbox label={"Midten"} />
        <Checkbox label={"Fremst"} />
      </CheckboxGruppe>
      <CheckboxGruppe
        legend="Hvor vil du sitte?"
        feil="Feilmeldingstekst må gjenta nøkkelord fra label"
        utenFeilPropagering
      >
        <Checkbox label={"Bakerst"} />
        <Checkbox label={"Midten"} feil />
        <Checkbox label={"Fremst"} />
      </CheckboxGruppe>
      <Feiloppsummering
        tittel="For å gå videre må du rette opp følgende:"
        feil={[
          { skjemaelementId: "1", feilmelding: "Du må oppgi et navn" },
          { skjemaelementId: "2", feilmelding: "Du må oppgi en adresse" },
          { skjemaelementId: "3", feilmelding: "Du må oppgi et telefonnummer" },
        ]}
      />
      <Feiloppsummering
        tittel="For å gå videre må du rette opp følgende:"
        feil={errors}
        customFeilRender={customRender}
        innerRef={refToElement}
      />
      <FnrInput
        label="Fødselsnummer (11 siffer)"
        bredde="S"
        value={value}
        onChange={(e) => handleChange(e)}
        onValidate={(val) => setValid(val)}
        feil={submit && !valid ? "Ugyldig fødselsnummer" : undefined}
      />
      <Input label="Inputfelt-label" />
      <Label htmlFor="min-input">Mitt skjemafelt:</Label>
      <Input id="min-input" />
      <Input aria-label="Mitt skjemafelt:" placeholder="Her kan det skrives" />
      <Input
        aria-labelledby="id-til-html-element-med-label-tekst"
        placeholder="Her kan det skrives"
      />
      <Input label="Inputfelt-nummer" inputMode="numeric" pattern="[0-9]*" />
      <Input
        label={
          <div style={{ display: "flex" }}>
            Inputfelt-label
            <Hjelpetekst style={{ marginLeft: "0.5rem" }}>
              Innholdet vil vises når brukeren klikker på knappen.
            </Hjelpetekst>
          </div>
        }
      />
      <Input label="Inputfelt-label" disabled />
      <Input
        label="Inputfelt-label"
        description="En kort beskrivelse av feltet"
      />
      <Input label="Inputfelt-label" feil="Her er det noe feil" />
      <Input label="Inputfelt-label" feil />
      <Input label="Fullbredde inputfelt:" bredde="fullbredde" />
      <Input label="XXL inputfelt" bredde="XXL" />
      <Input label="XL inputfelt" bredde="XL" />
      <Input label="L inputfelt" bredde="L" />
      <Input label="M inputfelt" bredde="M" />
      <Input label="S inputfelt" bredde="S" />
      <Input label="XS inputfelt" bredde="XS" />
      <Input label="XXS inputfelt" bredde="XXS" />
      <Input mini />
      <Radio label={"Radio-label"} name="minRadioKnapp" />
      <Radio label={"Radio-label"} name="minRadioKnapp" disabled />
      <RadioGruppe legend="Hvor vil du sitte?">
        <Radio label={"Bakerst"} name="sitteplass" />
        <Radio label={"Midten"} name="sitteplass" />
        <Radio label={"Fremst"} name="sitteplass" />
      </RadioGruppe>
      <RadioGruppe
        legend="Hvor vil du sitte?"
        feil="Feilmeldingstekst må gjenta nøkkelord fra label"
      >
        <Radio label={"Bakerst"} name="sitteplass" />
        <Radio label={"Midten"} name="sitteplass" />
        <Radio label={"Fremst"} name="sitteplass" />
      </RadioGruppe>
      <RadioGruppe
        legend="Hvor vil du sitte?"
        feil="Feilmeldingstekst må gjenta nøkkelord fra label"
        utenFeilPropagering
      >
        <Radio label={"Bakerst"} name="sitteplass" />
        <Radio label={"Midten"} name="sitteplass" feil />
        <Radio label={"Fremst"} name="sitteplass" />
      </RadioGruppe>
      <RadioPanelGruppe
        name="samplename"
        legend="Hvilken drikke er best?"
        radios={[
          { label: "Eplejuice", value: "juice1", id: "juice1id" },
          { label: "Appelsinjuice", value: "juice2", id: "juice2id" },
          { label: "Melk", value: "melk", disabled: true, id: "melkid" },
          { label: "Ananasjuice", value: "juice3", id: "juice4id" },
        ]}
        checked={this.state.checked}
        onChange={this.onChange}
      />
      <RadioPanelGruppe
        name="samplename"
        legend="Hvilken drikke er best?"
        radios={[
          { label: "Eplejuice", value: "juice1", id: "juice1id" },
          { label: "Appelsinjuice", value: "juice2", id: "juice2id" },
          { label: "Melk", value: "melk", disabled: true, id: "melkid" },
          { label: "Ananasjuice", value: "juice3", id: "juice4id" },
        ]}
        checked={this.state.checked}
        onChange={this.onChange}
        feil={{ feilmelding: "Her er det en feil." }}
      />
      <RadioPanelGruppe
        name="samplename"
        legend="Hvilken drikke er best?"
        radios={[
          { label: "Eplejuice", value: "juice1", id: "juice1id" },
          { label: "Appelsinjuice", value: "juice2", id: "juice2id", feil },
          { label: "Melk", value: "melk", disabled: true, id: "melkid" },
          { label: "Ananasjuice", value: "juice3", id: "juice4id" },
        ]}
        checked={this.state.checked}
        onChange={this.onChange}
        feil={{
          feilmelding: "Feilmeldingstekst må gjenta nøkkelord fra label",
        }}
        utenFeilPropagering
      />
      <RadioPanelGruppe
        name="samplename"
        legend="Hvilken drikke er best?"
        radios={[
          {
            label: "Eplejuice",
            value: "juice1",
            id: "juice1id",
            radioRef: (ref) => (juice1Ref.current = ref),
          },
          { label: "Appelsinjuice", value: "juice2", id: "juice2id" },
          { label: "Melk", value: "melk", disabled: true, id: "melkid" },
          { label: "Ananasjuice", value: "juice3", id: "juice4id" },
        ]}
        checked={this.state.checked}
        onChange={this.onChange}
        feil={{ feilmelding: "Her er det en feil." }}
      />
      <Select label="Hvilken land er best om sommeren?">
        <option value="">Velg land</option>
        <option value="norge">Norge</option>
        <option value="sverige">Sverige</option>
        <option value="danmark">Danmark</option>
      </Select>
      <Select label="Hvilken land er best om sommeren?" disabled>
        <option value="">Velg land</option>
        <option value="norge">Norge</option>
        <option value="sverige">Sverige</option>
        <option value="danmark">Danmark</option>
      </Select>
      <Select
        label="Hvilken land er best om sommeren?"
        feil="Her er det noe feil"
      >
        <option value="">Velg land</option>
        <option value="norge">Norge</option>
        <option value="sverige">Sverige</option>
        <option value="danmark">Danmark</option>
      </Select>
      Hvilken land er best om sommeren? En kort beskrivelse av listen
      <Select
        label="Hvilken land er best om sommeren?"
        description="En kort beskrivelse av listen"
      >
        <option value="">Velg land</option>
        <option value="norge">Norge</option>
        <option value="sverige">Sverige</option>
        <option value="danmark">Danmark</option>
      </Select>
      <SkjemaGruppe>
        <Input label="Fornavn" />
        <Input label="Etternavn" />
      </SkjemaGruppe>
      <SkjemaGruppe legend="Kontaktperson">
        <Input label="Fornavn" />
        <Input label="Etternavn" />
      </SkjemaGruppe>
      <SkjemaGruppe legend={<Undertittel>Kontaktperson</Undertittel>}>
        <Input label="Fornavn" />
        <Input label="Etternavn" />
      </SkjemaGruppe>
      <SkjemaGruppe
        legend="Kontaktperson"
        description="Personen som noen kan kontakte"
      >
        <Input label="Fornavn" />
        <Input label="Etternavn" />
      </SkjemaGruppe>
      <SkjemaGruppe feil="Her er det noe feil">
        <Input label="Fornavn" />
        <Input label="Etternavn" />
        <TextareaControlled label="Textarea-label" />
      </SkjemaGruppe>
      <SkjemaGruppe feil="Her er det noe feil" utenFeilPropagering>
        <Input label="Fornavn" />
        <Input label="Etternavn" feil="Feilen er her!" />
        <Input label="Adresse" />
      </SkjemaGruppe>
      <SkjemaGruppe tag="div">
        <Input label="Fornavn" />
        <Input label="Etternavn" />
      </SkjemaGruppe>
      <TextareaControlled label="Textarea-label" />
      <TextareaControlled label="Textarea-label" maxLength={0} />
      <TextareaControlled label="Textarea-label" disabled />
      <TextareaControlled label="Textarea-label" feil="Her er det noe feil." />
      <TextareaControlled
        label="Textarea-label"
        description="Beskriv kort din situasjon"
      />
      <Textarea
        value={this.state.value}
        onChange={(e) => this.setState({ value: e.target.value })}
      />
      <ToggleGruppe
        defaultToggles={[
          { children: "Mandag", pressed: true },
          { children: "Tirsdag" },
          { children: "Onsdag" },
        ]}
      />
      <ToggleGruppe
        defaultToggles={[
          { children: "Mandag", pressed: true },
          { children: "Tirsdag" },
          { children: "Onsdag" },
        ]}
        multiSelect
      />
      <ToggleGruppe
        defaultToggles={[
          { children: "Mandag" },
          { children: "Tirsdag" },
          { children: "Onsdag" },
        ]}
        minstEn
      />
      <ToggleGruppe
        defaultToggles={[
          { children: "B", pressed: true },
          { children: <em style={{ paddingLeft: 2, paddingRight: 2 }}>I</em> },
          { children: <span style={{ textDecoration: "underline" }}>U</span> },
        ]}
        multiSelect
        kompakt
      />
    </div>
  );
};
