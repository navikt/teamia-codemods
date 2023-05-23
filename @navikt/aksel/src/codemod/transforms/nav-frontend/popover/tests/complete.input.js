import Popover, { PopoverBase } from "nav-frontend-popover";

const PopoverFixture = () => {
  return (
    <div className="fixture">
      <Popover
        {...props}
        ankerEl={this.state.anker}
        onRequestClose={() => this.setState({ anker: undefined })}
      >
        <p style={{ padding: "1rem" }}>Dette er en popover.</p>
      </Popover>

      <Popover
        ankerEl={this.state.anker}
        autoFokus
        avstandTilAnker={42}
        innerRef={someRef}
        onOpen={() => someOnOpenHandler()}
        onRequestClose={() => this.setState({ anker: undefined })}
        orientering={"over-venstre"}
        posisjon={{
          left: 11,
          top: 22,
          pilLeft: 23,
        }}
        utenPil
      >
        <p style={{ padding: "1rem" }}>Dette er en popover.</p>
      </Popover>

      <Popover
        ankerEl={this.state.anker}
        onRequestClose={() => this.setState({ anker: undefined })}
      >
        <PopoverBase
          ankerEl={this.state.anker}
          autoFokus
          avstandTilAnker={42}
          innerRef={someRef}
          onOpen={() => someOnOpenHandler()}
          onRequestClose={() => this.setState({ anker: undefined })}
          orientering={"over-venstre"}
          posisjon={{
            left: 11,
            top: 22,
            pilLeft: 23,
          }}
          utenPil
        >
          <div style={{ padding: "1rem" }}>Dette er en PopoverBase</div>
        </PopoverBase>
      </Popover>

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
        <p style={{ padding: "1rem" }}>Dette er en popover.</p>
      </Popover>
    </div>
  );
};
