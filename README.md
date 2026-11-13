# EZMin

A lightweight, zero-dependency JavaScript class and stylesheet for managing the minimize and restore lifecycle of any DOM element.

## Files

- `src/EZMin.js` — Core `EZMin` controller class.
- `src/ez-min.css` — Base visibility rule (`[data-minimized="true"]`) and default button styles (`.minimize-btn`, `.restore-btn`).

## Quick Start

Include the stylesheet and script in your HTML, then instantiate `EZMin` and call `.init()`:

```html
<link rel="stylesheet" href="src/ez-min.css">

<div id="my-panel">
  <div class="panel-header">
    <h2>Panel Title</h2>
  </div>
  <p>Panel content goes here.</p>
</div>

<script src="src/EZMin.js"></script>
<script>
  const panel = new EZMin({
    target: 'my-panel',
    minimize: {
      parentSelector: '.panel-header'
    }
  });

  panel.init();
</script>
```

## Configuration

`new EZMin(options)` accepts the following options:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `target` | `string \| Element` | **Required** | Target DOM element or its element `id`. |
| `initialState` | `'normal' \| 'minimized'` | `'normal'` | Initial visibility state applied during `init()` (does not fire `onMinimize`/`onRestore`). |
| `minimize` | `Object` | `{}` | Configuration for the generated minimize button (see below). |
| `restore` | `Object` | `{}` | Configuration for the generated restore button (see below). |
| `onMinimize` | `(target: Element) => void` | `() => {}` | Callback invoked after the target is minimized. |
| `onRestore` | `(target: Element) => void` | `() => {}` | Callback invoked after the target is restored. |

### `minimize` Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `parentSelector` | `string \| null` | `null` | CSS selector queried inside `target` where the minimize button is appended. Defaults to appending directly to `target`. |
| `tag` | `string` | `'button'` | HTML tag name for the button element. |
| `id` | `string \| null` | `null` | Optional `id` attribute for the button. |
| `className` | `string` | `'minimize-btn'` | CSS class(es) applied to the button. |
| `text` | `string` | `'−'` | Inner text or HTML (`innerHTML`) for the button. |
| `title` | `string` | `'Minimize'` | Tooltip (`title` attribute) for the button. |

### `restore` Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `parent` | `string \| Element \| null` | `null` | Element (or element `id`) to append the restore button into. When `null`, the button is inserted immediately after `target`. |
| `tag` | `string` | `'button'` | HTML tag name for the button element. |
| `id` | `string \| null` | `null` | Optional `id` attribute for the button. |
| `className` | `string` | `'restore-btn'` | CSS class(es) applied to the button. |
| `text` | `string` | `'+'` | Inner text or HTML (`innerHTML`) for the button. |
| `title` | `string` | `'Restore'` | Tooltip (`title` attribute) for the button. |

## Methods

- **`init()`** — Resolves the target element, creates and injects the minimize/restore buttons, binds click listeners, and applies `initialState`.
- **`minimize()`** — Minimizes the target element, reveals the restore button, and triggers `onMinimize(target)`.
- **`restore()`** — Restores the target element, hides the restore button, and triggers `onRestore(target)`.
- **`destroy()`** — Removes event listeners, deletes the injected minimize and restore buttons from the DOM, and cleans up state attributes/classes on the target element.

## Styling & DOM State

When managed by `EZMin`, the target element receives the following state markers:

- `data-minimized="true" | "false"` — Used by `src/ez-min.css` to hide minimized elements via `display: none !important;`.
- `.is-minimized` — Added to the target element while minimized and removed when restored, useful as an additional CSS hook.

Default button styles in `src/ez-min.css` target `.minimize-btn` and `.restore-btn`. You can customize or override these classes, or supply your own via `minimize.className` and `restore.className`.

## Example with All Options

```js
const widget = new EZMin({
  target: document.getElementById('widget'),
  initialState: 'minimized',
  minimize: {
    parentSelector: '.widget-header',
    className: 'minimize-btn custom-min',
    text: 'Hide',
    title: 'Collapse widget'
  },
  restore: {
    parent: 'restore-dock',
    className: 'restore-btn custom-restore',
    text: 'Show Widget',
    title: 'Expand widget'
  },
  onMinimize(el) {
    console.log('Minimized:', el.id);
  },
  onRestore(el) {
    console.log('Restored:', el.id);
  }
});

widget.init();
```

## License

Released under the [MIT License](LICENSE.md).