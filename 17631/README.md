# Email Starter Kit

This package is intended to give you a starting point when developing a custom HTML email.

## Setup

By the way, "setup" is a noun. "Set up" is an action. Anyway...

* Log in to Gitlab.
* Download the .zip for this repository: https://gitlab.com/wrayward/starter-kit-email
* Extract the .zip and copy the contents into your project directory.
* In Terminal, go to your project directory and use `$ sudo npm install` to download Node dependencies.
* You're now ready to run the Gulp build process.

## Build

This package uses a Gulp build process. Here are the tasks that you can run:

* `$ gulp`: The default task will build your project and output the result into `dist`. There is no `watch` task associated with this build process.
* `$ gulp styles:sass`: This will process your SASS and output styles.css into the `src` directory (mainly for reference).
* `$ gulp styles:inline`: This is probably the task that you're looking for. It will run `styles:sass` first, and then will inject the resulting CSS into the HTML. All of this results in `dist/index.html` which contains inline styles.
* `$ gulp images`: This pipes `src/images` over to `dist/images` and does very minimal image optimization.
* `$ gulp zip`: This will bundle all of your `dist` files into a single html.zip archive.
* `$ gulp zip:images`: This will bundle all `dist/images` into a single images.zip archive.
* `$ gulp plain`: This pipes your `src/plain.txt` file over to `dist/plain.txt`.

## Help

Check the HELP.md file for some tricks. This is mainly for Outlook because Microsoft.
