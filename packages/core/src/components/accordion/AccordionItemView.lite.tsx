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

export default function AccordionItemView(props: BaseAccordionViewProps) {
  return (
    <div {...props.attributes}>
      {props.children}
    </div>
  );
}
