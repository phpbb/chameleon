# Getting Started
The framework is meant to allow for adaptability. As such you can use it in a
number of ways to fit your needs.

## Production Usage
To use the framework in its simpleist form as a base for your project, simply
include the following in your project head.

```html
<link rel="stylesheet" href="https://cdn.rawgit.com/hanakin/base-l/05504206/dist/assets/css/core.0.12.0.css">
```

## Development Usage
!> To gain the full benefits of the framework as its intended, you need to use it in development.

Start by cloneing the repo
```git
git clone git@github.com:hanakin/base-l.git
```

Install all the dependencies by running
```bash
npm install
```

All the magic lives in the `src/scss` folder. To build everything simply run
`gulp`.

?> by default everything builds in the `dist/assets/css` folder, but this can be configured to work with your project.

For detailed information about the setup and configuration of the framework see
the [Framework Usage](/usage) section.
