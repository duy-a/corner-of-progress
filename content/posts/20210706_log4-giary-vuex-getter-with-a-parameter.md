---
title: Log[4] - Giary - Vuex getter with a parameter
description: Implementing a getter with a parameter to filter a stored state of weekly tasks conditionally.
createdAt: 2021-07-06
updatedAt: 2021-07-06
slug: log4-giary-vuex-getter-with-a-parameter
---

**TL;DR**:
- Live demo: https://giary.netlify.app/
- Source code: https://github.com/duy-a/giary

*Note: a dummy state is provided for visualisation purposes*

Despite a busy past week, I had very little time to work on the Giary project, yet I was still determined that at least one feature must be implemented, even if it's the simplest one.

## Weekly task structure
I decided the simple feature will be retrieving and displaying weekly tasks of a current week. Like with most data, I start with defining some structure.

```ts[src/types/Task.interface.ts]
export enum TaskStatus {
  InProgress = "In Progress",
  Completed = "Completed",
  Deleted = "Deleted",
  Rescheduled = "Rescheduled",
}

export default interface Task {
  id?: string;
  title: string;
  status: TaskStatus;
  dueDate: string;
  rescheduledFrom: string;
  rescheduledTo: string;
}
```

Besides the basic information, I have also included fields `rescheduledFrom` and `rescheduledFrom` which will be utilized when a task is, you guessed it, rescheduled. I am also using an enum to make sure all of the tasks will have consistent `status` values.

## Weekly Task state
Before moving on any further, it is a good idea to create some dummy data for better visualization.

```ts[src/store/index.ts]
export const store = createStore<State>({
  state: {
    goalList: [
      {
        id: "fdde9397-337c-4a75-9641-968c37374a32",
        title: "Hello world",
        dueDate: "31/12/2021",
      },
    ],
    weeklyTasks: [
      {
        goalId: "fdde9397-337c-4a75-9641-968c37374a32",
        tasks: [
          {
            id: "fdde9397-667c-4a75-9641-9685jg373ff3",
            title: "In progress weekly Task 1",
            status: TaskStatus.InProgress,
            dueDate: moment().format("DD/MM/YYYY").toString(),
            rescheduledFrom: "",
            rescheduledTo: "",
          },
        ],
      },
    ],
  },
});
```

I could have nested weekly tasks inside a goal object, but I don't like a deeply nested object, they make everything harder to keep track of. 

## Getter with a parameter
As it stands now, the component will have to retrieve a whole `weeklyTask` array and then retrieve it. This might cause duplication of code, but more importantly, there is no guarantee that the data will be consistent.

And that is exactly what Vuex was designed, and getters in particular. They are what is needed to compute derived state based on store state, for example filtering through a list of items and counting them.

```javascript
computed: {
  doneTodosCount () {
    return this.$store.state.todos.filter(todo => todo.done).length
  }
}
```

Based on, the [documentation](https://next.vuex.vuejs.org/guide/getters.html), a getter only receive `state` as a 1st argument and `getters` as a 2nd argument. Based on the requirements, I would like to filter a `weeklyTask` array based on the `goalId`. In order to do so, a [Method-Style Access](https://next.vuex.vuejs.org/guide/getters.html#method-style-access) must be used, which means passing arguments to getters by returning a function

```ts[src/store/index.ts]
export const store = createStore<State>({
  // ..state
  getters: {
    getWeeklyTasksByGoalId(state: State) {
      return (goalId: string) =>
        state.weeklyTasks.filter((week) => week.goalId == goalId)[0];
    },
  },
  // ... mutations
});
```

Based on the structure, there can only be one object for one `goalId` so I can safely return data from the first index of a filtered array.

## Using getters in components
In composition api, in order to access getters, a computed variable must be created references to retain reactivity.


```ts[src/views/WeeklyPlan.vue]
<script lang="ts">
// imports

export default defineComponent({
  setup() {
    const route = useRoute();
    const store = useStore();

    const isPast = ref(false);

    const goalWeeklyTasks = computed(() => store.getters.getWeeklyTasksByGoalId(
      route.params.goalId
    ));

    const weeklyTasksByDueDate = computed(() =>
      goalWeeklyTasks.tasks.filter(
        (task: Task) =>
          task.dueDate === moment().format("DD/MM/YYYY").toString()
      )
    );

    return {
      weeklyTasksByDueDate,
      isPast,
    };
  },
});
</script>
```

Goal's weekly tasks are retrieved, it can be further filtered down based on the current date with another computed property. Nothing too fancy here.

## Displaying weekly tasks
Firsly, a simple update to the `AppTaskListItem.vue` component, where it will recieve a task object as a prop.

```vue[src/components/AppTaskListItem.vue]
<template>
  <li class="p-10 border border-gray-200 rounded-md text-left">
    <div
      v-if="state === 'active' || state === 'underReview'"
      class="flex items-center justify-end mb-5"
    >
      <!-- rest of the component -->
      
      <p class="text-lg font-light">
        {{ task.title }}
      </p>
    </div>
  </li>
</template>

<script lang="ts">
import Task from "@/types/Task.interface";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  props: {
    task: {
      type: Object as PropType<Task>,
      required: true,
    },
  },
});
</script>
```

And, secondly, clean up a `WeeklyPlan.vue` template and pass a task data via newly added props.

```vue[src/views/WeeklyPlan.vue]
<template>
  <BaseLayout>
    <!-- rest of the component -->

    <ul class="mt-5 space-y-8">
      <AppTaskListItem
        v-for="task in weeklyTasksByDueDate"
        :key="task.id"
        :task="task"
      />
    </ul>

    <!-- rest of the component -->
  </BaseLayout>
</template>
```

## Conclusion
There wasn't much done during the past week and I would like to change a few things here and there. However, a little bit of progress is always better than no progress. Also, a lesson learned on how to create a Vuex getter with parameters.