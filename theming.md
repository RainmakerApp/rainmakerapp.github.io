# Getting Started

# Theme Language
We've developed a theming syntax that allows you to use the data available over the API in an incredibly efficient way. In your theme folder there are a few "smart" folders.

* `./templates` - These layout files are used with the the `theme:template` tag.
* `./pages` - These files and folders correspond to url routes on your website.
* `./emails` - These are your HTML email templates and content blocks.
* `./patterns` - YAML configuration files for the CMS


## Syntax
### String Interpolation
Our theming syntax follows the hash-brace style for string interpolation (similar to Jade, Slim, and CoffeeScript). `#{foobar}` will be replaced with the value of `foobar`. All values are interpolated raw. If you'd like to escape html you'll want to use the [unsafe filter.](#filters-strings)

```html
<h1>#{title}</h1>
<!-- <h1>Welcome!</h1> -->
```
> Interpolation works in the contents of attributes except for attributes beginning with a `:`. All `:attributes` and `:elements` are magic. You'll read more about how they work in the templating and scope sections below.


### Filters
Anywhere you are accessing variables you can apply filters to the data you're working with. For example `#{fundraiser.target|money(2)}` would convert `2000` to `$2,000.00`.

```html
<div>Goal: #{fundraiser.target|nicenum}</div>
<!-- <div>Goal: 2K</div> -->
```

+ Never put spaces around the `|` character.
+ You can string filters together. e.g. `#{fundraiser.name|slugify|hash}`
+ Filters do not always output strings. They modify the input and return a new value for the next filter for output. Read the filter docs to determine what value type is returned.

### Attributes
We never modify the behavior of html attributes unless they begin with a `:`.

Regular attributes will have their values scanned and interpolated, but unless you're using an interpolation string, their values will remain the same in output.

Colon attributes are never outputted to the browser and define server side operations such as iteration, data loading, or magic operations.

### Conditions
There are two ways you can write conditions. Comment style or using the `:hide` and `:show` attributes.

```html
<!--@IF get.success-->
<h1>You are awesome!</h1>
<!--@ENDIF-->

<h1 :show="get.success">You are awesome.</h1>
<h1 :hide="get.success">Complete this form.</h1>
```

+ Comments must begin with the `@` symbol followed by the condition operator.
 + `<!--@IF condition-->`
 + `<!--@ELSEIF condition-->`
 + `<!--@ENDIF-->`
+ If you don't use a comparison operator, the value will be checked for `truthiness`. The following is considered `false`.
 + `""` (an empty string)
 + `0` (0 as an integer)
 + `0.0` (0 as a float)
 + `"0"` (0 as a string)
 + `null`
 + `false`
 + `[]` (an empty array)
 + `{}` (an empty object)
+ The following comparison operators are supported.
 + `==`      equal to
 + `!=`      not equal to
 + `>`      greater than
 + `>=`      greater than or equal to
 + `<`      less than
 + `<=`      less than or equal to
 + `&&` conditional and
 + `||` conditional or
+ You can group conditions with parenthesis.
+ Always surround operators with spaces. `true||false` will not work.

### Iteration
To iterate an element you use the `:repeat` or `:repeat-contents` attribute. (eg. `:repeat="project in projects"`). As long as you pass an array or other iteratable result, the element will be repeated for each item in the array.
```html
<ul>
  <li :repeat="item in nav"><a href="#{item.link}" class="#{req.path == item.link ? 'active'}">#{item.name}</a></li>
</ul>
```
Syntax is `:repeat="item in collection"` or `:repeat="item, index in collection"`.

+ You can inject the index of the current item into your scope with `item, i in collection`. This would allow you to do something like `id="link-#{i}"`
+ With `:repeat`, the element will repeat itself. You can repeat only the contents by using the `:repeat-contents` attribute instead.

## Template
Inside of your `./templates` folder there'll be a `default.html` file. 

```html
<!-- templates/default.html -->
<!DOCTYPE html>
<html>
  <head>
    <title>#{options.title} - Demo</title>
    <script src="/static/widget/embed.js"></script>
    <script>var __rmSettings = {organization:'demo'}</script>
    <theme:placeholder name="head" />
  </head>
  <body>
    <theme:placeholder name="content" />
    <theme:embed file="includes/footer" />
    <theme:placeholder name="scripts" />
  </body>
</html>
```
### Usage
When used in a theme page, the `theme:template` tag passes all of it's attributes to the template file in the `options` hash. This allows you to customize things in your layout file easily per page.
And inside of your `./pages` directory you can now use this template file like this.
```html
<!-- pages/index.html -->
<theme:template name="default" title="Cool Page">
  <head>
    <!--this content replaces the `head` placeholder-->
  </head>
  <content>
    <!--this content replaces the `content` placeholder-->
  </content>
  <scripts>
    <!--this content replaces the `scripts` placeholder-->
  </scripts>
</theme:template>
```
### Preload Conditions
The `theme:template` element will always scan it's immediate children for a couple special elements that you can use to protect pages or display errors.

* `require-init`
  + This will be run before any data loading, processing, or interpolations happens on your template. Use this to make sure you have the data you need to build this page.
  + The `:eval` attribute will evaluate the truthiness of the contents.
  + The `not-found` element will redirect to the `/not-found` url on your website if `:eval` returns false.
    + The contents of the `not-found` tag will be interpolated, base64 encoded and passed as the **get attribute** `error`.

```html
<require-init :eval=":url.2|cleanslug" />
<not-found>Oops. The url for this page wasn't structured properly.</not-found>
```

* `require`
  + This is run **after** data is loaded and before any compilation happens. Use this to make sure any data you were attemption to load actually is available (eg. a project or fundraiser exists.)

```html
<require-init :eval="project.id" />
<not-found>
  <h3>The project you are accessing could not be found. Please verify the url you used is valid.</h3>
  <p><code>{req.link}</code></p>
  <a href="/projects?search={req.segment(2)|cleanslug|replace('-',' ')}" class="button">Try Searching For It</a>
</not-found>
```
### Placeholders
Every HTML file in the `./templates` folder is expected to have placeholders. If it does not, it'll be useless to any pages using that template.
```html
<theme:template name="default">
  <placeholdertaghere>content</placeholdertaghere>
</theme:template>
```

Most websites only need one layout template (usually `default`), but sometimes there may be the need to configure a micro-site that has a completely different wrapper.

When using a template, simply use the `theme:template` tag as follows. Please note, any non-placeholder tags that are the direct child of `theme:template` will be **ignored entirely.**

### Including Files
You can include any file inside the `/theme` directory from any other file with the `theme:embed` tag.

```html
<!-- includes /theme/includes/footer.html -->
<theme:embed file="includes/footer" />
```
When embedding another file into your source, you may want to pass data to that file or options via attributes. Here's an example.

```html
<!-- /theme/components/followers.html -->
People following this {options.page}
<ul>
  <li :iterate="contact in followers">{contact.name}</li>
</ul>
```

When using the `theme:embed` tag, all attributes get passed to the `:options` hash, **unless they begin with a `:`**. Attributes that begin with a colon will map their value to a scoped variable and pass it directly into the scope of the embedded file with the attribute name as the key. Usage example below.

The embedded file also will have access to any variables declared in the including scope.

```html
<theme:embed file="components/followers" :followers="project.followers" page="project" />
```

## Scope
Every HTML element defines a scope which applies to itself and all child elements. Any data on an element is only accessible within its scope.

### Global Variables
#### `get`
This is a hash of any **GET** parameters passed to the url. For example, you might visit `/intro?autoplay=true` and access the value of `autoplay` in your HTML with `{get.autoplay}`.

#### `req`
This hash provides you with a robust interface to the request data such as url parameters, domain, etc.

```html
<!--@IF get.success-->
<h1>Thanks for your form submission!</h1>
<!--@ENDIF-->
```
###### `req.segment(2)`
Will return `bar` if you're accessing `/foo/bar`. Useful when accessing keys that may be passed in the page url such as a project or fundraiser page. e.g. `/projects/water-in-africa`

```html
<div :load="/projects/:id as project" :param-id="req.segment(2)">{project.name}</div>
```

###### `req.protocol`
Returns `http` or `https`.

###### `req.link([path][,protocol])`
Returns the full url to the current page with no arguments passed. This is particularly useful when generating shareable links.
```html
<a href="{req.link('/foo/bar','https')}">Go</a>
<!-- <a href="https://demo.donate.io/foo/bar">Go</a> -->
```
* `req.method` — returns `GET` or `POST`

### Loading Data
When you need to pull data into your code (such as project information for a project page) you'll need to **load** that data into your scope.



```html
<div :api="/projects/:id as project" :param-id="req.segment(2)">
  <h1>{project.name}</h1>
  <ul>
    <li :api="project/followers",:param-page="[]"></li>
  </ul>
</div>
```
## Debugging
When building a page, it can be very useful to inspect a variable you're attempting to load to figure out exactly what data is available for output. There are two filters for this. `debug` and `dump`.

* `dump` will output the value of whatever variable you apply the filter to.
* `debug` is the same as dump except that you must appent `?--debug` to your url in order to view the dump. This is helpful when debugging a live page.

# Filters
Anywhere you are accessing variables you can apply filters to the data you're working with. For example `#{fundraiser.target|money(2)}` would convert `2000` to `$2,000.00`.

```html
<div>Goal: #{fundraiser.target|nicenum}</div>
<!-- <div>Goal: 2K</div> -->
```

+ Never put spaces around the `|` character.
+ You can string filters together. e.g. `#{fundraiser.name|slugify|hash}`
+ Filters do not always output strings. They modify the input and return a new value for the next filter for output. Read the filter docs to determine what value type is returned.

## Strings
#### addslashes
Returns a string with backslashes before characters that need to be escaped. These characters are single quote (`'`), double quote (`"`), backslash (`\`) and `\u0000` (the NULL byte).

#### base64_decode
Decodes data encoded with MIME base64

#### base64_encode
Encodes the given data with base64. This encoding is designed to make binary data survive transport through transport layers that are not 8-bit clean, such as a url. Base64-encoded data takes about 33% more space than the original data.

#### cleanslug
Run any incoming slugs passed via url through this before using them to lookup an item in the database. This will make sure the slug passed is valid and doesn't have extra space or characters that might result in the lookup not working.

#### default(val)
Will output `val` if the variable being filtered is evaluates as empty. (see the [explanation of truthiness](#theme-language-syntax-conditions) to understand what is considered empty)

#### default64(b64value)
Same as `default` except that the value being passed is base64 decoded before being output.

#### unsafe
Use this to escape any html elements before output. Usefull to prevent XSS attacks on user-created content.

#### join(glue)
This filter converts an array of values into a string. Returns a string containing a string representation of all the array elements in the same order, with the glue string between each element.

#### json
Returns the JSON representation of a value

#### limit_words(limit[, moretext='...'])
Limits the number of words in a string. If the string has more words than the limit, the more text will be appended to the string after the last allowed word.

#### limitstring(limit[,dontcut=false])
Will cut a string after the specified number of characters and remove any extra spaces. If the second parameter is true your string will be cut after the end of the nearest word.

#### lowercase
Returns string with all alphabetic characters converted to lowercase.

Note that 'alphabetic' is determined by the current locale. This means that in i.e. the default "C" locale, characters such as umlaut-A (Ä) will not be converted.

#### markdown
Parses the string through markdown and returns an HTML result.

#### ormarkdown
The same as `markdown`, except that the string is checked to see if it's already HTML formatted. This is helpful if you're not sure whether the user is providing HTML or markdown content.

#### md5
Calculates the MD5 hash of str using the [RSA Data Security, Inc. MD5 Message-Digest Algorithm](http://www.faqs.org/rfcs/rfc1321), and returns that hash.


#### pluraltext(singular, plural)
If the value you're filtering is greater than `1`, the text passed in `plural` will be output, otherwise `singular` will be output.

#### replace(search, replace)
This function returns a string with all occurrences of search replaced with the given replace value.

#### slugify
This converts any string to lowercase letters, numbers, and dashes. Spaces and underscores become the `-` character. All other non alphanumeric characters are removed entirely.

#### split(delimiter)
Returns an array of strings, each of which is a substring of the passed string formed by splitting it on boundaries formed by the string delimiter.

#### strip_markdown
Removes any markdown formatting from a string. This is helpful when you want to generate a preview of some markdown content.

#### strip_tags
Removes any HTML tags from a string. This is helpful when you want to generate a preview of some markdown content.

#### substr(start[, length])
Returns the portion of string specified by the start and length parameters.

#### lpad(length[, padstring])
Returns the string padded on the left with characters up to `length` with `padstring`.

#### rpad(length[, padstring])
Returns the string padded on the right with characters up to `length` with `padstring`.

#### tf
Evaluate the passed value for truthiness and then return boolean `true` or `false`.

#### ucwords
Returns a string with the first character of each word in the passed string capitalized, if that character is alphabetic.

The definition of a word is any string of characters that is immediately after a whitespace (These are: space, form-feed, newline, carriage return, horizontal tab, and vertical tab).

#### uppercase
Returns the passed string with all alphabetic characters converted to uppercase.

Note that 'alphabetic' is determined by the current locale. For instance, in the default "C" locale characters such as umlaut-a (ä) will not be converted.

#### urlencode
Returns a string in which all non-alphanumeric characters except `-_.~` have been replaced with a percent (`%`) sign followed by two hex digits. This is the encoding described in [RFC 3986](http://www.faqs.org/rfcs/rfc3986.html) for protecting literal characters from being interpreted as special URL delimiters, and for protecting URLs from being mangled by transmission media with character conversions (like some email systems).

## Numbers
#### abs
The absolute value of the passed number. If the number is of type `float`, the return type is also `float`, otherwise it is `integer`.

#### add(number[,numbers,...])
Adds all of the numbers passed as attributes to the number being filtered. Will return an empty string if you're not filtering a number.

#### bool
Runs a [truthy evaluation](#theme-language-syntax-conditions) against the passed variable. In addition the string `"false"` and the string `"no"` are evaluated as boolean `false`. The string `"true"` and the string `"yes"` are evaluated as boolean `true`.

#### boolint
Same as `bool` except the integer `1` or `0` are returned instead of boolean `true` and `false`

#### ceil
Returns the next highest integer value by rounding up value if necessary.

#### divide(num)
Returns the passed value divided by `num`

#### float
Returns the passed value as `float`.

#### floor
Returns the next lowest integer value by rounding down value if necessary.

#### int
Converts the passed value to an `integer`.

#### json
Returns the JSON representation of a value

#### minus(number[,numbers,...])
Subtracts all of the numbers passed as attributes from the number being filtered. Will return an empty string if you're not filtering a number.

#### money(decimals[,currency='USD'])
Returns a string formatted for the correct currency and with the desired number of decimals.

#### multiply
#### nicenum
#### number
#### plus
#### round
#### subtract
#### tf
#### tocents
#### todollars

## Debugging
#### debug
#### dump

## Objects & Arrays
#### count
#### first
#### join
#### json
#### last
#### stylize_array

## Dates
#### countdown
#### date
#### time_since
#### timezone
#### unixtime
