import * as React from "react";
import type { BaseAccordionViewProps } from "../../types/accordion";

function AccordionRootView(props: BaseAccordionViewProps) {
  return <div {...props.attributes}>{props.children}</div>;
}

export default AccordionRootView;
