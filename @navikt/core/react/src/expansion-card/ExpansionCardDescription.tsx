import React, { forwardRef, useContext } from "react";
import cl from "clsx";
import { BodyLong } from "../typography/BodyLong";
import { ExpansionCardContext } from "./ExpansionCard";

interface ExpansionCardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export type ExpansionCardDescriptionType = React.ForwardRefExoticComponent<
  ExpansionCardDescriptionProps & React.RefAttributes<HTMLParagraphElement>
>;

export const ExpansionCardDescription: ExpansionCardDescriptionType =
  forwardRef(({ className, ...rest }, ref) => {
    const panelContext = useContext(ExpansionCardContext);

    if (panelContext === null) {
      console.error(
        "<ExpansionCard.Header> has to be used within an <ExpansionCard>"
      );
      return null;
    }

    return (
      <BodyLong
        {...rest}
        as="p"
        ref={ref}
        className={cl("navds-link-panel__description", className)}
        size={panelContext.size}
      />
    );
  });
