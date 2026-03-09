import * as React from "react";
import type { BaseAccordionViewProps } from "../../types/accordion";

function AccordionHeaderView(props: BaseAccordionViewProps) {
  return <h3 {...props.attributes}>{props.children}</h3>;
}

export default AccordionHeaderView;
