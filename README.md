Chameleon
=========

The phpBB default style

The focus right now is on the templates. How exactly we're going to implement the build-system and preprocessors remains to be seen.

The `*.html` (not .twig) templates currently in the repo are temporary. They will be removed once the template names are no longer hard-coded in the backend.

---------

Style guide: http://hanakin.github.io/phpBB-StyleGuide/

CSS coding guidelines: https://github.com/hanakin/phpBB-StyleGuide/tree/gh-pages/Coding%20Guidlines/CSS

---------

__Proposed structure__
- `assets/`
  - `css/`
  - `images/`
  - `js/`
- `template/` (or `templates/` or `views/`)
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
    - `forumlist.html.twig`
    - `forumrow.html.twig`
    - `macros.html.twig`
    - `nav_footer.html.twig`
    - `nav_header.html.twig`
    - `pagination.html.twig`
    - `poll.html.twig`
    - `postrow.html.twig`
    - `postprofile.html.twig`
    - `sidebar.html.twig`
    - `topiclist.html.twig`
    - `topicrow.html.tiwg`
    - etc.
  - `mcp/`
    - `includes/`
      - all mcp components
    - `mcp_*.html.twig`
  - `ucp/`
    - `includes/`
      - all ucp components
    - `ucp_*.html.twig`
- `composer.json` (previously `style.cfg`)
