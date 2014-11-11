Chameleon
=========

The phpBB default style

__Commits__:
````
[chameleon] Commit Message

PHPBB3-13327
````

In order to automatically have this added to all commit messages (and to have all
your commit messages checked upon committing) please run the following in your terminal:
````
cd git-tools/hooks
./install
````

_Note_: The `*.html` (not .twig) templates currently in the repo are temporary. They will be removed once the template names are no longer hard-coded in the backend.

---------

Style guide: http://hanakin.github.io/phpBB-StyleGuide/

CSS coding guidelines: https://github.com/hanakin/phpBB-StyleGuide/tree/gh-pages/Coding%20Guidlines/CSS

Trello: https://trello.com/b/gdHw0JBq

---------

__Proposed structure__
- `assets/`
  - `dist/` (compiled CSS and JS (with minified versions))
    - `core.css`
    - `core.min.css`
    - `core.css.map`
    - `theme.css`
    - `theme.min.css`
    - `theme.css.map`
    - `scripts.js`
    - `scripts.min.js`
    - `scripts.js.map`
  - `images/`
  - `src/`
	- `css/` (or `less/`)
	- `js/`
- `template/`
  - `base.html.twig`
  - `base_simple.html.twig`
  - `faq.html.twig`
  - `index.html.twig`
  - `mcp.html.twig`
  - `members.html.twig` (previously `memberlist_body.html`)
  - `posting.html.twig`
  - `search_form.html.twig`
  - `search_results.html.twig`
  - `ucp.html.twig`
  - `viewforum.html.twig`
  - `viewonline.html.twig`
  - `viewprofile.html.twig` (previously `memberlist_view.html`)
  - `viewtopic.html.twig`
  - `includes/` (or `components/`)
    - `components/`
      - `forum_row.html.twig`
      - `poll.html.twig`
      - `post_row.html.twig`
      - `post_profile.html.twig`
      - `topic_row.html.twig`
      - etc
    - `dialogs/`
      - `captcha_*`
      - `confirm.html.twig`
      - `login.html.twig`
      - `report.html.twig`
      - etc.
    - `posting/`
      - all posting components
    - `profile_fields/`
      - all profile field components
    - `breadcrumbs.html.twig`
    - `display_sorting.html.twig`
    - `forum_list.html.twig`
    - `macros.html.twig`
    - `nav_footer.html.twig`
    - `nav_header.html.twig`
    - `pagination.html.twig`
    - `sidebar.html.twig`
    - `topic_list.html.twig`
    - etc.
  - `mcp/`
    - `components/`
      - `ban_row.html.twig`
      - `log_row.html.twig`
      - `report_row.html.twig`
    - `mcp_ban.html.twig`
    - `mcp_*.html.twig`
  - `ucp/`
    - `components/`
      - `attachment_row.html.twig`
      - `notification_row.html.twig`
      - `pm_row.html.twig`
      - etc.
    - `ucp_attachments.html.twig`
    - `ucp_*.html.twig`
- `composer.json`
- `gulpfile.js`
- `package.json`
- `templates.json` (for the new template abstraction layer)
- `README.md`
- `style.cfg` (temporary, until we switch to composer.json)
