# CSS Coding Standards for PHPBB Styles

---

## Translations

---

In working on large, long running projects with dozens of developers, it is
important that we all work in a unified way in order to, among other things:

* Keep stylesheets maintainable
* Keep code transparent and readable
* Keep stylesheets scalable

There are a variety of techniques we must employ in order to satisfy these
goals.

The first part of this document will deal with syntax, formatting and CSS
anatomy, the second part will deal with approach, mindframe and attitude toward
writing and architecting CSS. Exciting, huh?

## Contents

* [CSS document anatomy](#css-document-anatomy)
  * [General](#general)
  * [One file vs. many files](#one-file-vs-many-files)
  * [Table of contents](#table-of-contents)
  * [Section titles](#section-titles)
* [Source order](#source-order)
* [Anatomy of rulesets](#anatomy-of-rulesets)
* [Naming conventions](#naming-conventions)
  * [JS hooks](#js-hooks)
  * [Internationalisation](#internationalisation)
* [Comments](#comments)
* [Writing CSS](#writing-css)
* [Building new components](#building-new-components)
* [OOCSS](#oocss)
* [Layout](#layout)
* [Sizing UIs](#sizing-uis)
  * [Font sizing](#font-sizing)
* [Shorthand](#shorthand)
* [IDs](#ids)
* [Selectors](#selectors)
  * [Over qualified selectors](#over-qualified-selectors)
  * [Selector performance](#selector-performance)
* [CSS selector intent](#css-selector-intent)
* [`!important`](#important)
* [Magic numbers and absolutes](#magic-numbers-and-absolutes)
* [Conditional stylesheets](#conditional-stylesheets)
* [Debugging](#debugging)
* [Preprocessors](#preprocessors)

---

## CSS Document Anatomy

No matter the document, we must always try and keep a common formatting. This
means consistent commenting, consistent syntax and consistent naming.

### General

Limit your stylesheets to a maximum 80 character width where possible.
Exceptions may be gradient syntax and URLs in comments. That’s fine, there’s
nothing we can do about that.

### One file vs. many files

Files will should be broken up modularly by area of responsibility

* Core - Contains universal rules and utilities
    * Normalize - Make all the browsers play nice together
    * Base - More aggressive resets to preference
    * Defaults - All the core less variables
    * Commons - Styling of the base HTML elements IE Text, Lists, Tables, Forms, ect...
    * Layout - Grid system
    * Utilities - Universal global singletons, modifiers and helpers
* Mixins - Houses all mixins, we maintain them separately for modularity
* Theme - Contains all modules and specific content
    * Blocks - Content Regions/Sections
    * Components - Objects can be comprised of one or more singletons
    * Elements - Singletons
    * Vars - Trumps the defaults for the specific them

### Section titles

All files will have a header depending on weather it requires being render or
not will dictate which one

##### Rendered

    /*----------------------------------------------------------------------------*\
        $TITLE
    /*----------------------------------------------------------------------------*\
        Brief Description
    /*----------------------------------------------------------------------------*/

##### Not Rendered
    //------------------------------------------------------------------------------
    //  $TITLE
    //------------------------------------------------------------------------------
    //  Brief Description
    //------------------------------------------------------------------------------


The `$` prefixing the name of the section allows us to run a find ([Cmd|Ctrl]+F)
for `$[SECTION-NAME]` **limiting our search scope to section titles only**.

Each sub file type should be perpended with the type of file in the Title

    /*----------------------------------------------------------------------------*\
        $UTILITIES-TEXT
    /*----------------------------------------------------------------------------*\
        Contains useful text related functions
    /*----------------------------------------------------------------------------*/


Within the files themselves each section should have its own headers and
sub headers as follows:

##### Rendered
    /*----------------------------------------------------------------------------*\
        $HEADER
    /*----------------------------------------------------------------------------*\
        Description
    /*----------------------------------------------------------------------------*/

    /* Sub Header */
    @grid-columns:                              12;

    /* Sub Header (increment column third exponentially by 6) */
    @col-third-sm:                              @base-grid-multiplier;
    @col-third-md:                              (@col-third-sm + 6);
    @col-third-lg:                              (@col-third-md + 6);
    @col-third-wd:                              (@col-third-lg + 6);

##### Not Rendered
    //--------------------------------------------------------------------------//
    //  $HEADER
    //--------------------------------------------------------------------------//
    //  Description
    //--------------------------------------------------------------------------//

    // Sub Header
    @grid-columns:                              12;

    // Sub Header (increment column third exponentially by 6)
    @col-third-sm:                              @base-grid-multiplier;
    @col-third-md:                              (@col-third-sm + 6);
    @col-third-lg:                              (@col-third-md + 6);
    @col-third-wd:                              (@col-third-lg + 6);

If you are working in one large stylesheet, you leave three (3) carriage returns
between each section, thus:

    /*------------------------------------*\
        $ELEMENTS
    \*------------------------------------*/
    [Our
    reset
    styles]



    /*------------------------------------*\
        $COMPONENTS
    \*------------------------------------*/

This large chunk of whitespace is quickly noticeable when scrolling quickly
through larger files.

## Source order

Write stylesheets in specificity order. This ensures that you take full
advantage of inheritance and CSS first.

A well ordered stylesheet will be ordered something like this:

1. **Reset** – ground zero.
1. **Base** – setup.
1. **Common** – unclassed `h1`, unclassed `ul` etc.
1. **Layout** – grid.
1. **Utilities/Modifiers/Helpers** – `form-inline`.
2. **Elements** – basic singleton classes
3. **Components** — generic, underlying design patterns.

This means that as you go down the document each section builds upon and
inherits sensibly from the previous one(s). There should be less undoing of
styles, less specificity problems and all-round better architected stylesheets.

For further reading I cannot recommend Jonathan Snook’s
[SMACSS](http://smacss.com) highly enough.

## Anatomy of rulesets

    [selector],
    [selector],
    [selector] {
        [property]: [value];
        [property]: [value];
        [<- Declaration -->]
    }
    [<-------- Rule ------>]

Standards when structuring rulesets.

* Use hyphen delimited class names
* 4 space indented
* Multi-line declarations when more than one
* Multi-line selectors when more than two `[selector], [selector]`.
* Declarations ordered by intent **Text, Decoration, Layout, Misc.** Then alphabetically
* Indent vendor prefixed declarations so that their values are aligned
* Always include the final semi-colon in a rule
* Full carriage return before/after multiple line rules
* Full carriage return after end of single line rulesets
* Opening `{` on same line as last selector with single space in between

A brief example:

    body { margin: 0 }

    article,
    aside,
    details,
    figcaption,
    figure,
    footer,
    header,
    hgroup,
    main,
    nav,
    section,
    summary { display: block }

    a { background: transparent }
    a:active, a:hover { outline: 0 }

    sub, sup {
        /* Text */
        font-size: 75%;
        line-height: 0;
        vertical-align: baseline;

        /* Decoration */
        color: gray;

        /* Layout */
        position: relative;

        /* Mics. */
        -webkit-backface-visibility: hidden;
    }

    input[type="search"] {
        -webkit-appearance: textfield;
        -webkit-box-sizing: content-box;
           -moz-box-sizing: content-box;
                box-sizing: content-box;
    }

## Naming conventions

Hyphen delimited classes (e.g. `.foo-bar`, not `.foo_bar` or `.fooBar`)

Always ensure classes are sensibly named; keep them as short as possible but as
long as necessary. Ensure any objects or abstractions are very vaguely
named (e.g. `.ui-list`, `.media`) to allow for greater reuse.

### JS hooks

**Never use a CSS _styling_ class as a JavaScript hook.** Attaching JS behavior
to a styling class means that we can never have one without the other.

If you need to bind to some markup use a JS specific CSS class. This is simply a
class namespaced with `.js-`, e.g. `.js-toggle`, `.js-drag-and-drop`. This means
that we can attach both JS and CSS to classes in our markup but there will never
be any troublesome overlap.

    <th class="is-sortable  js-is-sortable"> </th>

The above markup holds two classes; one to which you can attach some styling for
sortable table columns and another which allows you to add the sorting
functionality.

### Internationalisation

Despite being a developer from what ever corner of the world your from, weather
you spent all your life writing _colour_ instead of _color_, for the
sake of consistency, it is better to always use US-English in CSS. CSS, as with
most (if not all) other languages, is written in US-English, so to mix syntax
like `color: red;` with classes like `.colour-picker {}` lacks consistency.

## Comments

Use a docBlock-esque commenting style limited to 80 characters in length:

##### Rendered
    /*----------------------------------------------------------------------------*\
       Header
    /*----------------------------------------------------------------------------*\
       Description
    /*----------------------------------------------------------------------------*\
       1. Inline comment
    /*----------------------------------------------------------------------------*/

##### Not Rendered
    //------------------------------------------------------------------------------
    // Header
    //------------------------------------------------------------------------------
    // Description
    //------------------------------------------------------------------------------
    // 1. Inline comment
    //------------------------------------------------------------------------------

Each numbered comment refers to a commented number in the code block like so.

    .form-inline {
    @media (min-width: @screen-sm-min) { // [1]

        .form-group { // [2]

You should document and comment your code as much as you possibly can, what may
seem or feel transparent and self explanatory to you may not be to another dev.
Write a chunk of code then write about it.





## Writing CSS

The previous section dealt with how we structure and form our CSS; they were
very quantifiable rules. The next section is a little more theoretical and deals
with our attitude and approach.

## Building new components

When building a new component write markup **before** CSS. This means you can
visually see which CSS properties are naturally inherited and thus avoid
reapplying redundant styles.

By writing markup first you can focus on data, content and semantics and then
apply only the relevant classes and CSS **afterwards**.

## OOCSS

Work in an OOCSS manner; Split components into structure (objects) and
skin (extensions). As an **analogy** (note, not example) take the following:

    .room {}

    .room-kitchen {}
    .room-bedroom {}
    .room-bathroom {}

We have several types of room in a house, but they all share similar traits;
they all have floors, ceilings, walls and doors. We can share this information
in an abstracted `.room {}` class. However we have specific types of room that
are different from the others; a kitchen might have a tiled floor and a bedroom
might have carpets, a bathroom might not have a window but a bedroom most likely
will, each room likely has different colored walls. OOCSS teaches us to
abstract the shared styles out into a base object and then _extend_ this
information with more specific classes to add the unique treatment(s).

So, instead of building dozens of unique components, try and spot repeated
design patterns across them all and abstract them out into reusable classes;
build these skeletons as base `objects` and then peg classes onto these to
extend their styling for more unique circumstances.

If you have to build a new component split it into structure and skin; build the
structure of the component using very generic classes so that we can reuse that
construct and then use more specific classes to skin it up and add design
treatments.

## Layout

All components you build should be left totally free of widths; they should
always remain fluid and their widths should be governed by a parent/grid system.

Heights should **never** be be applied to elements. Heights should only be
applied to things which had dimensions _before_ they entered the site (i.e.
images and sprites). Never ever set heights on `p`s, `ul`s, `div`s, anything.
You can often achieve the desired effect with `line-height` which is far more
flexible.

Grid systems should be thought of as shelves. They contain content but are not
content in themselves. You put up your shelves then fill them with your stuff.
By setting up our grids separately to our components you can move components
around a lot more easily than if they had dimensions applied to them; this makes
our front-ends a lot more adaptable and quick to work with.

You should never apply any styles to a grid item, they are for layout purposes
only. Apply styling to content _inside_ a grid item. Never, under _any_
circumstances, apply box-model properties to a grid item.

## Sizing UIs

I use a combination of methods for sizing UIs. Percentages, pixels, ems, rems
and nothing at all.

The Grid systems is set in percentages. Because we use grid systems
to govern widths of columns and pages, we can leave components totally free of
any dimensions (as discussed above).

Font sizes are set in rems with a pixel fallback (IE 8). This gives the accessibility
benefits of ems with the confidence of pixels. There is a handy Less mixin to
work out a rem and pixel fallback for you :

    .rem-size(@selector, @size, @base: @base-font-size) {
        @{selector}: unit(@size, px);
        @{selector}: unit((@size / @base), rem);
    }

    .font-size(@font-size, @base: @base-font-size, @line-height: @base-line-height-computed) {
        .rem-size(font-size, @font-size);
        line-height: (ceil(@font-size / @line-height)*(@line-height / @font-size));
    }

Pixels are only used for items whose dimensions were defined before they came into
the site. This includes things like images and sprites whose dimensions are
inherently set absolutely in pixels.

Percentages aside from the grid system should be used to size fonts in relation
to their direct container. The percentage is best suited for this since it only
affects the content of the element its applied to in relation to the direct
parent to which it falls within. (e.g. `small`, `code`, or `.label` elements).

### Font sizing

We defined a series of classes akin to a grid system for sizing fonts. These
classes can be used to style type in a double stranded heading hierarchy. For a
full explanation of how this works please refer to this article
[Pragmatic, practical font-sizing in CSS](http://csswizardry.com/2012/02/pragmatic-practical-font-sizing-in-css)

## Shorthand

**Shorthand CSS needs to be used with caution.**

It might be tempting to use declarations like `background: red;` but in doing so
what you are actually saying is ‘I want no image to scroll, aligned top-left,
repeating X and Y, and a background colour of red’. Nine times out of ten this
won’t cause any issues but that one time it does is annoying enough to warrant
not using such shorthand. Instead use `background-color: red;`.

Similarly, declarations like `margin: 0;` are nice and short, but
**be explicit**. If you actually only really want to affect the margin on
the bottom of an element then it is more appropriate to use `margin-bottom: 0;`.

Be explicit in which properties you set and take care to not inadvertently unset
others with shorthand. E.g. if you only want to remove the bottom margin on an
element then there is no sense in setting all margins to zero with `margin: 0;`.

Shorthand is good, but easily misused.

## IDs

A quick note on IDs in CSS before we dive into selectors in general.

**NEVER use IDs in CSS.**

They can be used in your markup for JS and fragment identifiers but use only
classes for styling. We don’t want to see a single ID in any stylesheets!

Classes come with the benefit of being reusable (even if we don’t want to, we
can) and they have a nice, low specificity. Specificity is one of the quickest
ways to run into difficulties in projects and keeping it low at all times is
imperative. An ID is **255** times more specific than a class, so never ever use
them in CSS _ever_.

## Selectors

Keep selectors short, efficient and portable.

Heavily location-based selectors are bad for a number of reasons. For example,
take `.sidebar h3 span {}`. This selector is too location-based and thus we
cannot move that `span` outside of a `h3` outside of `.sidebar` and maintain
styling.

Selectors which are too long also introduce performance issues; the more checks
in a selector (e.g. `.sidebar h3 span` has three checks, `.content ul p a` has
four), the more work the browser has to do.

Make sure styles aren’t dependent on location where possible, and make sure
selectors are nice and short.

Selectors as a whole should be kept short (e.g. one class deep) but the class
names themselves should be as long as they need to be. A class of `.user-avatar`
is far nicer than `.usr-avt`.

**Remember:** classes are neither semantic or insemantic; they are sensible or
insensible! Stop stressing about ‘semantic’ class names and pick something
sensible and future proof.

### Over-qualified selectors

As discussed above, qualified selectors are bad news.

An over-qualified selector is one like `div.promo`. You could probably get the
same effect from just using `.promo`. Of course sometimes you will _want_ to
qualify a class with an element (e.g. if you have a generic `.error` class that
needs to look different when applied to different elements (e.g.
`.error { color: red; }` `div.error { padding: 14px; }`)), but generally avoid it
where possible.

Another example of an over-qualified selector might be `ul.nav li a {}`. As
above, we can instantly drop the `ul` and because we know `.nav` is a list, we
therefore know that any `a` _must_ be in an `li`, so we can get `ul.nav li a {}`
down to just `.nav a {}`.

### Selector performance

Whilst it is true that browsers will only ever keep getting faster at rendering
CSS, efficiency is something you could do to keep an eye on. Short, unnested
selectors, not using the universal (`* {}`) selector as the key selector, and
avoiding more complex CSS3 selectors should help circumvent these problems.

## CSS selector intent

Instead of using selectors to drill down the DOM to an element, it is often best
to put a class on the element you explicitly want to style. Let’s take a
specific example with a selector like `.header ul {}`…

Let’s imagine that `ul` is indeed the main navigation for our website. It lives
in the header as you might expect and is currently the only `ul` in there;
`.header ul {}` will work, but it’s not ideal or advisable. It’s not very future
proof and certainly not explicit enough. As soon as we add another `ul` to that
header it will adopt the styling of our main nav and the the chances are it
won’t want to. This means we either have to refactor a lot of code _or_ undo a
lot of styling on subsequent `ul`s in that `.header` to remove the effects of
the far reaching selector.

Your selector’s intent must match that of your reason for styling something;
ask yourself **‘am I selecting this because it’s a `ul` inside of `.header` or
because it is my site’s main nav?’**. The answer to this will determine your
selector.

Make sure your key selector is never an element/type selector or
object/abstraction class. You never really want to see selectors like
`.sidebar ul {}` or `.footer .media {}` in our theme stylesheets.

Be explicit; target the element you want to affect, not its parent. Never assume
that markup won’t change. **Write selectors that target what you want, not what
happens to be there already.**

For a full write up please see this article
[Shoot to kill; CSS selector intent](http://csswizardry.com/2012/07/shoot-to-kill-css-selector-intent/)

## `!important`

It is okay to use `!important` on helper classes only. To add `!important`
preemptively is fine, e.g. `.error { color: red !important }`, as you know you will
**always** want this rule to take precedence.

Using `!important` reactively, e.g. to get yourself out of nasty specificity
situations, is not advised. Rework your CSS and try to combat these issues by
refactoring your selectors. Keeping your selectors short and avoiding IDs will
help out here massively.

## Magic numbers and absolutes

A magic number is a number which is used because ‘it just works’. These are bad
because they rarely work for any real reason and are not usually very
future proof or flexible/forgiving. They tend to fix symptoms and not problems.

For example, using `.dropdown-nav li:hover ul { top: 37px; }` to move a dropdown
to the bottom of the nav on hover is bad, as 37px is a magic number. 37px only
works here because in this particular scenario the `.dropdown-nav` happens to be
37px tall.

Instead you should use `.dropdown-nav li:hover ul { top: 100%; }` which means no
matter how tall the `.dropdown-nav` gets, the dropdown will always sit 100% from
the top.

Every time you hard code a number think twice; if you can avoid it by using
keywords or ‘aliases’ (i.e. `top: 100%` to mean ‘all the way from the top’)
or even better no measurements at all then you probably should.

Every hard-coded measurement you set is a commitment you might not necessarily
want to keep.

## Conditional stylesheets

IE stylesheets can, by and large, be totally avoided. The only time an IE
stylesheet may be required is to circumvent blatant lack of support (e.g. PNG
fixes).

As a general rule, all layout and box-model rules can and _will_ work without an
IE stylesheet if you refactor and rework your CSS. This means you never want to
see `<!--[if IE 7]> element { margin-left: -9px; } < ![endif]-->` or other such
CSS that is clearly using arbitrary styling to just ‘make stuff work’.

## Debugging

If you run into a CSS problem **take code away before you start adding more** in
a bid to fix it. The problem exists in CSS that is already written, more CSS
isn’t the right answer!

Delete chunks of markup and CSS until your problem goes away, then you can
determine which part of the code the problem lies in.

It can be tempting to put an `overflow: hidden;` on something to hide the effects
of a layout quirk, but overflow was probably never the problem; **fix the
problem, not its symptoms.**

## Preprocessors

Less is our preprocessor of choice. **Use it wisely.** Use Less to make your CSS
more powerful but avoid nesting like the plague! Nest only when it would
actually be necessary in vanilla CSS, e.g.

    .header {}
    .header .site-nav {}
    .header .site-nav li {}
    .header .site-nav li a {}

Would be wholly unnecessary in normal CSS, so the following would be **bad**
Less:

    .header {
        .site-nav {
            li {
                a {}
            }
        }
    }

If you were to Less this up you’d write it as:

    .header {}
    .site-nav {
        li {}
        a {}
    }
