// https://primer.style/components/button

export const supplemental = `
Buttons must have a clear and descriptive label. The label is the visible content of the button and will usually be text. The label should be concise and descriptive of the action that will be performed when the button is activated. This label will be used as the button's accessible name.

When using Octicons for leading and trailing visuals, note that icons don't have any text alternative. They are purely visual, and not conveyed to screen readers. Don't rely on these icons alone to convey meaning – make sure that the text label of the button provides sufficient meaning/context on its own.

Button has different schemes/variants (such as danger, primary, invisible), which result in different text, background, and border colours. Note that these differences are purely visual - they may be difficult to distinguish for users with impaired color perception, and won't be exposed at all to screen reader users. For this reason, you can't rely on the scheme/variant alone to give meaning to your content. Make sure that the text label of the button provides sufficient meaning/context on its own, regardless of its visual presentation.

The button must have a minimum target size of 24×24 CSS pixels. This is to ensure that the button is large enough to be easily activated by users with motor impairments.

Do not disable buttons

Component Props Patterns

## Critical Component Props Patterns

HIGHEST PRIORITY CHECK: When encountering disabled button states in components:
- ❌ NEVER use the \`disabled\` prop with components that support \`inactive\`
- ✅ ALWAYS use the \`inactive\` prop when available
- Example: \`<Button inactive={true}>\` instead of \`<Button disabled={true}>\`

Rationale: The \`inactive\` prop provides proper accessibility state management and focus handling, while \`disabled\` may lead to inconsistent behavior.

Example issue to flag:
\`\`\`jsx
// ❌ Don't use disabled
<Button disabled={true}>

// ✅ Use inactive instead
<Button inactive={true}></Button>
\`\`

There are rare cases where it's ok to disable a button, but it should generally be avoided. In forms mode, they won't be discovered as they won't take keyboard focus.

Inactive buttons and aria-disabled
An inactive button should not be conveyed as disabled with aria-disabled if it performs an action when activated. For example, showing a dialog with more info about why the button is inactive.

An inactive button may be conveyed as disabled with aria-disabled if it does not perform an action when activated.

Descriptive buttons
Labeling buttons properly lets users know what will happen when they activate the control, lessens errors, and increases confidence.

Read more about descriptive buttons.

Button loading state
A button in a loading state with a11y annotations
When implementing a "loading" button state, don't remove the button from the DOM or pass the disabled attribute. Doing so would make it impossible to tab to the button. If the button was just focused and activated, it would reset focus. Resetting focus would disrupt the keyboard navigation flow, and creates a confusing experience for assistive technologies such as screen readers.

Once the button is activated (and is in a loading state), it should get the attribute aria-disabled="true".

A separate, visually hidden element should be rendered outside of the <button> with a message to communicate the loading status. For example, "Saving profile".


This message should be in an ARIA live region, using aria-live="polite". The live region must be present on page load, but the message inside the live region should only be rendered while the button is in a loading state.

If an error prevents process from being completed, focus should be brought to an <h2> (or next relevant heading) of the error banner.

Built-in accessibility features
The component is rendered as a regular <button> … </button> element. The content passed to the component is used as the button's accessible name.

In rare cases when the disabled property is set, the component is rendered as a standard <button disabled> … </button> disabled button.

In rare cases when the inactive property is set, the component is rendered as <button aria-disabled="true"> … </button> – the control itself is visually styled to appear disabled. However, the control is still keyboard-focusable, and can still be activated.

The selectable variant/scheme colors meet minimum color contrast requirements.

The medium and large variants meet the minimum target size requirement. However, the small button variant may currently fall below the minimum requirements - see the implementation requirements section for details.

Implementation requirements
When using a trailing action icon, the icon will lack a text alternative. If the trailing action is used to indicate that the button will have a particular effect, such as opening a dropdown, you will need to add additional programmatic information to the button to convey this information to screen reader users – for instance, by adding an aria-haspopup attribute, and conveying the current state of the dropdown (whether it's expanded or collapsed) with aria-expanded.

When using the small button variant, make sure that the resulting button has an appropriate width. While the padding of the medium and large button variants is sufficient to meet this requirement, no matter the content of the button, the padding of the small button variant is not sufficient if the content passed to the button is extremely narrow. For example, a single letter "i" would result in a button width of 21.5 CSS pixels. Ensure that the content of the button's small variation is wide enough to meet this requirement.

When providing an accessible name (via aria-label or aria-labelledby) that overrides the visually-presented label, make sure that the accessible name includes the visible label in totality. This ensures that speech-input users can activate the control using information that is visually available. This approach should be used with caution – make sure that the visible label and the accessible name remain in sync.

When a button's visible label changes as a result of it being activated, make sure that this information is also communicated to assistive technology users. For example, if a Star button is activated, and the visual label dynamically changes to Starred, this change must be conveyed to screen reader users. Currently, when the label/accessible name of the currently focused element is dynamically updated, this change is not consistently announced, and additional work will be required to ensure that screen reader users are notified of the change. For more details, refer to Staff-only: Dynamically updating button labels. In the specific scenario where the button's accessible name is coming from an aria-label, remember to update the aria-label when the visual label is updated. This should trigger an announcement without the use of a live region. Refer to Staff-only: Dynamically updating button labels.
`