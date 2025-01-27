import cl from "clsx";
import React, { createContext, forwardRef, useRef, useState } from "react";
import ExpansionCardContent, {
  ExpansionCardContentType,
} from "./ExpansionCardContent";
import {
  ExpansionCardDescription,
  ExpansionCardDescriptionType,
} from "./ExpansionCardDescription";
import ExpansionCardHeader, {
  ExpansionCardHeaderType,
} from "./ExpansionCardHeader";
import {
  ExpansionCardTitle,
  ExpansionCardTitleType,
} from "./ExpansionCardTitle";

interface ExpansionCardComponent
  extends React.ForwardRefExoticComponent<
    ExpansionCardProps & React.RefAttributes<HTMLDivElement>
  > {
  Header: ExpansionCardHeaderType;
  Title: ExpansionCardTitleType;
  Description: ExpansionCardDescriptionType;
  Content: ExpansionCardContentType;
}

interface ExpansionCardCommonProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /**
   * Callback for when Card is toggled open/closed
   */
  onToggle?: (open: boolean) => void;
  /**
   * Controlled open-state
   * Using this removes automatic control of open-state
   */
  open?: boolean;
  /**
   * Defaults to open if not controlled
   * @default false
   */
  defaultOpen?: boolean;
  /**
   * @default "medium"
   */
  size?: "medium" | "small";
  /**
   * Since ExpansionCard is a section-element, accessible name is required.
   */
}

type ExpansionCardConditionalProps =
  | {
      ["aria-label"]: string;
    }
  | {
      ["aria-labelledby"]: string;
    };

export type ExpansionCardContextProps = {
  open: boolean;
  toggleOpen: () => void;
  size: "medium" | "small";
};

export const ExpansionCardContext = createContext<ExpansionCardContextProps>({
  open: false,
  toggleOpen: () => {},
  size: "medium",
});

export type ExpansionCardProps = ExpansionCardCommonProps &
  ExpansionCardConditionalProps;

export const ExpansionCard = forwardRef<HTMLDivElement, ExpansionCardProps>(
  (
    {
      className,
      onToggle,
      open,
      defaultOpen = false,
      size = "medium",
      ...rest
    },
    ref
  ) => {
    const [_open, _setOpen] = useState(defaultOpen);

    const shouldFade = useRef<boolean>(!(Boolean(open) || defaultOpen));

    const handleOpen = () => {
      if (open === undefined) {
        const newOpen = !_open;
        _setOpen(newOpen);
        onToggle?.(newOpen);
      } else {
        onToggle?.(!open);
      }
      shouldFade.current = true;
    };

    return (
      <ExpansionCardContext.Provider
        value={{ open: open ?? _open, toggleOpen: handleOpen, size }}
      >
        <section
          {...rest}
          className={cl(
            "navds-expansioncard",
            className,
            `navds-expansioncard--${size}`,
            {
              "navds-expansioncard--open": open ?? _open,
              "navds-expansioncard--no-fade": !shouldFade.current,
            }
          )}
          ref={ref}
        />
      </ExpansionCardContext.Provider>
    );
  }
) as ExpansionCardComponent;

ExpansionCard.Header = ExpansionCardHeader;
ExpansionCard.Content = ExpansionCardContent;
ExpansionCard.Title = ExpansionCardTitle;
ExpansionCard.Description = ExpansionCardDescription;

export default ExpansionCard;
