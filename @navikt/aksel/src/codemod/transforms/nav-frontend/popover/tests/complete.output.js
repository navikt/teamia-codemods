import { Popover } from "@navikt/ds-react";

const PopoverFixture = () => {
  return (
    <div className="fixture">
      <Popover
        {...props}
        anchorEl={this.state.anker}
        onClose={() => this.setState({ anker: undefined })}
      >
        <Popover.Content>
          <p style={{ padding: "1rem" }}>Dette er en popover.</p>
        </Popover.Content>
        {
          // TODO: kan ikke bli fullstendig migrert programatisk, trenger manuell sjekk.
        }
      </Popover>
      <Popover
        anchorEl={this.state.anker}
        offset={42}
        ref={someRef}
        onClose={() => this.setState({ anker: undefined })}
        placement="top-start"
        arrow={false}
      >
        <Popover.Content>
          <p style={{ padding: "1rem" }}>Dette er en popover.</p>
        </Popover.Content>
        {
          // TODO: kan ikke bli fullstendig migrert programatisk, trenger manuell sjekk.
        }
      </Popover>
      <Popover
        anchorEl={this.state.anker}
        onClose={() => this.setState({ anker: undefined })}
      >
        <Popover.Content ref={someRef}>
          <div style={{ padding: "1rem" }}>Dette er en PopoverBase</div>
        </Popover.Content>

        {
          // TODO: kan ikke bli fullstendig migrert programatisk, trenger manuell sjekk.
        }
      </Popover>

      {
        // TODO: ankerEl er definert som en variabel og kan dermed ikke automatisk migreres
        // TODO: autoFokus er definert som en variabel og kan dermed ikke automatisk migreres
        // TODO: innerRef er definert som en variabel og kan dermed ikke automatisk migreres
        // TODO: onOpen er definert som en variabel og kan dermed ikke automatisk migreres
        // TODO: onRequestClose er definert som en variabel og kan dermed ikke automatisk migreres
        // TODO: orientering er definert som en variabel og kan dermed ikke automatisk migreres
        // TODO: posisjon er definert som en variabel og kan dermed ikke automatisk migreres
        // TODO: utenPil er definert som en variabel og kan dermed ikke automatisk migreres
      }
      <Popover
        {...props}
        {...ankerEl}
        {...autoFokus}
        {...innerRef}
        {...onOpen}
        {...onRequestClose}
        {...orientering}
        {...posisjon}
        {...utenPil}
      >
        <Popover.Content>
          <p style={{ padding: "1rem" }}>Dette er en popover.</p>
        </Popover.Content>
        {
          // TODO: kan ikke bli fullstendig migrert programatisk, trenger manuell sjekk.
        }
      </Popover>
    </div>
  );
};
