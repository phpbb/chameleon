# Framework Usage

!> Before we cover how to use the framework its best to understand the concepts of [ITCSS](https://www.youtube.com/watch?v=1OKZOV-iLj4).

Each layer of [ITCSS](https://www.youtube.com/watch?v=1OKZOV-iLj4) has its own
folder. All corresponding partials should be created in the appropriate folder.

1. Settings
2. Tools
3. Generic
4. Base
5. Objects
6. Components
7. Theme
8. Utilities/Other/Trumps

Then simply import it in the correct _build file_

There are three _build files_ in the main `src/scss` folder. These are the heart
of the framework.

?> For more understanding about why checkout the [About](/about/) section.

Each _build file_ is responsible for a different subset of the layers talked
about in [ITCSS](https://www.youtube.com/watch?v=1OKZOV-iLj4)

- **Core**
- **Theme**
- **Utilities**

Each of these has a specific focus or _**"separation of concerns"**_.

!> Its important to know that the first two layers of [ITCSS](https://www.youtube.com/watch?v=1OKZOV-iLj4) are used/imported into each _build file_ as they are globals for the framework. This is not to be confused with the term global for the rendered css.

### Core
The `core.scss` _build file_ which builds the `core.css` file houses the aspects
of your project that rarely change. These are the foundation layers.

- 3 Generic
- 4 Base
- 5 Objects

The first two may be obvious why they belong in **Core**, but for clarification
all _objects_ are included in the **Core** as well since they should be applied
first in selector order building the foundation for your components.

### Theme
The `theme.scss` _build file_ which builds the `theme.css` file houses the all
your components as well as all the themeing. This is essentially the main theme
of your project. You can also add theme specific objects here as well.

- 5 Objects
- 6 Component
- 7 Theme

Its meant to be included on top of the `core.css` layer.

### Utilities
The `utilities.scss` _build file_ which builds the `utilities.css` file houses
everything else. Any utility classes, important trumps, etc...

as such its meant to be included as the last layer.
