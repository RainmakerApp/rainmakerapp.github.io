The Rainmaker platform is built for developers. We've engineered API first, and built all our functionality on the same API you have access to as a 3rd party developer.

# Getting Started
We've developed a number of ways for you to work with the Rainmaker platform as a developer. Depending on budget or amount of time you have...

1. ...you can start with our easy-to-use plugin
2. ...you can opt to do a full theme integration
2. ...or you can build complex data and functionality integrations

## Installing The Plugin
> If your website is responsive, our plugin will automatically generate beautiful, mobile friendly user experience flows for all the screens.

The plugin is a drop-in javascript library that instantly adds all the functionality to your website you need to engage with your donors and accept donations.

If your account domain is **awesome.donate.io** then your `__rmSettings.organization` value will be `awesome`.

```html
<script src="https://assets.donate.io/static/widget/embed.js"></script>
<script>var __rmSettings = {organization:'YOUR_SUBDOMAIN_SLUG'}</script>
```

**[Visit the widget documentation for a full breakdown of functionality. &rarr;](/widget.html)**

### Linking To Dialogs
The plugin monitors hashtag links (eg. `#/my/login`) and will automatically display the dialog as a valid hashtag link is clicked.
```html
<a href="#/my/donate?amount=5">Donate $5</a>
<a href="#/my/login" rm-hide="loggedInMember">Login</a>
```

### Trigger with Javascript
You can also trigger any dialog with the `$rain()` function.

```js
$rain("login");
$rain("donate", {amount:50,project:99999,group:9999});
```


## Creating Forms

> While the plugin provides you with a lot of default functionality out of the box, you may want to create your own UI for some things like pledges, polls, signup-forms, etc.

You can easily interact directly with the API's form endpoints for creating contacts. The fields in your forms will match with what you see in the API reference.

Here's an example email-signup form.

```html
<form action="http://demo.donate.io/api/3.0/contacts" method="post">
  <div class="row">
    <label>Your Full Name</label>
    <input name="name" type="text"/>
  </div>
  <div class="row">
    <label>Your Email</label>
    <input name="email" type="text"/>
  </div>
  <div class="row">
    <label>
      <input name="email-opt-in" type="checkbox" value="yes"/> Send me regular email updates.
    </label>
  </div>
  <div class="row">
    <input type="hidden" name="--success" value="http://yourwebsite.com/email-signup-thankyou"/>
    <input type="hidden" name="--failure" value="http://yourwebsite.com/email-signup-failure"/>
    <input type="submit" value="Sign Up"/>
  </div>
</form>
```