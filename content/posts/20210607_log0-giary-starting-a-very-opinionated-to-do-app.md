---
title: Log[0] - Giary - Starting a very opinionated to-do app
description:  Thought process of starting a new project and defining the requirement for the a very opinionate to-ddo app.
createdAt: 2021-06-07
updatedAt: 2021-06-07
slug: log0-giary-starting-a-very-opinionated-to-do-app
---

As I mentioned in my [previous post](https://cornerofprogress.com/opening-code-editor-once-again), it is time to start a bit bigger project than creating a blog.  Before actually opening a code editor, there are a few things to cover, what this project is.

## Pain points
After trying various to-do app out there, unfortunately, I didn’t stick to any of  them for very long, even though I wanted to. Giving it a thought, I came to a finding about some personal pain points with these apps:

1. A lot of features that may or may not be used
2. Must write down every single task to truly see the full potential of the app
3. Must be religiously updated with the progress

All of this can be summarized into one single sentence. [Popular to-do apps](https://zapier.com/blog/best-todo-list-apps/) are trying to suit everybody’s needs to capture a wider audience without any particular system. Usually, this is solved by providing various templates based on different types of systems. This kind of to-do apps is great for already disciplined people. They either use a provided template or create their system and stick with it.  

I am, on the other hand, not so much of a disciplined person. I spend way more time tinkering and trying to create a **perfect** system, if there is a feature, I **must** find a way to use it in a system. Surfing the internet for inspiration. By the end of the day, I almost always feel unsatisfied with how the systems turned out. There is always a thought that there is must be a better way and so the cycle repeats.
 
This becomes exhausting and I usually just give up. Just take a look at how many features are there:

![image-of-many-features-from-todo-apps](https://cornerofprogress.com/img/posts/log0/todo-apps-features.png)

## Requirements for the solution
With the pain points discovered, I concluded what I want from a todo app:

1. Must enforce a system that cannot be changed
2. Must provide an alignment with long term goals  (no shopping lists)
3. Can keep track of the progress or history (so I can pat myself on the back later)
4. Need updates to the task as little as possible
5. A reference dashboard throughout the day

For the past couples of weeks, I did experimentations, keeping in mind the above requirements. I used the pen & paper app for quick iterations.

## Very opinionated system for a to-do app
1. Write down long term goal (good practice to run a goal through S.M.A.R.T. criteria)
2. At the start of the week: write down up to 3 most important tasks for the week, making sure it is aligned with the long term goal
3. At the start of the day: write down only 1 most important task of the day + up to 3 additional tasks (if required), making sure they are aligned with the week’s tasks
4. During the day reference the tasks & write notes (if necessary)
5. At the end of the day: review completed and not completed tasks. For not completed tasks indicate to remove the task or reschedule to another day.
6. Repeat Step 3 - 5 till the end of the week 
7. At the end of the week: review completed and not completed tasks. For not completed tasks indicate to remove the task or reschedule to another week.
8. Repeat Step 2 - 7 till the goal is achieved
9. ???
10. Profit

![sample-image-of-notes](https://cornerofprogress.com/img/posts/log0/notes.jpg)

Keys items to be taken away from this system:

* Hard limit on the number of tasks: forces to think about the actual task that matters and prevents “just to do something to feel productive” tasks
* If the task is not completed by the end of the day/ week: was it really necessary for the goal completion?
* Only 2 times per day (ideally) the entry should be added: nor required to worry about the tasks always being up to date
* Provides a clear history of when and how the tasks are completed/ rescheduled/ deleted

## The name
When starting a new project, an unreasonable amount of time is spent on the name, and this was no exception. The whole process of this systems feels like having a diary, just for the goals. 

Thus the name of **Giary** (pronounced as Harry) comes from **G**oal D**iary**.

I know, very creative. 🧐

## Basic features for MVP (Minimum Viable Product)
Because I used pen & paper it might not be quite straightforward to migrate to a digital form. To ease the migration, I have to define the **very** core features of the system.

* CRUD[^1] a goal
* CRUD a task 
	* Assign to a week or day
	* Update a status (completed/ not completed/ rescheduled/ deleted)
	* Reschedule a task
* Weekly and Daily view for a selected date to view history
* Authentication for cross-device data persistent

[^1]: Create, Read, Update, Delete

## Technology stack
**TL;DR**: [Vue3](https://v3.vuejs.org/) + [Firebase](https://firebase.google.com/)

If there wasn’t a cross-device data persistent feature, I would most probably be fine with just coding the frontend. I, however, want to have the ability to access the data whether I am at my desk or in bed with my phone. I would need some sort of backend service, where I can store and retrieve the data via an API request.

I had an urge to just create my backend server with help of [Laravel](https://laravel.com/), but there more I thought about it, the less it made sense. Here are few things:

1. Code a backend + frontend, which means doubling the amount of time spent on this project without meaningful progress
2. Take care of correctly implementing security-related items for the backend server when it will be time for production
3. Double the amount of bugs I would have to deal with.
4. Potentially creating additional cost

With the above being said, I decided to just use **Firebase** as my backend. Firebase has a generous free tier which should be more than enough for a project like this.

The previous project was coded with Nuxt, which itself is based on Vue2, there are a few of the things like typescript  or [composition API](https://v3.vuejs.org/guide/composition-api-introduction.html) that is still not fully supported and a bit clunky.

As a result, I will be using **Vue3**. It has first-class support for the typescript and I really want to try new composition API.

## Next step
After all of that, the code editor will still be closed for a little while. For the next step, I will be designing a UI[^2]. This should help to:
* Visualize what data is required
* Quickly iterate the design for various screen sizes
* Save time coding the UI as the desired result is already known

A thought process for UI I will leave for the next post.

[^2]: User Interface