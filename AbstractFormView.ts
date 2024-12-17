import { VNode, markRaw } from "vue"
import { Form } from "../core/Form"
import { FormField } from "../core/FormField"
import { FormFields } from "../core/FormFields"

export type ChildrenView = VNode | VNode[] | { [key: string]: VNode }

export abstract class AbstractFormView {
  form: Form

  protected childView = {
    render: (child: FormField) => {
      return child ? child.render() : null
    },
  }

  setForm(form: Form) {
    this.form = markRaw(form)
  }

  protected abstract resolveComponent(items: ChildrenView, fields?: FormFields): VNode

  protected renderChildren(items: (FormFields | FormField)[]): ChildrenView {
    return items.map($ => {
      return $ instanceof FormFields ? $.meta.view.render($) : this.childView.render($)
    })
  }

  public render(element: FormFields): VNode {
    const items = this.renderChildren(element.items)
    return this.resolveComponent(items, element)
  }
}
