<template>
  <div class="form-tab-view mb-3" :class="classes">
    <p class="form-tab-view__label text-h3" v-if="label && label.length">{{ label }}</p>
    <div class="form-tab-view__menu">
      <button
        type="button"
        v-for="(tab, index) in tabs"
        class="form-tab-view__btn"
        :class="{
          'form-tab-view__btn--active': currentTab === index,
          'form-tab-view__btn--error': hasError(index),
          'form-tab-view__btn--disabled': tab.disabled,
        }"
        @click="selectItem(index)"
      >
        {{ tab.label }}
      </button>
    </div>
    <div class="form-tab-view__content mt-8">
      <template v-for="(item, idx) in items">
        <component
          :is="item"
          v-show="currentTab === idx"
          @error="(state, componentId) => errorHandler(idx, componentId, state)"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, toRefs, PropType } from "vue"
import { Direction, Type } from "../types"
import { Form } from "@/core"
import { FormEvents } from "@/utils/event.dispatcher"

const emit = defineEmits(["error"])

const props = defineProps({
  tabs: {
    type: Array as PropType<{ label: string; disabled?: boolean }[]>,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  direction: {
    type: String as PropType<keyof typeof Direction>,
    default: "row",
  },
  label: {
    type: String,
    default: null,
  },
  class: {
    type: String,
    required: false,
    default: "",
  },
  type: {
    type: String as PropType<keyof typeof Type>,
    default: "filled",
  },
  form: {
    type: Object as PropType<Form>,
    required: true,
  },
})

const currentTab = ref(0)
const errorState = ref({})
const { tabs, direction, type } = toRefs(props)

const selectItem = (idx: number): void => {
  currentTab.value = idx
  props.form.eventDispatcher.dispatch(FormEvents.tabChange, idx)
}

const classes = computed<string[]>(() => [
  `tab-view--${type.value}`,
  type.value === "filled" && direction.value === Direction.row && `tab-view--row ${props.class}`,
  type.value === "filled" && direction.value === Direction.column && `tab-view--column ${props.class}`,
])

const errorHandler = (tabId: number, componentId: string, hasError: boolean): void => {
  if (!errorState.value[tabId]) errorState.value[tabId] = []
  if (hasError) errorState.value[tabId].push(componentId)
  else errorState.value[tabId] = errorState.value[tabId].filter($ => $ !== componentId)
}

const hasError = (idx: number): boolean => {
  return errorState.value[idx] && errorState.value[idx].length
}
</script>

<style lang="scss">
.form-tab-view {
  &--column {
    display: flex;
  }

  &__label {
    margin-bottom: 0.5rem;

    @media (max-width: 90rem) {
      font-size: 1.25rem;
      line-height: 1.4;
    }

    @media (max-width: 34rem) {
      font-size: 1.125rem;
      line-height: 1.56;
    }
  }

  &__menu {
    .tab-view--filled > & {
      display: flex;
      width: fit-content;
      overflow: hidden;
      border: 0.0625rem solid var(--border-primary);
      border-radius: 0.25rem;
    }

    .tab-view--underline > & {
      display: flex;
      overflow: auto;
      white-space: nowrap;
      box-shadow: inset 0 -0.0625rem var(--border-primary);

      @media (max-width: 47.9375rem) {
        margin-inline: -1rem;
      }

      &::-webkit-scrollbar {
        @media (pointer: coarse) {
          display: none;
        }
      }
    }

    .tab-view--column > & {
      flex-direction: column;
    }
  }

  &__btn {
    transition: var(--transition-duration);

    .tab-view--filled > .form-tab-view__menu > & {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.5625rem 1.5rem;
      font-size: 0.875rem;
      line-height: 1.43;
      background: var(--bg-sixth);

      &:not(:last-child) {
        border-right: 0.0625rem solid var(--border-primary);
      }

      &:not(.form-tab-view__btn--active):hover {
        background: var(--bg-seventh);
      }

      &--active {
        background: var(--bg-primary);
        cursor: default;
      }

      &--error {
        border: 0.0625rem solid var(--border-eleventh) !important;
      }

      &--disabled {
        pointer-events: none;
        color: #00000040;
      }
    }

    .tab-view--underline > .form-tab-view__menu > & {
      padding: 0 2rem 0.875rem;
      border-bottom: 0.125rem solid transparent;
      line-height: 1.5;

      @media (max-width: 34rem) {
        padding-bottom: 0.375rem;
        font-size: 0.875rem;
        line-height: 1.43;
      }

      &--active {
        border-color: var(--border-fifth);
      }

      &--error {
        border: 0.0625rem solid var(--border-eleventh) !important;
      }

      &--disabled {
        pointer-events: none;
        color: #00000040;
      }
    }

    .tab-view--row & {
      &:not(:last-child) {
        border-right-width: 0.0625rem;
      }
    }

    .tab-view--column & {
      &:not(:last-child) {
        border-bottom-width: 0.0625rem;
      }
    }
  }

  &__content {
    margin-top: 3rem;

    @media (max-width: 63.9375rem) {
      margin-top: 2rem;
    }

    @media (max-width: 34rem) {
      margin-top: 1.5rem;
    }
  }
}
</style>
