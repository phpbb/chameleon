## HTML Guidelines

Given HTML and CSS’ inherently interconnected nature, it would be remiss of to
not cover some syntax and formatting guidelines for markup.

Always quote attributes, even if they would work without. This reduces the
chance of accidents, and is a more familiar format to the majority of
developers. For all this would work (and is valid):

```html
<div class=box>
```

…this format is preferred:

```html
<div class="box">
```

The quotes are not required here, but err on the safe side and include them as
some are.

When writing multiple values in a class attribute, separate them with one
spaces, thus:

```html
<div class="foo bar">
```

As with our rulesets, it is possible to use meaningful whitespace in your HTML.
You can denote thematic breaks in content with five (2) empty lines, for
example:

```html
<header class="page-head">
	...
</header>


<main class="page-content">
	...
</main>


<footer class="page-foot">
	...
</footer>
```

Separate independent but loosely related snippets of markup with a single empty
line, for example:

```html
<ul class="primary-nav">

	<li class="primary-nav-item">
		<a href="/" class="primary-nav-link">Home</a>
	</li>

	<li class="primary-nav-item  primary-nav-trigger">
		<a href="/about" class="primary-nav-link">About</a>

		<ul class="primary-nav-sub-nav">
			<li><a href="/about/products">Products</a></li>
			<li><a href="/about/company">Company</a></li>
		</ul>

	</li>

	<li class="primary-nav-item">
		<a href="/contact" class="primary-nav-link">Contact</a>
	</li>

</ul>
```

This allows developers to spot separate parts of the DOM at a glance, and also
allows certain text editors—like Vim, for example—to manipulate
empty-line-delimited blocks of markup.


### Naming Conventions in HTML

Naming conventions aren’t necessarily all that useful in your CSS. Where naming
conventions’ power really lies is in your markup. Take the following,
non-naming-conventioned HTML:

```html
<div class="box profile pro-user">

	<img class="avatar image" />

	<p class="bio">...</p>

</div>
```

How are the classes `box` and `profile` related to each other? How are the
classes `profile` and `avatar` related to each other? Are they related at all?
Should you be using `pro-user` alongside `bio`? Will the classes `image` and
`profile` live in the same part of the CSS? Can you use `avatar` anywhere else?

From that markup alone, it is very hard to answer any of those questions. Using
a naming convention, however, changes all that:

```html
<div class="box profile profile-pro-user">

	<img class="avatar  profile-image" />

	<p class="profile-bio">...</p>

</div>
```

Now we can clearly see which classes are and are not related to each other, and
how; we know what classes we can’t use outside of the scope of this component;
and we know which classes we may be free to reuse elsewhere.
