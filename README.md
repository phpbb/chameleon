phpBB-StyleGuide
====================

This is a project dedicated to simplifying & streamlining the build process for theming in phpBB.
The goal of this is three stages.

1. Develop a core framework to easily and rapidly build all future themes from.
2. Setup a test driven environment for rapid prototyping of individual elements & components for a theme.
3. Provide a quick and easy reference to all the colors, fonts, elements, & components and how they work. This will act as an self perpetuating instruction manual for new users.

###Project Layout
The project is broken up into three parts.

1. __gh-pages__: which serves as the reference and documentation for the theme
2. __core__: which house the latest version of the core part of the framework.
3. __theme__: which house the latest version of the current theme

each have their own __develop__ branch as well, where all the development for the next version takes place.

###How to Contribute

####Basics
For the most part contribution is very similar to the main phpBB project, only we are using github issues instead of JIRA. We are using git-flow so simply fork the repo. Then create an issue related to your contribution and submit a pull request against it. Their are two types of issues New Features or Bug fixes/Improvements.

1. __feature__: This is a completely new feature and should be prefixed as such so feature/feature_name.
2. __ticket__: This is a bug fix or improvement and should be prefixed as so ticket/issue#.

####Pull Requests
As pointed out above please create pull requests from branches following the appropriate git-flow scheme. Your title should be the same as the issue prepended by the issue number like soo `[234] Issue Title`. Make sure to include a link to the issue it is related to in the pull request comment as well for faster review.

####Coding Standards
We are following strict coding standards. For the most part they are based off http://cssguidelin.es/ and are detailed below.

* [CSS](https://github.com/hanakin/PHPBB-StyleGuide/tree/gh-pages/Coding%20Guidlines/CSS#sizing-uis)
* JS - Coming Soon!
* HTML - Coming Soon!


#### The Disscussion related to this project
Feel free to participate in all the discussions related to the project listed in detail here: https://area51.phpbb.com/phpBB/viewtopic.php?f=81&t=45855

###Build Process
We are using gulp as our build tool to perform all of our tasks such as rendering, sorting, formating, minifying, linting, etc.

## LICENSE
[MIT License](http://opensource.org/licenses/MIT)
