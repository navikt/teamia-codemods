import {
  FnrInput,
  SkjemaGruppe,
  ToggleGruppe,
  RadioPanelGruppe,
  CheckboksPanelGruppe,
} from "nav-frontend-skjema";

import {
  TextField,
  Textarea,
  Textarea,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  Select,
  ConfirmationPanel,
  ErrorSummary,
  Label,
} from "@navikt/ds-react";

const SkjemaFixture = () => {
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
      {
        // TODO: Denne komponenten har ingen mapping mot ds-react og kan dermed ikke migreres programatisk
      }
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
      {
        // TODO: Denne komponenten har ingen mapping mot ds-react og kan dermed ikke migreres programatisk
      }
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
      {
        // TODO: Denne komponenten har ingen mapping mot ds-react og kan dermed ikke migreres programatisk
      }
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
      <CheckboxGroup legend="Hvor vil du sitte?">
        {
          // ds-react legger opp til at man bruker onChange på CheckboxGroup komponenten i stedet for individuelle Checkbox komponenter
        }

        <Checkbox />
        <Checkbox />
        <Checkbox />
      </CheckboxGroup>
      <CheckboxGroup
        legend="Hvor vil du sitte?"
        error="Feilmeldingstekst må gjenta nøkkelord fra label"
      >
        {
          // ds-react legger opp til at man bruker onChange på CheckboxGroup komponenten i stedet for individuelle Checkbox komponenter
        }

        <Checkbox />
        <Checkbox />
        <Checkbox />
      </CheckboxGroup>
      <CheckboxGroup
        legend="Hvor vil du sitte?"
        error="Feilmeldingstekst må gjenta nøkkelord fra label"
      >
        {
          // ds-react legger opp til at man bruker onChange på CheckboxGroup komponenten i stedet for individuelle Checkbox komponenter
          // TODO: ds-react støtter ikke utenFeilPropagering for CheckboxGroup
        }

        <Checkbox />
        <Checkbox error />
        <Checkbox />
      </CheckboxGroup>
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
      {
        // TODO: Denne komponenten har ingen mapping mot ds-react og kan dermed ikke migreres programatisk
      }
      <FnrInput
        label="Fødselsnummer (11 siffer)"
        bredde="S"
        value={value}
        onChange={(e) => handleChange(e)}
        onValidate={(val) => setValid(val)}
        feil={submit && !valid ? "Ugyldig fødselsnummer" : undefined}
      />
      <TextField label="Inputfelt-label" />
      <Label htmlFor="min-input">Mitt skjemafelt:</Label>
      <TextField id="min-input" />
      <TextField
        aria-label="Mitt skjemafelt:"
        placeholder="Her kan det skrives"
      />
      <TextField
        aria-labelledby="id-til-html-element-med-label-tekst"
        placeholder="Her kan det skrives"
      />
      <TextField
        label="Inputfelt-nummer"
        inputMode="numeric"
        pattern="[0-9]*"
      />
      <TextField
        label={
          <div style={{ display: "flex" }}>
            Inputfelt-label
            <Hjelpetekst style={{ marginLeft: "0.5rem" }}>
              Innholdet vil vises når brukeren klikker på knappen.
            </Hjelpetekst>
          </div>
        }
      />
      <TextField label="Inputfelt-label" disabled />
      <TextField
        label="Inputfelt-label"
        description="En kort beskrivelse av feltet"
      />
      <TextField label="Inputfelt-label" error="Her er det noe feil" />
      <TextField label="Inputfelt-label" error />
      <TextField
        label="Fullbredde inputfelt:"
        style={{
          width: "100%",
        }}
      />
      <TextField
        label="XXL inputfelt"
        style={{
          width: "420px",
        }}
      />
      <TextField
        label="XL inputfelt"
        style={{
          width: "350px",
        }}
      />
      <TextField
        label="L inputfelt"
        style={{
          width: "280px",
        }}
      />
      <TextField
        label="M inputfelt"
        style={{
          width: "210px",
        }}
      />
      <TextField
        label="S inputfelt"
        style={{
          width: "140px",
        }}
      />
      <TextField
        label="XS inputfelt"
        style={{
          width: "70px",
        }}
      />
      <TextField
        label="XXS inputfelt"
        style={{
          width: "35px",
        }}
      />
      <TextField size="small" />
      {
        // TODO: i ds-react settes 'name' i RadioGroup i stedet for i Radio komponentene
        // TODO: ds-react krever en 'value' prop for Radio komponenter
      }
      <Radio value="" name="minRadioKnapp" />
      {
        // TODO: i ds-react settes 'name' i RadioGroup i stedet for i Radio komponentene
        // TODO: ds-react krever en 'value' prop for Radio komponenter
      }
      <Radio value="" name="minRadioKnapp" disabled />
      <RadioGroup legend="Hvor vil du sitte?" name="sitteplass">
        {
          // TODO: i ds-react settes 'name' i RadioGroup i stedet for i Radio komponentene
          // TODO: ds-react krever en 'value' prop for Radio komponenter
        }
        <Radio value="" />

        {
          // TODO: i ds-react settes 'name' i RadioGroup i stedet for i Radio komponentene
          // TODO: ds-react krever en 'value' prop for Radio komponenter
        }
        <Radio value="" />

        {
          // TODO: i ds-react settes 'name' i RadioGroup i stedet for i Radio komponentene
          // TODO: ds-react krever en 'value' prop for Radio komponenter
        }
        <Radio value="" />
      </RadioGroup>
      <RadioGroup
        legend="Hvor vil du sitte?"
        error="Feilmeldingstekst må gjenta nøkkelord fra label"
        name="sitteplass"
      >
        {
          // TODO: i ds-react settes 'name' i RadioGroup i stedet for i Radio komponentene
          // TODO: ds-react krever en 'value' prop for Radio komponenter
        }
        <Radio value="" />

        {
          // TODO: i ds-react settes 'name' i RadioGroup i stedet for i Radio komponentene
          // TODO: ds-react krever en 'value' prop for Radio komponenter
        }
        <Radio value="" />

        {
          // TODO: i ds-react settes 'name' i RadioGroup i stedet for i Radio komponentene
          // TODO: ds-react krever en 'value' prop for Radio komponenter
        }
        <Radio value="" />
      </RadioGroup>
      {
        // TODO: 'utenFeilPropagering' er ikke støttet i RadioGroup
      }
      <RadioGroup
        legend="Hvor vil du sitte?"
        error="Feilmeldingstekst må gjenta nøkkelord fra label"
        name="sitteplass"
      >
        {
          // TODO: i ds-react settes 'name' i RadioGroup i stedet for i Radio komponentene
          // TODO: ds-react krever en 'value' prop for Radio komponenter
        }
        <Radio value="" />

        {
          // TODO: i ds-react settes 'name' i RadioGroup i stedet for i Radio komponentene
          // TODO: i ds-react blir feil/error håndtert i RadioGroup komponenten
          // TODO: ds-react krever en 'value' prop for Radio komponenter
        }
        <Radio value="" />

        {
          // TODO: i ds-react settes 'name' i RadioGroup i stedet for i Radio komponentene
          // TODO: ds-react krever en 'value' prop for Radio komponenter
        }
        <Radio value="" />
      </RadioGroup>
      {
        // TODO: Denne komponenten har ingen mapping mot ds-react og kan dermed ikke migreres programatisk
      }
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
      {
        // TODO: Denne komponenten har ingen mapping mot ds-react og kan dermed ikke migreres programatisk
      }
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
      {
        // TODO: Denne komponenten har ingen mapping mot ds-react og kan dermed ikke migreres programatisk
      }
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
      {
        // TODO: Denne komponenten har ingen mapping mot ds-react og kan dermed ikke migreres programatisk
      }
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
        error="Her er det noe feil"
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
      {
        // TODO: Denne komponenten har ingen mapping mot ds-react og kan dermed ikke migreres programatisk
      }
      <SkjemaGruppe>
        <TextField label="Fornavn" />
        <TextField label="Etternavn" />
      </SkjemaGruppe>
      {
        // TODO: Denne komponenten har ingen mapping mot ds-react og kan dermed ikke migreres programatisk
      }
      <SkjemaGruppe legend="Kontaktperson">
        <TextField label="Fornavn" />
        <TextField label="Etternavn" />
      </SkjemaGruppe>
      {
        // TODO: Denne komponenten har ingen mapping mot ds-react og kan dermed ikke migreres programatisk
      }
      <SkjemaGruppe legend={<Undertittel>Kontaktperson</Undertittel>}>
        <TextField label="Fornavn" />
        <TextField label="Etternavn" />
      </SkjemaGruppe>
      {
        // TODO: Denne komponenten har ingen mapping mot ds-react og kan dermed ikke migreres programatisk
      }
      <SkjemaGruppe
        legend="Kontaktperson"
        description="Personen som noen kan kontakte"
      >
        <TextField label="Fornavn" />
        <TextField label="Etternavn" />
      </SkjemaGruppe>
      {
        // TODO: Denne komponenten har ingen mapping mot ds-react og kan dermed ikke migreres programatisk
      }
      <SkjemaGruppe feil="Her er det noe feil">
        <TextField label="Fornavn" />
        <TextField label="Etternavn" />
        <Textarea label="Textarea-label" />
      </SkjemaGruppe>
      {
        // TODO: Denne komponenten har ingen mapping mot ds-react og kan dermed ikke migreres programatisk
      }
      <SkjemaGruppe feil="Her er det noe feil" utenFeilPropagering>
        <TextField label="Fornavn" />
        <TextField label="Etternavn" error="Feilen er her!" />
        <TextField label="Adresse" />
      </SkjemaGruppe>
      {
        // TODO: Denne komponenten har ingen mapping mot ds-react og kan dermed ikke migreres programatisk
      }
      <SkjemaGruppe tag="div">
        <TextField label="Fornavn" />
        <TextField label="Etternavn" />
      </SkjemaGruppe>
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
      {
        // TODO: Denne komponenten har ingen mapping mot ds-react og kan dermed ikke migreres programatisk
      }
      <ToggleGruppe
        defaultToggles={[
          { children: "Mandag", pressed: true },
          { children: "Tirsdag" },
          { children: "Onsdag" },
        ]}
      />
      {
        // TODO: Denne komponenten har ingen mapping mot ds-react og kan dermed ikke migreres programatisk
      }
      <ToggleGruppe
        defaultToggles={[
          { children: "Mandag", pressed: true },
          { children: "Tirsdag" },
          { children: "Onsdag" },
        ]}
        multiSelect
      />
      {
        // TODO: Denne komponenten har ingen mapping mot ds-react og kan dermed ikke migreres programatisk
      }
      <ToggleGruppe
        defaultToggles={[
          { children: "Mandag" },
          { children: "Tirsdag" },
          { children: "Onsdag" },
        ]}
        minstEn
      />
      {
        // TODO: Denne komponenten har ingen mapping mot ds-react og kan dermed ikke migreres programatisk
      }
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
