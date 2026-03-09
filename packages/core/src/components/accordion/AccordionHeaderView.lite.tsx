import { useMetadata } from '@builder.io/mitosis';
import type { BaseAccordionViewProps } from '../../types/accordion';

useMetadata({
  angular: {
    changeDetection: 'OnPush',
  },
  attributePassing: {
    enabled: true,
  },
});

export default function AccordionHeaderView(props: BaseAccordionViewProps) {
  return (
    <h3 {...props.attributes}>
      {props.children}
    </h3>
  );
}
