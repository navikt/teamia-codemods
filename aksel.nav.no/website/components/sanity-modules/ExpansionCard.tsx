import { SanityBlockContent } from "@/sanity-block";
import { ExpansionCard as DsExpansionCard } from "@navikt/ds-react";
import { withErrorBoundary } from "@/error-boundary";

const ExpansionCard = ({
  node,
}: {
  node: {
    heading: string;
    heading_level: "h3" | "h4";
    description?: string;
    body: any[];
  };
}) => {
  if (!node.heading || !node.body || !node.heading_level) {
    return null;
  }

  return (
    <DsExpansionCard
      id="aksel-expansioncard"
      className="mb-7 max-w-2xl"
      aria-label={node.heading}
    >
      <DsExpansionCard.Header>
        <DsExpansionCard.Title
          as={node.heading_level}
          size={node.heading_level === "h3" ? "medium" : "small"}
        >
          {node.heading}
        </DsExpansionCard.Title>
        {node?.description && (
          <DsExpansionCard.Description>
            {node.description}
          </DsExpansionCard.Description>
        )}
      </DsExpansionCard.Header>
      <DsExpansionCard.Content>
        <SanityBlockContent blocks={node.body} noLastMargin />
      </DsExpansionCard.Content>
    </DsExpansionCard>
  );
};

export default withErrorBoundary(ExpansionCard, "ExpansionCard");
