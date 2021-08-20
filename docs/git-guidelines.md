## Contributing to this project

Please take a moment to review this document in order to make the contribution
process easy and effective for everyone involved.

Following these guidelines helps to communicate that you respect the time of
the developers managing and developing this open source project. In return,
they should reciprocate that respect in addressing your issue or assessing
patches and features.


## Branches
The project contains several branches

- **master** This is the development branch. All work for the next major version happens here.
- **v.x** This is a release branch. All minor fixes will happen here.
- **phpbb** This is the component branch for the development of components for the next theme for phpbb.


## Using the issue tracker

The issue tracker is the preferred channel for [bug reports](#bugs),
[features requests](#features) and [submitting pull requests](#pull-requests),
but please respect the following restrictions:

* Please **do not** derail or troll issues. Keep the discussion on topic and respect the opinions of others.


## Bug reports

A bug is a _demonstrable problem_ that is caused by the code in the repository.
Good bug reports are extremely helpful - thank you!

Guidelines for bug reports:

1. **Use the GitHub issue search** &mdash; check if the issue has already been reported.

2. **Check if the issue has been fixed** &mdash; try to reproduce it using the latest `master` or development branch in the repository.

3. **Isolate the problem** &mdash; create a
[reduced test case](http://css-tricks.com/reduced-test-cases/) and a live
example.

A good bug report shouldn't leave others needing to chase you up for more
information. Please try to be as detailed as possible in your report. What is
your environment? What steps will reproduce the issue? What browser(s) and OS
experience the problem? What would you expect to be the outcome? All these
details will help people to fix any potential bugs.

Example:

> Short and descriptive example bug report title
>
> A summary of the issue and the browser/OS environment in which it occurs. If
> suitable, include the steps required to reproduce the bug.
>
> 1. This is the first step
> 2. This is the second step
> 3. Further steps, etc.
>
> `<url>` - a link to the reduced test case
>
> Any other information you want to share that is relevant to the issue being
> reported. This might include the lines of code that you have identified as
> causing the bug, and potential solutions (and your opinions on their
> merits).


## Feature requests

Feature requests are welcome. But take a moment to find out whether your idea
fits with the scope and aims of the project. It's up to _you_ to make a strong
case to convince the project's developers of the merits of this feature. Please
provide as much detail and context as possible.


## Pull requests

Good pull requests - patches, improvements, new features - are a fantastic and
help. They should remain focused in scope and avoid containing unrelated
commits.

**Please ask first** before embarking on any significant pull request (e.g.
implementing features, refactoring code, porting to a different language),
otherwise you risk spending a lot of time working on something that the
project's developers might not want to merge into the project.

All pull requests should be tied to a reported issue for proper tracking. This
is accomplished by adding a link to the issue in your pull request message

Please adhere to the coding conventions used throughout the project
(indentation, accurate comments, etc.) and any other requirements (such as test
coverage).

Follow this process if you'd like your work considered for inclusion in the
project:

1. [Fork](http://help.github.com/fork-a-repo/) the project, clone your fork, and configure the remotes:

	```bash
	# Clone your fork of the repo into the current directory
	git clone https://github.com/<your github account name>/base-l
	# Navigate to the newly cloned directory
	cd base-l
	# Assign the original repo to a remote called "upstream"
	git remote add upstream https://github.com/hanakin/basel
	```

2. If you cloned a while ago, get the latest changes from upstream:

	```git
	git checkout <branch>
	git pull upstream <branch>
	```

3. Create a new topic branch (off the main project development branch) to contain your feature, change, or fix:

	```git
	git checkout -b <topic-branch-name>
	```

4. Commit your changes in logical chunks. Use Git's [interactive rebase](https://help.github.com/articles/interactive-rebase) feature to tidy up your commits before making them public.

5. Locally merge rebase the correct upstream branch into your topic branch:

	```git
	git pull --rebase upstream <branch>
	```

6. Push your topic branch up to your fork:

	```git
	git push origin <topic-branch-name>
	```

7. [Open a Pull Request](https://help.github.com/articles/using-pull-requests/) with a clear title and description.

?> **IMPORTANT**: By submitting a patch, you agree to allow the project owner to license your work under the same license as that used by the project.
