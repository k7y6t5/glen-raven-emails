# Email tricks :metal:

## Meta

* I'm unsure about `<meta name="viewport" content="width=device-width, initial-scale=1">` I've seen tests where this breaks things but also tests where it fixes things. I'm going to use it.

## Vendor

* Use a `<style>` tag in the `<head>` to enforce anchor styles for any service that inserts `<a>` tags for you (for example, Campaign Monitor). Because those tags won't be able to get inline styles :)
* Use the `.horizontal-rule` class on an empty nested `<div>` to achieve consistent appearance

### Android

* To fix `<td>` widths, see the `min-width` styles in `sass/helpers/_layout.scss`.

### Gmail

* On mobile devices, the Gmail app will sometimes enforce a fake responsive zoom that can break your layout. If the rule is being enforced, you'll see this message at the top of the email: "_This message has been modified to fit your screen. Tap here to show original._" To overcome this, the following snippet has been added to our `src/index.html` file. The styles for `.gmail-zoom-fix` can be found in `sass/helpers/_vendor.scss`.

    <div class="gmail-zoom-fix">
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
    </div>

### Outlook

* Use 6-character hex codes for colors because Outlook doesn't understand the shorthand variant.
* Outlook is :poop: and will default to Times New Roman if the desired font is not natively available. Use a conditional check to enforce a fallback `font-family` Please note that CM will inject extra !important declarations, so this is left out of the boilerplate. 

    <!--[if mso]>
    <style type="text/css">
      body,
      table,
      td {
        font-family: Helvetica, Arial, sans-serif !important;
      }
    </style>
    <![endif]-->

* To fix vertical-align for a `<sup>` tag nested inside of an element that has an increased font size (`<h1><sup></sup></h1>`, for example), include a font-size bump inside the `mso` conditional styles.

    <!--[if mso]>
    <style type="text/css">
      h1 sup {
        font-size: {slightly smaller than parent} !important;
      }
    </style>
    <![endif]-->

* High DPI screens will zoom content when an email is rendered in Outlook. This can lead to a container that is wider than it should be. Use these items to force 96dpi images in Outlook. See https://blog.jmwhite.co.uk/2014/03/28/solving-dpi-scaling-issues-with-html-email-in-outlook/ for more.

    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

    <!--[if gte mso 9]>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
     </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->

### Constant Contact

* You can control the style of the web version link by tapping `#VWPLINK` in the `<head>`
* Try to avoid using XHTML mode if at all possible. It is a nightmare.

## Overriding blue links

Do:
* Nest a `<span>` inside of your `<a>` tags that reinforce the color you want
* All `<a>` tags need a real URL (not `href="#"`)

Don't:
* Outlook 2007-2016 will not use your color if you employ `!important`

## Blocky buttons
* Outlook doesn't respect `padding` values, so use the anchor's parent `<td>` to mimic the button background. You want to set the `<a>` tag's `height` to the same value as the parent `<td>`. See `sass/components/_buttons.scss` for more.

    <td align="center" width="174" height="42" class="btn">
      <a href="http://foo.com" class="btn__link">
        <span class="link-override">Submit Your Review</span>
      </a>
    </td>

## HTML entities

* Please use HTML entity codes instead of symbols that may show up natively in your operating system. For example, use `&reg;` instead of pasting a registered trademark symbol.
