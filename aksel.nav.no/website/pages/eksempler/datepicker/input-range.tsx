import { UNSAFE_DatePicker, UNSAFE_useRangeDatepicker } from "@navikt/ds-react";
import { withDsExample } from "components/website-modules/examples/withDsExample";

const Example = () => {
  const { datepickerProps, toInputProps, fromInputProps, selectedRange } =
    UNSAFE_useRangeDatepicker({
      fromDate: new Date("Aug 23 2019"),
      onRangeChange: console.log,
    });

  return (
    <div className="min-h-96">
      <UNSAFE_DatePicker {...datepickerProps}>
        <div className="flex flex-wrap justify-center gap-4">
          <UNSAFE_DatePicker.Input {...fromInputProps} label="Fra" />
          <UNSAFE_DatePicker.Input {...toInputProps} label="Til" />
        </div>
      </UNSAFE_DatePicker>
      {selectedRange && (
        <div className="pt-4">
          <div>{selectedRange?.from && selectedRange.from.toDateString()}</div>
          <div>{selectedRange?.to && selectedRange.to.toDateString()}</div>
        </div>
      )}
    </div>
  );
};

export default withDsExample(Example);

/* Storybook story */
export const Demo = {
  render: Example,
};

export const args = {
  index: 7,
  desc: "Før du belger å bruke range, vurder om to enkelte datepickere for start/slutt-dato ville vært bedre. Range fungerer bedre for korte perioder innenfor en månede.",
};
