# Email tricks :metal:

## Meta

* I'm unsure about `<meta name="viewport" content="width=device-width, initial-scale=1">` I've seen tests where this breaks things but also tests where it fixes things. I'm going to use it.

## Vendor

* Use a `<style>` tag in the `<head>` to enforce anchor styles for any service that inserts `<a>` tags for you (for example, Campaign Monitor). Because those tags won't be able to get inline styles :)

### Outlook

* Use 6-character hex codes for colors because Outlook doesn't understand the shorthand variant.
* Outlook is :poop: and will default to Times New Roman if the desired font is not natively available. Use a conditional check to enforce a fallback `font-family`:


    <!--[if mso]>
    <style type="text/css">
      body,
      table,
      td {
        font-family: Helvetica, Arial, sans-serif !important;
      }
    </style>
    <![endif]-->


### Gmail

* On mobile devices, the Gmail app will sometimes enforce a fake responsive zoom that can break your layout. If the rule is being enforced, you'll see this message at the top of the email: "_This message has been modified to fit your screen. Tap here to show original._" To overcome this, the following snippet has been added to our `src/index.html` file. The styles for `.gmail-zoom-fix` can be found in `sass/helpers/_vendor.scss`.


    <div class="gmail-zoom-fix">
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
    </div>



## Overriding blue links

Do:
* Nest a `<span>` inside of your `<a>` tags that reinforce the color you want
* All `<a>` tags need a real URL (not `href="#"`)

Don't:
* Outlook 2007-2016 will not use your color if you employ `!important`

## Blocky buttons
* Outlook doesn't respect `padding` values, so use the anchor's parent `<td>` to mimic the button background. The `valign-middle` overrides the default `<td>` style, which sets `vertical-align: top`. You'll also want to set the `<a>` tags `height` to the same value as the parent `<td>`.


    <td align="center" width="174" height="42" class="valign-middle bg-red">
      <a href="http://foo.com" class="btn bg-red">
        <span class="link-override">Submit Your Review</span>
      </a>
    </td>
