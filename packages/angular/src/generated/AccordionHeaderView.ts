import {
  Component,
  viewChild,
  ElementRef,
  Renderer2,
  input,
  effect,
  signal,
  ChangeDetectionStrategy,
  OnDestroy,
  AfterViewInit,
  InputSignal,
} from "@angular/core";
import { CommonModule } from "@angular/common";

import type { BaseAccordionViewProps } from "../../types/accordion";

@Component({
  selector: "accordion-header-view",
  standalone: true,
  imports: [CommonModule],
  template: `<h3 #elRef0 #_root><ng-content></ng-content></h3> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `:host { display: contents; }`,
})
export class AccordionHeaderView implements AfterViewInit, OnDestroy {
  attributes: InputSignal<BaseAccordionViewProps["attributes"]> =
    input<BaseAccordionViewProps["attributes"]>();

  _root = viewChild<ElementRef>("_root");
  elRef0 = viewChild<ElementRef>("elRef0");

  _listenerFns = new Map();

  setAttributes(el: HTMLElement, value: any, changes?: any) {
    if (!el) {
      return;
    }
    const target = typeof changes === "undefined" ? value : changes;
    Object.keys(target).forEach((key) => {
      if (key.startsWith("on")) {
        if (this._listenerFns.has(key)) {
          this._listenerFns.get(key)!();
        }
        this._listenerFns.set(
          key,
          this.renderer.listen(
            el,
            key.replace("on", "").toLowerCase(),
            target[key]
          )
        );
      } else {
        this.renderer.setAttribute(el, key.toLowerCase(), target[key] ?? "");
      }
    });
  }

  constructor(private renderer: Renderer2) {
    if (typeof window !== "undefined") {
      effect(
        () => {
          this.setAttributes(this.elRef0()?.nativeElement, this.attributes());
        },
        {
          allowSignalWrites: true, // Enable writing to signals inside effects
        }
      );
    }
  }

  /**
   * Passes `aria-*`, `data-*` & `class` attributes to correct child. Used in angular and stencil.
   * @param element  the ref for the component
   * @param customElementSelector  the custom element like `my-component`
   */
  private enableAttributePassing(
    element: HTMLElement | null,
    customElementSelector: string
  ) {
    const parent = element?.closest(customElementSelector);
    if (element && parent) {
      const attributes = parent.attributes;
      for (let i = 0; i < attributes.length; i++) {
        const attr = attributes.item(i);
        if (
          attr &&
          (attr.name.startsWith("data-") || attr.name.startsWith("aria-"))
        ) {
          element.setAttribute(attr.name, attr.value);
          parent.removeAttribute(attr.name);
        }
        if (attr && attr.name === "class") {
          const isWebComponent = attr.value.includes("hydrated");
          const value = attr.value.replace("hydrated", "").trim();
          const currentClass = element.getAttribute("class");
          element.setAttribute(
            attr.name,
            `${currentClass ? `${currentClass} ` : ""}${value}`
          );
          if (isWebComponent) {
            // Stencil is using this class for lazy loading component
            parent.setAttribute("class", "hydrated");
          } else {
            parent.removeAttribute(attr.name);
          }
        }
      }
    }
  }

  ngAfterViewInit() {
    if (typeof window !== "undefined") {
      const element: HTMLElement | null = this._root()?.nativeElement;
      this.enableAttributePassing(element, "accordion-header-view");
      this.setAttributes(this.elRef0()?.nativeElement, this.attributes());
    }
  }

  ngOnDestroy() {
    for (const fn of this._listenerFns.values()) {
      fn();
    }
  }
}
