import { h, VNode } from "vue"
import { FormFields } from "../core"
import { AbstractFormView, ChildrenView } from "./AbstractFormView"
import TabView from "./components/TabView.vue"
import { Direction, Type } from "./types"

export class FormTabView extends AbstractFormView {
  resolveComponent(children: ChildrenView, $: FormFields): VNode {
    return h(TabView, {
      items: children,
      tabs: $.meta.tabs,
      direction: $.meta.tabs_direction ?? Direction.row,
      type: $.meta.tabs_type ?? Type.filled,
      label: $.meta.label,
      form: this.form,
    })
  }
}
