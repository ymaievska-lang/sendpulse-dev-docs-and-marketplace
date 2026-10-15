# App Directory UI Kit

Make your app page look native inside SendPulse with one stylesheet and predefined classes for text, forms, tables, buttons and images. The class names follow Bootstrap 3 conventions.

## Install

Add to the `<head>` of your app page. No other setup.

```html
<link rel="stylesheet" href="https://cdn.sendpulse.com/dist/css/sp-marketplace-app-ui.min.css">
```

Figma components: https://www.figma.com/design/35Pifp7O3PssNIutU2JM9Q/SendPulse-App-Marketplace-UI-Kit

## Minimal app page

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://cdn.sendpulse.com/dist/css/sp-marketplace-app-ui.min.css">
  <title>My SendPulse app</title>
</head>
<body>
  <h1>Settings</h1>
  <p class="lead">Connect your store to SendPulse mailing lists.</p>

  <form>
    <div class="form-group">
      <label for="list">Mailing list</label>
      <select id="list" class="form-control"></select>
      <p class="help-block">New customers will be added to this list.</p>
    </div>
    <div class="checkbox">
      <label><input type="checkbox" checked> Sync existing customers</label>
    </div>
    <button type="submit" class="btn btn-primary">Save</button>
    <button type="button" class="btn btn-default">Cancel</button>
  </form>

  <table class="table blue-table table-hover">
    <thead><tr><th>Date</th><th>Contacts synced</th><th>Status</th></tr></thead>
    <tbody><tr class="success"><td>2026-10-14</td><td>120</td><td>OK</td></tr></tbody>
  </table>
</body>
</html>
```

## Typography

- Base font 16px, line-height 1.428. `.lead` for intro text.
- Headings: `h1` 40px bold, `h2` 24px bold, `h3` 20px, `h4` 18px, `h5` 16px, `h6` 14px. Classes `.h1`–`.h6` apply heading style to any element. `<small>` / `.small` for secondary text inside headings.
- Inline: `<mark> <del> <s> <ins> <u> <small> <strong> <em> <abbr>` (`.initialism`), `<blockquote>` (`.blockquote-reverse`).
- Code: `<code> <kbd> <pre>` (`.pre-scrollable`, max 350px) `<var> <samp>`.
- Lists: `<ul> <ol> <dl>`, `.list-unstyled`, `.list-inline`.
- Alignment: `.text-left .text-center .text-right .text-justify .text-nowrap`. Case: `.text-uppercase .text-lowercase .text-capitalize`.

## Tables

`.table` (base), `.blue-table` (SendPulse default style), `.table-striped`, `.table-bordered`, `.table-hover`, `.table-condensed`, `.table-responsive` (wrapper, horizontal scroll under 768px).
Row/cell states: `.active .success .info .warning .danger`.

## Forms

- `.form-control` for `<input>`, `<textarea>`, `<select>`. Date/time: `.form-control-date`, `.form-control-time`. Read-only text: `.form-control-static`. Hints: `.help-block`.
- Layouts: block, `.form-inline`, `.form-horizontal`.
- Input groups: `.input-group` + `.input-group-addon`.
- Checkbox/radio: `.checkbox .radio .checkbox-inline .radio-inline`, `.disabled` wrapper.
- Validation: `.has-success .has-warning .has-error`, `.has-feedback` + `.form-control-feedback`, icons `.sp-icon icon-check`, `.sp-icon icon-warning`, `.sp-icon icon-closed`.
- Sizing: `.input-lg .input-sm .form-group-lg .form-group-sm`, grid `.col-xs-2/3/4`.
- Disable with `disabled` attribute or `<fieldset disabled>`.

## Buttons

`.btn` + `.btn-default .btn-primary .btn-success .btn-info .btn-warning .btn-danger .btn-link`.
Sizes: `.btn-lg .btn-sm .btn-xs .btn-block`. States: `.active .disabled`.
Inside `nav` / `navbar` use `<button>` elements only.

## Images

`.img-responsive`, `.center-block`, `.img-rounded`, `.img-circle`, `.img-thumbnail`.

## Helpers

- Text color: `.text-muted .text-primary .text-success .text-info .text-warning .text-danger`.
- Background: `.bg-primary .bg-success .bg-info .bg-warning .bg-danger`.
- Visibility: `.show .hidden .invisible .sr-only`.
- Misc: `.close` (add `aria-label="Close"`), `.caret`.

Accessibility: don't rely on color alone; add `.sr-only` text or `aria-*` attributes for states.
