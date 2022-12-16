# preact-router-for-htm

Bare bones router for [Preact](https://preactjs.com) apps using [HTM](https://github.com/developit/htm) (ie, **not** JSX) [without transpilation](https://myfreakinname.blogspot.com/search/label/preact).

Works okay with URLs that change the hash. Less great with changed URLs.

### Usage

(This doesn't really count as docs. I'll add some if this works well enough that I make a few more commits.)

Tried to stay kinda close to preact-router, but uses string or RegExp **instead of** [`preact-router`'s querystring aware symbols](https://github.com/preactjs/preact-router#handling-urls). 

See example usage in [index.html](https://github.com/ruffin--/preact-router-for-htm/blob/main/index.html). High points:

```
window.render = window.preact.render;
window.useState = window.preactHooks.useState;
window.html = window.htmPreact.html;

document.addEventListener('DOMContentLoaded', function () {
    render(
        html`<${HtmRouter}>
            <${MyComponent} displayText="default" default />
            <${MyComponent} displayText="simple preact" path="simplePreact/" />
            <${MyComponent} displayText="another url" path="anotherUrl/" />
            <${MyComponent} displayText="hash" path="#hash" />
            <${MyComponent} displayText="another hash" path="#another" />
            <${MyComponent} displayText="user display" path=${/users\/[0-9]+/} />
        </HtmRouter>`,
        document.getElementById('root-element')
    );
});
```

... and ...

```
<body>
    <a href="/anotherUrl/">go to url within app</a><br />
    <a href="/users/2">go to users/2</a><br />
    <a href="/users/234">go to users/234</a><br />
    <a href="/users/2/spam">go to users/2/spam which shouldn't be found</a><br />
    <a href="#hash">add hash to url</a><br />
    <a href="/#another">add another hash to ROOT url</a><br />

    <!-- as in ensure this url ISN'T captured by the router -->
    <a href="http://www.apple.com">go to apple.com</a><br />

    <div id="root-element"></div>
</body>
```

**NEW:** You can programmatically route things with the `HtmRouter.route` method. 

**NOTE:** Naving to urls of `'#'` will be ignored so that we can fake `return false` on link `onclick` handlers, as that's [apparently a thing in Reactland](https://stackoverflow.com/a/31203399/1028230).

`<a href="#" onclick="HtmRouter.route('users/2')">programmatic nav to users/2</a>`

Code is really quite short and self-explanatory. Stop reading this and open it up.

Note that it is meant to be run in (and only in) a [non-transpiled Preact & HTM environment](https://myfreakinname.blogspot.com/search/label/preact).

### Acknowledgements

Some jive shamelessly stolen from the MIT licensed [preact-router](https://github.com/preactjs/preact-router), which I was debugging with non-transpiled Preact & HTM before I figured it'd be pretty straightforward to write my own -- router, that is.
```
