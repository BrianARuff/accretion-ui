import * as React from "react";
import type { BaseAccordionViewProps } from "../../types/accordion";

function AccordionItemView(props: BaseAccordionViewProps) {
  return <div {...props.attributes}>{props.children}</div>;
}

export default AccordionItemView;
