---
title: Log[3] - Giary - CRUD operations with a Vuex state management
description: The implementation of actual features using Vuex as well as restrcuture of the components to accommodate CRUD operations for Goals.
createdAt: 2021-06-28
updatedAt: 2021-06-28
slug: log3-giary-crud-operations-with-a-vuex-state-management
---

TLDR:
- Live demo: https://giary.netlify.app/
- Source code: https://github.com/duy-a/giary

In the [previous post](https://cornerofprogress.com/log2-giary-breaking-down-a-design-into-components-with-vue-and-tailwind-css), I broke a design into various reusable components. It is time to start the implementation of actual features. Before even starting, I can see that some of the components will be changed a bit in a structure. 

Like many Single Page Application, one of the concerns would be data communication between different components. The way the data can go between the components in various ways:

1. Passing data from Parent to Child via [props](https://v3.vuejs.org/guide/component-basics.html#passing-data-to-child-components-with-props)
2. Passing data from Child to Parent via a [custom event](https://v3.vuejs.org/guide/component-basics.html#listening-to-child-components-events)


For a very simple appplication the above solutions should be sufficient, just use props and custom event to do the communication:


```vue[Child.vue]
<template>
  <div>
    <h1>{{ title }}</h1> // 'Hello World'
    <button @click="$emit('pass', 'foobar')">Pass to parent</button>
  </div>
</template>

<script>
export default {
  props: ['title']
}
</script>
```

```vue[Parent.vue]
<tempalte>
  <div>
    <h1>{{ childData }}</h1> // 'foobar' when btn clicked
    <Child title="Hello world" @pass="childData = event"/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      childData: ''
    }
  }
}
</script>
```

However, this can quickly transform into a maintenance hell if there is a need to pass data in the scenario of Parent -> Child -> Child -> and so on. On top of that, there is no way to share the data between the siblings, it always has to be done via a parent component.

## Setting up Vuex 

There are two ways to solve the issue of passing the data sibling components:

- [Event bus](https://blog.logrocket.com/using-event-bus-in-vue-js-to-pass-data-between-components/)
- [Vuex](https://next.vuex.vuejs.org/) is a state management pattern + library for Vue.js applications

For a simple app like Giary, both are very much suitable solution, but I will be using Vuex. The reason is very simple.

> Vuex serves as a centralized store for all the components in an application, with rules ensuring that the state can only be mutated in a predictable fashion.

During the [setup process](https://cornerofprogress.com/log2-giary-breaking-down-a-design-into-components-with-vue-and-tailwind-css), I have already installed Vuex, so there is nothing else to do. The main state is configured and located at the `src/store/index.ts` file. I am using typescript with composition api, so an additional setup is required to utilize the autocompletion and intellisense.

When writing the Vue component in composition API, `useStore` is used to return the typed store. For `useStore` to correctly return the typed store, additional configuration is required:

1. Define the typed `InjectionKey`.
2. Provide the typed `InjectionKey` when installing a store to the Vue app.
3. Pass the typed `InjectionKey` to the useStore method.

```ts[src/store/index.ts]
import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'

export interface State {
  count: number
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
    count: 0
  }
})

// define your own `useStore` composition function
export function useStore () {
  return baseUseStore(key)
}
```

Above is just a sample example to test if everything is configured correctly. If everything is correctly configure, an autocompletion will be available within a `setup()` method.

```vue[Example.vue]
<script>
import { useStore } from "@/store/index";
import { defineComponent } from "vue";

export default defineComponent({
  setup () {
    const store = useStore()

    store.state.count // typed as number
  }
})
</script>
```

And load the key during the creation of the Vue app.

```ts[src/main.ts]
import router from "./router";
import { store, key } from "./store";

const app = createApp(App);

app.use(store, key).use(router).mount("#app");
```

## Goal State

Now that the setup for Vuex & Typescript is working properly, it is time to think about the actual state of the application.

The very core of the application is a "Goal" itself, as everything else revolve around it. So it is a very good idea to start with that. It is always a good idea to define a structure or interface for an object to utilize the full potential of the typescript. For all of my interfaces, I usually create a new directory called `types`.

```ts[src/types/Goal.interface.ts]
export default interface Goal {
  id?: string;
  title: string;
  dueDate: string;
}
```

While everything revolves around the "Goal", the structure of the "Goal" itself is very simple, there is nothing much to it.

I like to think of a state in a form of "What do I need for my application right now?" and progress from there. Based on our design, the very first thing is a user should see is a list of goals.

```ts[src/store/index.ts]
import { InjectionKey } from "vue";
import { createStore, useStore as baseUseStore, Store } from "vuex";
import Goal from "@/types/Goal.interface";

export interface State {
  goalList: Goal[];
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: {
    goalList: [
      {
        id: "e356583f-40fd-4827-96dd-21f556691921",
        title: "Hello World",
        dueDate: "31/12/2021",
      },
    ],
  },
});

export function useStore(): Store<State> {
  return baseUseStore(key);
}
```

Replacing all the dummy state with our `goalList` state with sample data, which can be pulled in the component.

## Displaying goals

As I mentioned previously, getting a state in a `setup()` is very simple with `useStore`. I have removed a dummy variable to toggle a visibility of the `AppGoalListItem.vue` component. 

```vue[src/views/Home.vue]
<script lang="ts">
import AppGoalForm from "@/components/AppGoalForm.vue";
import AppGoalListItem from "@/components/AppGoalListItem.vue";
import { defineComponent, ref } from "vue";

export default defineComponent({
  components: {
    AppGoalListItem,
    AppGoalForm,
  },
  setup() {
    const store = useStore();
    const { goalList } = store.state;

    return {
      goalList,
    };
  },
});
</script>
```

While the data has been pulled from a state, in order to display it, an update to a  `AppGoalListItem.vue` must be made. 

```vue[src/components/AppGoalListItem.vue]
<template>
  <li class="p-10 border border-gray-200 rounded-md text-left">
    <div class="flex items-center justify-between mb-5">
      <p class="text-gray-400 text-sm">{{ formatDate(goal.dueDate, "DD/MM/YYYY") }}</p>
      <div class="space-x-2 text-gray-400 -mt-5">
        <button @click.stop="$emit('update')">
          <PencilIcon class="h-5 w-5 hover:text-gray-700" />
        </button>
        <button @click.stop="$emit('delete')">
          <TrashIcon class="h-5 w-5 hover:text-gray-700" />
        </button>
      </div>
    </div>

    <div class="flex items-center">
      <p class="text-lg font-light">
        {{ goal.title }}
      </p>
    </div>
  </li>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { PencilIcon, TrashIcon } from "@heroicons/vue/outline";
import Goal from "@/types/Goal.interface";

export default defineComponent({
  components: {
    PencilIcon,
    TrashIcon,
  },
  props: {
    goal: {
      type: Object as PropType<Goal>,
      required: true,
    },
  },`
  emits: ["update", "delete"],
  setup() {
    function formatDate(date: string, format: string): string {
      return moment(date, format, true).format(format);
    }

    return {
      formatDate,
    }
  }
});
</script>
```

This is simple Parent to Child communication, so props will be sufficient to do the job. I have also added a simple method to format a date with a help of [moment.js](https://momentjs.com/).  Since I am already at `AppGoalListItem.vue` component, I have also added a few simple "emit" methods as I would like `view` components to do the communication with Vuex. This way a component can be relatively independent.

With an `AppGoalListItem.vue` component updated, it is just a matter of passing a data from `Home.vue` with props.

```vue[src/views/Home.vue]
<template>
  <BaseLayout>
    <template #header>
      <h1 class="h-title">My Goals</h1>
    </template>

    <p class="text-sm italic text-gray-500">You can have up to 2 goals</p>

    <ul class="mt-5 space-y-8">
      <RouterLink v-slot="{ navigate }" to="/weekly-plan" custom>
        <AppGoalListItem
          v-for="goal in goalList"
          :key="goal.id"
          :goal="goal"
          class="hover:bg-gray-50 cursor-pointer"
          @click="navigate"
        />
      </RouterLink>
    </ul>

  </BaseLayout>
</template>
```

With the above change, now the list of goals should be displayed properly once again.

## Creating a Goal

Creating a goal equals adding a new object to the `goalList` state. A Vuex state should be changed via `mutations`. They are rules ensuring that the state can only be mutated predictably.

For a id generation I am using a [uuid library](https://github.com/uuidjs/uuid).

```ts[src/store/index.ts]
export const store = createStore<State>({
  state: {
    goalList: [
      {
        id: "e356583f-40fd-4827-96dd-21f556691921",
        title: "Hello World",
        dueDate: "31/12/2021",
      },
    ],
  },
  mutations: {
    addGoal(state: State, goal: Goal): void {
      goal.id = uuidv4();
      state.goalList.push(goal);
    },
  },
});
```

A mutations itself is very simple, but it is time to update an `AppGoalForm.vue` component. Similiar to `AppGoalListItem.vue`, a component will not interact with a state, only a view, so additional events must be emiited.

```vue[src/components/AppGoalForm.vue]
<template>
  <div>
    <button
      v-if="!isVisibleGoalForm"
      class="py-10 border border-gray-200 rounded-md hover:bg-gray-50 w-full"
      @click="showGoalInput()"
    >
      + Add Goal
    </button>

    <form v-else class="space-y-2" @submit.prevent="submit()">
      <ul>
        <li
          v-for="error in errors"
          :key="error"
          class="list-disc list-inside text-red-500 text-sm"
        >
          {{ error }}
        </li>
      </ul>

      <textarea
        ref="goalTextArea"
        class="px-5 py-2 w-full border border-gray-200 rounded-md resize-none"
        rows="3"
        placeholder="Write down your S.M.A.R.T goal here ..."
        :value="title"
        @input="$emit('update:title', $event.target.value)"
      ></textarea>

      <input
        class="px-5 py-2 w-full border border-gray-200 rounded-md resize-none"
        type="text"
        placeholder="Achieve your goal by dd/mm/yyyy"
        :value="dueDate"
        @input="$emit('update:dueDate', $event.target.value)"
      />

      <div class="flex justify-end space-x-3">
        <button
          type="button"
          class="action-btn border border-gray-200 hover:bg-gray-100"
          @click.stop="hideGoalInput()"
        >
          Cancel
        </button>

        <button
          type="submit"
          class="action-btn bg-green-400 text-white hover:bg-green-500"
        >
          <CubeTransparentIcon
            v-if="isSubmitting"
            class="h-5 w-5 animate-spin"
          />
          <span v-else>Add Goal</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { CubeTransparentIcon } from "@heroicons/vue/outline";
import moment from "moment";
import { defineComponent, nextTick, ref } from "vue";

export default defineComponent({
  components: {
    CubeTransparentIcon,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    dueDate: {
      type: String,
      required: true,
    },
    isSubmitting: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:title", "update:dueDate", "cancel", "submitting"],
  setup(props, { emit }) {
    const goalTextArea = ref(null as unknown as HTMLTextAreaElement);
    const isVisibleGoalForm = ref(false);

    const errors = ref([] as Array<string>);

    function showGoalInput() {
      isVisibleGoalForm.value = !isVisibleGoalForm.value;

      nextTick(() => {
        goalTextArea.value.focus();
      });
    }

    function hideGoalInput() {
      isVisibleGoalForm.value = false;
      emit("cancel");
    }

    function submit(): void {
      errors.value = [];

      if (props.title === "" || props.dueDate === "") {
        errors.value.push("Title & due date canot be empty");
        return;
      }

      if (
        moment(props.dueDate, "DD/MM/YYYY").format("DD/MM/YYYY") !==
        props.dueDate
      ) {
        errors.value.push("Due date must have a dd/mm/yyyy format");
        return;
      }

      emit("submitting");
      isVisibleGoalForm.value = false;
    }

    return {
      goalTextArea,
      isVisibleGoalForm,
      errors,
      showGoalInput,
      hideGoalInput,
      submit,
    };
  },
});
</script>
```

A simple validation is done here to make a form cannot be empty and a date has a correct format. A big update with a `AppGoalForm.vue` component is a props can be bind with a v-model from a parent. In layment terms, `v-model` is a combintation of binding a `:value` attribute and emit events. 

```vue[ParentExample.vue]
<template>
  <AppGoalForm
      v-model:title="title"
      v-model:dueDate="dueDate"
      class="mt-8"
      @submitting="submit()"
    />
</template>
```

With `AppGoalForm.vue` component now requiring a few additional props, it's time to make updates inside a `Home.vue`, which will provide data to a child component as well as listen to emitted events.

```vue[src/views/Home.vue]
<template>
  <BaseLayout>
    <!-- the rest of template -->

    <AppGoalForm
      v-if="goalList.length < 2"
      v-model:title="newGoal.title"
      v-model:dueDate="newGoal.dueDate"
      class="mt-8"
      @submitting="addGoal()"
    />
  </BaseLayout>
</template>

<script lang="ts">
// imports

export default defineComponent({
  // components
  setup() {
    const store = useStore();
    const { goalList } = store.state;
    const newGoal = ref({
      title: "",
      dueDate: "",
    } as Goal);

    function addGoal() {
      if (goalList.length < 2) {
        store.commit("addGoal", newGoal.value);
        newGoal.value = {
          title: "",
          dueDate: "",
        } as Goal;
      }
    }

    return {
      // previously added
      addGoal,
    };
  },
});
</script>
```

Based on the design decision, I have a simple validation to check the number of goals. If there are already 2 goals present, no more goals can be added.

## Deleting a Goal

I want to start with a deletion of a goal, since most of the components have already been updated to handle that, and all is left is to add a mutation to the deletion.

```ts[src/store/index.ts]
export const store = createStore<State>({
  // state
  mutations: {
    // addGoal()
    deleteGoal(state: State, goalId: string): void {
      const index = state.goalList.findIndex((goal) => goal.id === goalId);
      state.goalList.splice(index, 1);
    },
  },
});
```

With a mutation, it is simple to listen to an emitted `delete` event and act upon it. 

```vue[src/views/Home.vue]
<template>
  <BaseLayout>
    <template #header>
      <h1 class="h-title">My Goals</h1>
    </template>

    <p class="text-sm italic text-gray-500">You can have up to 2 goals</p>

    <ul class="mt-5 space-y-8">
      <RouterLink v-slot="{ navigate }" to="/weekly-plan" custom>
        <AppGoalListItem
          v-for="goal in goalList"
          :key="goal.id"
          :goal="goal"
          class="hover:bg-gray-50 cursor-pointer"
          @click="navigate"
          @delete="deleteGoal(goal.id)"
        />
      </RouterLink>
    </ul>

  </BaseLayout>
</template>

<script lang="ts">
export default defineComponent({
  components: {
    AppGoalListItem,
  },
  setup() {
    const store = useStore();

    function deleteGoal(goalId: string): void {
      store.commit("deleteGoal", goalId);
    }

    return {
      deleteGoal,
    };
  },
});
</script>
```

## Editing a Goal
I left an editing operation for the last, as this is where I faced a problem. In my initial design, when a user clicks a pencil icon, a form should be displayed. However, based on the current structure of the components a form will be wrapped around a link and a form itself is hidden behind a big trigger button.

I am starting with a state mutations, so keep it out of the way first and make it ready for a later use once a components restucture is completed.

```ts[src/store/index.ts]
export const store = createStore<State>({
  // state 
  mutations: {
    // add & delete operations
    updateGoal(state: State, goalData: Goal): void {
      const index = state.goalList.findIndex((goal) => goal.id === goalData.id);
      state.goalList.splice(index, 1, goalData);
    },
  },
});
```

I started with a `AppGoalForm.vue` components as it is the easiest one to update.

```vue[src/components/AppGoalForm.vue]
<template>
  <div>
    <button
      v-if="!isVisibleGoalForm && haveTriggerFormBtn"
      class="py-10 border border-gray-200 rounded-md hover:bg-gray-50 w-full"
      @click="showGoalInput()"
    >
      + Add Goal
    </button>

    <form v-else class="space-y-2" @submit.prevent="submit()"
      // form inputs

      <div class="flex justify-end space-x-3">
        // cancel button

        <button
          type="submit"
          class="action-btn bg-green-400 text-white hover:bg-green-500"
        >
          <CubeTransparentIcon
            v-if="isSubmitting"
            class="h-5 w-5 animate-spin"
          />
          <span v-else>{{ submitBtnText }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
// imports

export default defineComponent({
  components: {
    CubeTransparentIcon,
  },
  props: {
    haveTriggerFormBtn: {
      type: Boolean,
      default: true,
    },
    submitBtnText: {
      type: String,
      default: "Add Goal",
    },
  },
  emits: ["update:title", "update:dueDate", "cancel", "submitting"],
});
</script>
```

I have added additional props to control the state of the form. With a form out of the ways, it is time to update a `AppGoalListItem.vue` component, to handle a trigger for an edit form.

```vue[src/components/AppGoalListItem.vue]
<template>
  <div>
    <RouterLink
      v-if="!isEditMode"
      v-slot="{ navigate }"
      :to="navigateTo"
      custom
    >
      <li
        class="p-10 border border-gray-200 rounded-md text-left"
        :class="{ 'hover:bg-gray-50 cursor-pointer': isHoverable }"
        @click="navigate()"
      >
        <div class="flex items-center justify-between mb-5">
          // date
          <div class="space-x-2 text-gray-400 -mt-5">
            <button @click.stop="isEditMode = true">
              <PencilIcon class="h-5 w-5 hover:text-gray-700" />
            </button>
            // delet button
          </div>
        </div>

        // goal title
      </li>
    </RouterLink>

    <AppGoalForm
      v-else
      v-model:title="toUpdateGoal.title"
      v-model:dueDate="toUpdateGoal.dueDate"
      submit-btn-text="Update"
      class="mt-8 p-5 border border-gray-200 rounded-md text-left"
      :have-trigger-form-btn="false"
      @submitting="update()"
      @cancel="cancel()"
    />
  </div>
</template>

<script lang="ts">
// imports

export default defineComponent({
  components: {
    // icon components
    AppGoalForm,
  },
  props: {
    goal: {
      type: Object as PropType<Goal>,
      required: true,
    },
    navigateTo: {
      type: String,
      required: true,
      default: "/",
    },
    isHoverable: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update", "delete"],
  setup(props, { emit }) {
    function formatDate(date: string, format: string): string {
      return moment(date, format, true).format(format);
    }

    const isEditMode = ref(false);
    const toUpdateGoal = ref({ ...props.goal });
    function update() {
      emit("update", toUpdateGoal.value);
      isEditMode.value = false;
    }

    function cancel() {
      isEditMode.value = false;
      toUpdateGoal.value = { ...props.goal };
    }

    return {
      formatDate,
      isEditMode,
      toUpdateGoal,
      update,
      cancel,
    };
  },
});
</script>
```

Now the link lives within an `AppGoalListItem.vue` component, so `Home.vue` must be updated as well, otherwise, there will be a link wrapped around a link

```vue[src/views/Home.vue]
<template>
  <BaseLayout>
    // header and title

    <ul class="mt-5 space-y-8">
      <AppGoalListItem
        v-for="goal in goalList"
        :key="goal.id"
        :goal="goal"
        :navigate-to="`/${goal.id}/weekly-plan`"
        :is-hoverable="true"
        @update="updateGoal($event)"
        @delete="deleteGoal(goal.id)"
      />
    </ul>

    // Add goal form
  </BaseLayout>
</template>

<script lang="ts">
// imports

export default defineComponent({
  components: {
    AppGoalListItem,
    AppGoalForm,
  },
  setup() {
    const store = useStore();

    // add & delete operations

    function updateGoal(goal: Goal): void {
      store.commit("updateGoal", goal);
    }

    return {
      updateGoal,
    };
  },
});
</script>
```

And with this update, every planned operation for a goal is completed.

## Conclusion
As I mentioned, Vuex is built to ensure that the state can only be mutated predictably. A very great tool to visualize is a [Vue dev tool](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd?hl=en), which shows how the state changed. On top of that, it is a great tool to visualize & debug a Vue app in general.

From creating simple CRUD operations, it can be seen that there is no 'one size fits all` when talking about component communication. It can be a huge disadvantage if I were to stick to one way only. Just imagine how many states I would need to pass a simple data from Parent to a Child.

A good way of thinking about the state: "Do I need this data everywhere?" If yes, that put it in a state, otherwise, stick to props and events.
