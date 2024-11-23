export const themes = `
# Themes

## Buttons

At a glance:

* Should all activate consistently (see references) and manage focus
* Outside of forms, should handle disabled state consistently + accessibly (use \`aria-disabled\` attribute, control with javascript, show tooltip on keyboard + mouse focus)
* Should be resilient to repetitive presses

Design thinking: when to use buttons vs links

* Call to action links are visually styled as buttons
* If it’s not a call to action or menubar item, change it to a link
* Trailing visuals help indicate when a button is actually a link

### Required reading: Buttons

1. Comprehensive explanation of buttons, particularly on focus management for button-triggered interactions
    * [APG Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/) > Keyboard Interaction
    * _caution: don’t refer to their guidance on semantic usage_
2. Quick reference of keyboard interaction
    * [Web AIM Keyboard A11y](https://webaim.org/techniques/keyboard/) > Keyboard Testing Chart > Buttons
3. Common alternatives to tooltips
    * [Primer / Interface guidelines > Tooltip Alternatives](https://primer.style/design/accessibility/tooltip-alternatives)
    * _why: tooltips and buttons often go together; helps to know some other ways to give all the information without relying on tooltips if we find ourselves gravitating toward that_
4. Dialogs
    * [Primer / Interface guidelines > Dialog#Accessibility](https://primer.style/design/components/dialog#accessibility)
    * _why: some corresponding context around button &lt;> dialog relationships_
5. How to disable buttons accessibly
    * GH A11y Wiki > Disabled button patterns
    * _why: we need consistent accessible disabling of buttons_
    * See tracking issue for work: [Determine a paved path for disabled buttons and tooltips](https://github.com/github/accessibility/issues/2061)
6. Buttons that are Links: Calls to Action and when to use them
    * [GH A11y Wiki > Calls to Action](https://github.com/github/accessibility/blob/e8baf459ab8850b62c0378e0959469f5e29c57e9/docs/wiki/call-to-action.md)
    * _why: how to know if this button needs to be a link, and what behaviors are expected with that_

## Dialogs

At a glance:

* Use Primer component: [Primer React Dialog (alpha)](https://primer.style/react/Dialog)
* Where are all the dialogs and do they adhere to conventions
* Triggering elements should be buttons that receive focus when dialog closes

### Terminology

* **modal dialog**: blocks interaction with the rest of the page by trapping focus
* **non-modal dialog**: allows interactions to continue with the surrounding page

### Required reading: Dialogs

1. GitHub design and interaction decisions for modal dialogs
    * [Primer | Interface guidelines > Dialog](https://primer.style/design/components/dialog#accessibility)

### Optional reading: Dialogs

1. Dialogs are messy. Be prepared for a lot of reading. 
    * [whatwg/html issue > Clarify UX and a11y expectations for modeless dialogs](https://github.com/whatwg/html/issues/7707) by Scott O’Hara
    * [whatwg/html wiki > Dialog initial focus, a proposal](https://github.com/whatwg/html/wiki/dialog--initial-focus,-a-proposal) by Scott O’Hara
    * [whatwg/html issue > Allow modal dialogs to trap focus, avoiding tabbing to the URL bar](https://github.com/whatwg/html/issues/8339) by 
    * [Having an open dialog](https://www.scottohara.me/blog/2019/03/05/open-dialog.html) by Scott O’Hara
    * [Dialogs, modality and popovers seem similar. How are they different?](https://hidde.blog/dialog-modal-popover-differences/) by Hidde de Vries
    * [a11y-dialog accessible component](https://a11y-dialog.netlify.app/) by Kitty Giraudel, before &lt;dialog> got more support
    * [MDN entry on &lt;dialog>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)

### Links included for completeness: Dialogs

1. Blog post announcing experimental dialog component in dotcom
    * [GH A11y Wiki > Post: New Experimental Dialog Component](https://github.com/github/accessibility/blob/072796bb1025ed6fbe9f76d34078982e74fb0935/posts/new-experimental-component.md) by [780 words, graduate level]



## Flash Notifications

At a glance:

* alerts are generally not recommended
* if you must use them, definitely prefer existing components, or be cognizant of the various semantic and behavioral needs 

Design thinking: substitutes for alerts

* allow form submission and error summaries to enable interactions
* if assets are unavailable or fail to load, show error pages

### Terminology: Flash Notifications

**Alerts**, **flash notifications**, **toasts**, **error messages**, can all refer to the overlaid element at the top of the page meant to quickly grab someone’s attention but not be interactive, beyond closing or following a link for more information.

### Required reading: Flash Notifications

1. Nuances around alerts and how to structure them 
    * [Live regions and screen reader announcements](https://github.com/github/thehub/blob/main/docs/epd/engineering/dev-practicals/frontend/accessibility/readiness-routine/screenreaders/live-regions-and-screen-reader-announcements.md) by  [2700 words, graduate level]

### Optional reading: Flash Notifications

1. [Flash testing in Rails on dotcom](https://github.com/github/accessibility/blob/main/docs/wiki/flash.md)

## Focus Management

At a glance:

* Opening and closing dialogs
* Navigating back and forth between pages to preserve state and reduce tabstops
* <kbd>Mod</kbd> + <kbd>F6</kbd> to allow keyboard navigation between all side content and main content, with one shortcut

Design thinking: focus should map to user attention

* Think about failure states and errors
* If an action makes a large leap across the page, can the user get back?
* Focus indicators should reassure a user of their location on a page

### Required reading: Focus Management

1. Comprehensive explanation of focus management
    * [Primer Interface Guidelines > Focus Management](https://primer.style/design/accessibility/focus-management)
    * _why: topic overview; inclusion of complex topics like item removal when filtering_
2. Quick reference for usability basics around focus
    * [WCAG, but in language I can understand](https://www.tempertemper.net/blog/wcag-but-in-language-i-can-understand) > (Search for all “focus” occurrences)
    * _why: focus order, not having side effects, some other principles_
3. Common alternatives to tooltips
    * [Primer / Interface guidelines > Tooltip Alternatives](https://primer.style/design/accessibility/tooltip-alternatives)
    * _why: tooltips can’t receive focus_

## Headings and Landmarks

At a glance:

* Have we performed a heading audit?
* Does it match accessibility design guidance? 

Design thinking: headings and landmarks serve as waypoints for screen reader users

* Can you jump around a page comfortably, with the page structure?
* When you’re in the middle of a task, do the headings support your needs?

### Required reading: Headings and Landmarks

1. Accessible headings, how people use them, tools to support development, and more references
    * [Accessible heading structure](https://www.a11yproject.com/posts/how-to-accessible-heading-structure/) by Rian Rietveld on The A11y Project [2700 words, college level]


## Keyboard Navigation Conventions

At a glance:

* Tabs
* Accordions
* Complex dropdown mechanisms (select panel, branch pickers, e.g.)

Design thinking: if you find yourself bending a known pattern to fit your needs, consider composing your needs from more basic elements. This is an easy way to avoid needing to innovate on new, surprising patterns. 

### Required reading: Keyboard Navigation Conventions

1. Keyboard accessibility overview and quick reference
    * [WebAIM Keyboard Accessibility article](https://webaim.org/techniques/keyboard/) [800 words, graduate level]
2. Accordion keyboard conventions
    * [APG > Accordion](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/) [700 words, graduate level]
    * _(only for behavior, not for semantic specification)_
3. Index of common patterns, keyboard conventions
    * [APG Common Patterns Index](https://www.w3.org/WAI/ARIA/apg/patterns/) _(only for behavior, not for semantic specification)_


## Mouse-Keyboard Parity

At a glance:

* Prefer not to hide information behind hover content
* If it appears on mouseover it should appear on focus
* If it’s activated on click, it’s also activated on enter
* Refer to accessibility design's guidance on hovercard keyboard support
  * on focus, hovercard becomes visible
  * jump into hovercard
  * on some keyboard shortcut, hovercard closes while focus remains on triggering element


### Required reading: Mouse-Keyboard Parity

1. Common alternatives to tooltips
    * [Primer / Interface guidelines > Tooltip Alternatives](https://primer.style/design/accessibility/tooltip-alternatives)
    * _why: tooltips aren’t always the best pattern to use for surfacing information_


## Scrolling

At a glance:

* Don’t break browser-native scrolling (up and down arrows, etc)
* Be cautious of introducing state-ful scrolling, which requires accessible implementations

### Required reading: Scrolling

1. Scrolling and event propagation are linked
    * [JavaScript Events, Keyboard Shortcuts, and You](./javascript_events.md)

### Optional reading: Scrolling

1. Concerns around rich scrolling, like infinite scroll, lazy loading, and virtualization
    * [So You Think You’ve Build a Good Infinite Scroll ](https://adrianroselli.com/2014/05/so-you-think-you-built-good-infinite.html)by Adrian Roselli [1300 words, college level]
    * _why: includes concerns to anticipate when introducing things like virtualization, lazy loading, and generally state-ful or custom scrolling_

## Tab Order

At a glance:

* Make sure the user never goes backwards when interacting with new content
* Is anything redundant?
* Is anything outside of tab order?

### Required reading: Tab Order

1. Keyboard accessibility overview and quick reference
    * [WebAIM Keyboard Accessibility article](https://webaim.org/techniques/keyboard/) [800 words, graduate level]

## Text Truncation

At a glance:

* If some non-interactive content (e.g. a filename) exceeds the width of a parent container, it needs to overflow accessibly, and wrapping is generally preferred to truncation via ellipses (...)
* If truncation **must** be done, we don’t yet have guidance for that

Design thinking: truncation of non-interactive elements is the most difficult to be made accessible

### Required reading: Text Truncation

1. When CSS affects content on the page
    * [A11y Internal Wiki > CSS and the Accessibility Tree](https://github.com/github/accessibility/blob/main/docs/css-a11y-tree.md)

### Optional reading: Text Truncation

1. Works in progress to determine guidance
    * Non-interactive elements
    * [[Story] Add accessibility guidelines for truncation #1886](https://github.com/github/accessibility/issues/1886)
    * [Primer Interface Guidelines > Progressive Disclosure](https://primer.style/design/ui-patterns/progressive-disclosure#progressive-disclosure-ui-patterns)
    * [Andri’s question Nov 10 in design about text-overflow: ellipsis](https://github.slack.com/archives/C03RM57QL64/p1668022347533609)
    * [Kate's question Sept 16 in design about truncation on non-interactive elements](https://github.slack.com/archives/C03RM57QL64/p1663353759372179)
    * Interactive elements
    * [team internal wiki > Tooltips and \`aria-labelledby\` verbosity](https://github.com/github/accessibility/blob/main/docs/wiki/tooltips-verbosity.md) (interactive)
    * [PVC PR to add Tooltip to NavigationList::Item](https://github.com/primer/view_components/issues/1289) (interactive)
`