---
title: Log[2] - Giary - Breaking down a design into components with Vue & Tailwind CSS
description:  With a rough design for Giary app is completed, it is finally time to open a code editor and start the implementation by breaking down a design into components with Vue & Tailwind CSS
createdAt: 2021-06-18
updatedAt: 2021-06-18
slug: log2-giary-breaking-down-a-design-into-components-with-vue-and-tailwind-css
---
*Disclaimer*: I have omitted a lot of code for some components to keep it short. Where the code is not documented, a link to a repo is provided instead.

**TL;DR:**
* Source code: https://github.com/duy-a/giary
* Live demo: https://giary.netlify.app/
* As of this moment, the app is just a shell without any features implemented*

With a rough [design](https://cornerofprogress.com/log1-giary-designing-a-ui) for the Giary app is completed, it is finally time to open a code editor and start the implementation. 

## Vue project setup
As I previously [decided](https://cornerofprogress.com/log0-giary-starting-a-very-opinionated-to-do-app), I will be using a Vue3 as my front-end framework. A quick and easy way to scaffold a base project is to use [Vue CLI](https://cli.vuejs.org/), which will help a lot with generating a properly configured template.

Once the Vue CLI is installed globally on the machine, a project can be created with a command:

```bash
vue create giary
```

A list of presets will be prompt for a selection. I went with `Manually select features`  and below is the actual selection and the motivation behind it:

```bash
 ◉ Choose Vue version
 ◉ Babel
 ◉ TypeScript
 ◯ Progressive Web App (PWA) Support
 ◉ Router
 ◉ Vuex
 ◯ CSS Pre-processors
 ◉ Linter / Formatter
 ◯ Unit Testing
 ◯ E2E Testing
```

* *Vue 3* has first-class citizen support for typescript
```bash
? Choose a version of Vue.js that you want to start the project with 
  2.x 
❯ 3.x 
```

* *Typescript* is a static type system that can help prevent many potential runtime errors as applications grow
```bash
? Use class-style component syntax? No
? Use Babel alongside TypeScript (required for modern mode, auto-detected polyfills, transpiling JSX)? Yes
```

* A *Router* is a navigation between pages with a history mode 
```bash
? Use history mode for a router? (Requires proper server setup for index fallback in production) (Y/n) Y
```

* *Vuex* is for state management and communication between the components
* *Linter / Formatter* for consistent formatting and to avoid unwanted patterns 
```bash
? Pick a linter / formatter config: 
  ESLint with error prevention only 
  ESLint + Airbnb config 
  ESLint + Standard config 
❯ ESLint + Prettier 
  TSLint (deprecated) 

? Pick additional lint features: (Press <space> to select, <a> to toggle all, <i> to invert selection)
 ◉ Lint on save
```

In the future, if requirements for other features occurs (i.e. Progressive Web App (PWA) Support), they all can be easily added with a help of a rich plugin ecosystem.

Like with every project I start, I like to have a 100% clean project, which means removing all of the example code & files:

* remove all the routes from `src/router/index.ts`
* remove all the files from `src/components`
* remove all the files from `src/views`

## Installing tailwind CSS & Icon pack
Installing Tailwind CSS came with a small caveat. Following official [documentation](https://tailwindcss.com/docs/guides/vue-3-vite) for installation and compiling a project will result in the following error:

```bash
Error: PostCSS plugin tailwindcss requires PostCSS 8.
```

The error is self-explanatory and Vue 3 does [support](https://github.com/vuejs/vue-next/blob/master/CHANGELOG.md#306-2021-02-24) PostCSS 8 as well. The problem comes from the Vue CLI that doesn’t support PostCSS 8 just yet, so a workaround installation is required:

```bash
yarn add -D tailwindcss@npm:@tailwindcss/postcss7-compat postcss@^7 autoprefixer@^9
```

The compatibility build is identical to the main build in every way, so you aren’t missing out on any features or anything like that.

/Note: A support for PostCSS8 will be available in version 5 which is currently in the beta stage./

After that, setting up Tailwind CSS is identical to the [documentation](https://tailwindcss.com/docs/guides/vue-3-vite#create-your-configuration-files).

For the icons,  I use the [Heroicons](https://heroicons.com/) pack, which is from the creators of Tailwind CSS and they are greatly customizable with the same classes as Tailwind CSS.  

```bash
yard add @heroicons/vue #npm install @heroicons/vue
```

Now each icon can be imported individually as a Vue component:

```vue
<template>
  <div>
    <BeakerIcon class="h-5 w-5 text-blue-500"/>
    <p>...</p>
  </div>
</template>

<script>
import { BeakerIcon } from '@heroicons/vue/solid'

export default {
  components: { BeakerIcon }
}
</script>
```

/Note: Heroicons currently only supports Vue 3./

## Navigation to pages
All the pages will be located in the `src/views` directory.  The very first page a user will see is “My Goals” which will be the `home` page as well. I usually create a file with simple text to make sure that the page is accessible.

```vue[src/views/Home.vue]
<tempalte>
	<h1>My Goals page</h1>
</template>
```

To make this page accessible, a vue-router must be mapped with our view which can be added as below:

```ts[src/router/index.ts]
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "homeView",
    component: Home,
  },
];
```

The next step is to tell a vue-router where to display with `<RouterView />`

```vue[src/App.vue]
<template>
  <RouterView />
</template>
```

Now the `Home.vue` page should be accessible via `http://localhost:8080/`.

## Repeatable elements
A very big benefit about prototyping before actually coding a design is all the repeatable elements can be identified and can be extracted straight away. 

A principle in extracting components to keep in mind. A component design must be from edge to edge, the spacing of the component, where the component is and how a component is displayed will be controlled by the parent’s components. With this principle, it will be much easier to update the design or swap the components.

```vue[Button.vue]
<template>
	<button class="px-2 py-1 border border-gray-200">Click me</button>
</template>
```

```vue[parent.vue]
<template>
	<div class="flex" >
		<Button class="mt-10" />
		<Button class="mr-10" />
	</div>
</template>
```

## Extracting the “Base Layout” component
All of the pages based on the design have one thing in common. That is a Header where the title of the page, navigation & other secondary information lives. And the main part where the dynamic content is displayed. Straight away this can be extracted to a separate component, which can be reused through the application.

```vue[src/components/BaseLayout.vue]
<template>
  <div>
    <header class="h-56 bg-green-400 px-5">
      <div class="relative h-full container mx-auto max-w-screen-md">
        <div class="absolute top-0 w-full flex justify-between pt-3 text-sm">
          <p></p>
          <p>01.01.2021</p>
        </div>

        <div class="flex flex-col h-full items-center justify-center">
          <slot name="header"></slot>
        </div>
      </div>
    </header>

    <main class="mx-auto container max-w-screen-md pt-5 px-5 pb-10">
      <slot></slot>
    </main>
  </div>
</template>
```

In this component, I am utilizing the [named slots](https://v3.vuejs.org/guide/component-slots.html#named-slots), where the actual content will be placed and that content will always stay at the correct place without messing up a whole page layout.

## Extracting the “Goal List Item” component
While this element does not appear anywhere except “My Goals” page it is still a great idea to extract it in the event the amount of information displayed grows an can be changed in isolation.

```vue[src/components/AppGoalListItem.vue]
<template>
  <li class="p-10 border border-gray-200 rounded-md text-left">
    <div class="flex items-center justify-between mb-5">
      <p class="text-gray-400 text-sm">31/12/2021</p>
      <div class="space-x-2 text-gray-400 -mt-5">
        <button>
          <PencilIcon class="h-5 w-5 hover:text-gray-700" />
        </button>
        <button>
          <TrashIcon class="h-5 w-5 hover:text-gray-700" />
        </button>
      </div>
    </div>

    <div class="flex items-center">
      <p class="text-lg font-light">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro debitis
        quo nam hic a cupiditate ex illum id. Enim voluptates, est vero possimus
        sunt accusamus corporis recusandae pariatur delectus ipsa?
      </p>
    </div>
  </li>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { PencilIcon, TrashIcon } from "@heroicons/vue/outline";

export default defineComponent({
  components: { PencilIcon, TrashIcon },
});
</script>
```

## Extracting the “Goal Form” component
Right now both “Goal” & “Task” forms are almost the same having a simple text input. A small difference is a goal has a due date. Technically the same component can be used to display a due date input conditionally. However, I think, a much better approach would be to separate these two forms for few reasons:

* The form can be styled differently if required
* Add or delete additional fields (if required) to the form without affecting one another
* Removing conditional logic to control an input visibility
* Simplify the code 

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
      <textarea
        ref="goalTextArea"
        class="px-5 py-2 w-full border border-gray-200 rounded-md resize-none"
        rows="3"
        placeholder="Write down your S.M.A.R.T goal here ..."
      ></textarea>

      <input
        class="px-5 py-2 w-full border border-gray-200 rounded-md resize-none"
        type="text"
        placeholder="Achieve my goal by dd/mm/yyyy ..."
      />

      <div class="flex justify-end space-x-3">
        <button
          type="button"
          class="px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-100"
          @click="isVisibleGoalForm = false"
        >
          Cancel
        </button>

        <button
          type="submit"
          class="px-4 py-2 rounded-md bg-green-400 text-white hover:bg-green-500"
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
import { defineComponent, nextTick, ref } from "vue";
import { CubeTransparentIcon } from "@heroicons/vue/outline";

export default defineComponent({
  components: {
    CubeTransparentIcon,
  },
  emits: ["submitted"],
  setup(_props, { emit }) {
    const goalTextArea = ref(null as unknown as HTMLTextAreaElement);
    const isVisibleGoalForm = ref(false);

    function showGoalInput() {
      isVisibleGoalForm.value = !isVisibleGoalForm.value;

      nextTick(() => {
        goalTextArea.value.focus();
      });
    }

    const isSubmitting = ref(false);

    function submit() {
      isSubmitting.value = true;

      setTimeout(() => {
        emit("submitted");
        isVisibleGoalForm.value = false;
        isSubmitting.value = false;
      }, 500);
    }

    return {
      goalTextArea,
      isVisibleGoalForm,
      showGoalInput,
      isSubmitting,
      submit,
    };
  },
});
</script>
```

The form is hidden behind a big `Add Goal` button, and that’s why I added a very simple interaction functionality for better visualization with simple events.

As I am using vue [composition-api](https://v3.vuejs.org/guide/composition-api-introduction.html), the way events are emitted are slightly different from [options api](https://v3.vuejs.org/api/options-api.html). The difference is that you have to indicate what events will be emitted by a component. The emit action itself must be done via [context](https://v3.vuejs.org/guide/composition-api-setup.html#context) provided to `setup()`

```vue
<script>
export default {
  // Vue 2.x
  methods: {
    click() {
      this.$emit("clicked");
    },
  },

  // Vue 3.x
  emits: ["clicked"],
  setup(_, { emit }) {
    function click() {
      emit("clicked");
    }

    return {
      click,
    };
  },
};
</script>
```

## Assembling “My Goals” page
Most of the components for the “Home” page have been extracted, it becomes very easy to assemble a whole page.

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
          class="hover:bg-gray-50 cursor-pointer"
          @click="navigate"
        />
        <AppGoalListItem
          v-if="isGoalVisible"
          class="hover:bg-gray-50 cursor-pointer"
          @click="navigate"
        />
      </RouterLink>
    </ul>

    <AppGoalForm
      v-if="!isGoalVisible"
      class="mt-8"
      @submitted="isGoalVisible = true"
    />
  </BaseLayout>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import AppGoalListItem from "@/components/AppGoalListItem.vue";
import AppGoalForm from "@/components/AppGoalForm.vue";

export default defineComponent({
  components: { AppGoalListItem, AppGoalForm },
  setup() {
    const isGoalVisible = ref(false);

    return {
      isGoalVisible,
    };
  },
});
</script>
```

There is a very interesting component `<RouterLink>`, which wraps an `AppTaskListItem` component. By default a `<RouterLink>` component will always renders as `<a>` Html tag. I want to change this behaviour so a link will render as a root element of the `AppTaskListItem` component. In Vue Router 3.x version, it was just a matter of adding a `tag` prop, but it has been changed sin Vue Router 4.x version through a scoped slot.

```vue
<template>
  <!-- Vue Router 3.x -->
  <RouterLink to='/' tag='li'>Go to home</RouterLink>


  <!-- Vue Router 4.x -->
  <!-- pass the custom option to <router-link> to prevent it from wrapping its content inside of an <a> element. -->
  <RouterLink
      to="/about"
      custom
      v-slot="{ href, route, navigate, isActive, isExactActive }"
  >
      <NavLink :active="isActive" :href="href" @click="navigate">
        {{ route.fullPath }}
      </NavLink>
  </RouterLink>
</template>
```

For more details on the `<RouterLink>`’s `v-slot` check out the [official documentation](https://next.router.vuejs.org/api/#router-link-s-v-slot)

## Extracting the “Task List Item” component
Another element to be extracted is “Task List Item” which is will be shared on “Weekly” & “Daily” pages. Based on the design a list item can have 4 states.

* the `active` state is when a task can be `edited` or `deleted` 
* the `underReview` state is when a task can be `completed`, `deleted`  or `rescheduled`
* the `reviewed` state is when a task can be reverted to its original state
* the `past` state is when a task only indicates the status 

```vue[src/components/AppTaskListItem.vue]
<template>
  <li class="p-10 border border-gray-200 rounded-md text-left">
    <div
      v-if="state === 'active' || state === 'underReview'"
      class="flex items-center justify-end mb-5"
    >
      <div class="space-x-2 text-gray-400 -mt-5">
        <template v-if="state === 'active'">
          <button @click="actionClicked()">
            <PencilIcon class="h-5 w-5 hover:text-gray-700" />
          </button>
          <button @click="actionClicked()">
            <TrashIcon class="h-5 w-5 hover:text-gray-700" />
          </button>
        </template>

        <template v-if="state === 'underReview'">
          <button @click="actionClicked()">
            <CheckIcon class="h-5 w-5 hover:text-gray-700" />
          </button>
          <button @click="actionClicked()">
            <LogoutIcon class="h-5 w-5 hover:text-gray-700" />
          </button>
          <button @click="actionClicked()">
            <TrashIcon class="h-5 w-5 hover:text-gray-700" />
          </button>
        </template>
      </div>
    </div>

    <div class="flex items-center">
      <LogoutIcon v-if="state === 'past'" class="h-14 w-14 mr-10" />

      <template v-if="state === 'reviewed'">
        <div class="flex space-x-2 mr-9">
          <LogoutIcon class="h-5 w-5" />
          <button @click="actionClicked()">
            <RefreshIcon class="h-5 w-5 text-gray-400 hover:text-gray-700" />
          </button>
        </div>
      </template>

      <p class="text-lg font-light">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro debitis
        quo nam hic a cupiditate ex illum id. Enim voluptates, est vero possimus
        sunt accusamus corporis recusandae pariatur delectus ipsa?
      </p>
    </div>
  </li>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { PencilIcon, TrashIcon, CheckIcon, LogoutIcon, RefreshIcon } from "@heroicons/vue/outline";

export default defineComponent({
  components: { PencilIcon, TrashIcon, CheckIcon, LogoutIcon, RefreshIcon },
  props: {
    state: {
      type: String,
      default: "active",
      validator: (value: string): boolean => {
        return ["active", "underReview", "reviewed", "past"].includes(value);
      },
    },
  },
  emits: ["actionClicked"],
  setup(_props, { emit }) {
    function actionClicked() {
      emit("actionClicked");
    }

    return {
      actionClicked,
    };
  },
});
</script>
```

The state of the component is controller by the props passed from a parent component. In composition api the way props used is also different. The  `setup()` option is executed *before* the component is created, once the props are resolved, and serves as the entry point for composition APIs, which means that `this` inside `setup()` won’t refer to the component instance. That’s why `props` are passed to `setup()` as a first argument

```vue
<script>
export default {
  // Vue 2.x
	props: {
		title: String,
	}
  methods: {
    click() {
      console.log(this.title);
    },
  },

  // Vue 3.x
	props: {
		title: String,
	},
  setup(props) {
    function click() {
      console.log(props.title);
    }

    return {
      click,
    };
  },
};
</script>
```

Now the component can be reused everywhere and a design will change based on the required state. For the past state, I have hardcoded an icon, but it will be updated to have a dynamic icon based on the actual status of the task. A lot of dummy functions just to simulate the actions.

```vue
<template>
	<div>
		 <AppTaskListItem />
		 <AppTaskListItem state="underReview" />
		 <AppTaskListItem state="reviewed" />
		 <AppTaskListItem state="past" />
	</div>
</template>
```

It is not necessary to indicate an `active` state as it is a default option for the component. 

## Extracting the “Task Form”
It is the same as the Goal form with a small difference of not having an input for the due date. I won’t document the code here.

Full implementation of the component can be found [here](https://github.com/duy-a/giary/blob/main/src/components/AppTaskForm.vue).

## Extracting the “Date Navigation”
Both “Weekly” and “Daily” pages have a navigation based on the date. The difference is the navigation per week & day respectively.  In the future, it should be dynamically switched, but for simplicity sake, it will be static. I have also included a few dummy functions to simulate the navigation by emitting the events. The component provides the information that the action happened, but it is up to a parent component to decide what do to with that information.

Full implementation of the component can be found [here](https://github.com/duy-a/giary/blob/main/src/components/AppDateNav.vue).

## Extracting the “Page Navigation”
Another common element between the “Weekly” and “Daily” pages buttons below the header to navigate between the pages. This is also can be extracted to a separate component.  The text and a link of the navigation trigger are controlled by a parent via props.

Full implementation of the component can be found [here](https://github.com/duy-a/giary/blob/main/src/components/AppPageNav.vue).

## Assembling the “Weekly Planning” page
Now every component for the “Weekly” pages is ready, it is just a matter of simply assembling a page. I have added a simple function which handles emitted event from the `AppDateNav.vue` component and simulating a past “Weekly Planning” state.

Full implementation of the component can be found [here](https://github.com/duy-a/giary/blob/main/src/views/WeeklyPlan.vue). 

## Extracting the “Additional Task List Item” component
On the “Daily” page there is also a section for “additional tasks”, which are slightly different from the `AppTaskListItem.vue` design. Similar to `AppGoalForm.vue` & `AppTaskForm.vue`, I want to keep both components separated. Since both task components are almost the same, I won’t document the code here

Full implementation of the component can be found [here](https://github.com/duy-a/giary/blob/main/src/components/AppTaskSecondaryListItem.vue).

## Assembling the “Daily Planning” page
With that the `AppTaskSecondaryListItem`  component ready for the “Daily Planning” page. All that is left is to assemble it with some dummy functions for interactivity. Rinse and repeat at this stage, placing the components at the correct location in the layout.

Full implementation of the component can be found [here](https://github.com/duy-a/giary/blob/main/src/views/DailyPlan.vue).

## Assembling the “Daily & Weekly Review” page
All the components for the page are readily available, the only different thing is to indicate the correct state of the tasks, making sure to add a link to a `src/router/index.ts` file, so a page can be available.

Full implementation for **Daily Review** the component can be found [here](https://github.com/duy-a/giary/blob/main/src/views/DailyReview.vue).

Full implementation for **Weekly Review** the component can be found [here](https://github.com/duy-a/giary/blob/main/src/views/WeeklyReview.vue).


## Extracting common styles
I found myself repeating the same classes over and over again for the head title and decided to extract it to a separate class.

```css[src/index.css]
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .h-title {
    @apply text-center text-white font-black capitalize text-5xl;
  }
}
```

## Conclusion
Somehow this turned out to be a very long post, but I covered all the basic ideas, the progress of extracting & separating different elements into reusable components.

There is one more extraction to a separate component that can be done. That is a whole header section of the “Weekly” & “Daily” pages, but I decided not to do so until the implementation of business logic. In general, extracting repeatable elements to their elements provides multiple benefits:

* Reduce the amount of code per single file
* Reduce the responsibility of the component
* Provide reusability of the code
* Reduce the risk of breaking things in the event of a code update
* Styles are separate and can be easily updated without breaking the whole layout

The components as they are now are very simple and will change once the business logic is implemented. Of course, not everything must be its component, as ‘too much separation can quickly transform to a useless ‘wrappers’.

For now, it is a great starting point in visualizing and polishing a general user flow without worrying too much about user-provided content.