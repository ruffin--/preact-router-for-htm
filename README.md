# preact-router-for-htm

Bare bones router for [Preact](https://preactjs.com) apps using [HTM](https://github.com/developit/htm) (ie, **not** JSX) [without transpilation](https://myfreakinname.blogspot.com/search/label/preact).

Works okay with URLs that change the hash. Less great with changed URLs.


### Usage

(This doesn't really count as docs. I'll add some if this works well enough that I make a few more commits.)

Tried to stay kinda close to preact-router. Try throwing something like this in your `index.html` and smoking it:

```
<script src="https://unpkg.com/preact@10.11.3/dist/preact.umd.js"></script>
<script src="https://unpkg.com/preact@10.11.3/hooks/dist/hooks.umd.js"></script>
<script src="https://unpkg.com/htm@3.1.1/preact/standalone.umd.js"></script>
<script src="https://cdn.jsdelivr.net/gh/ruffin--/preact-router-for-htm/HtmRouter.min.js"></script>

<script>
    window.render = window.preact.render;
    window.useState = window.preactHooks.useState;
    window.html = window.htmPreact.html;

    document.addEventListener("DOMContentLoaded", function () {
        render(
            html`<${HtmRouter}>
                <${MyComponent} displayText="default" default />
                <${MyComponent} displayText="simple preact" path="simplePreact/" />
                <${MyComponent} displayText="another url" path="anotherUrl/" />
                <${MyComponent} displayText="hash" path="#hash" />
                <${MyComponent} displayText="another hash" path="#another" />
            </HtmRouter>`,
            document.getElementById("root-element")
        );
    });
</script>

<body>
    <a href="./anotherUrl/">go to url within app</a><br />
    <a href="#hash">add hash to url</a><br />
    <a href="#another">add another hash to url</a><br />
    <a href="http://www.apple.com">go to apple.com</a><br />
    <div id="root-element"></div>
</body>
```

Code is really quite short and self-explanatory. Stop reading this and open it up.

Note that it is meant to be run in (and only in) a [non-transpiled Preact & HTM environment](https://myfreakinname.blogspot.com/search/label/preact).


### Acknowledgements

Some jive shamelessly stolen from the MIT licensed [preact-router](https://github.com/preactjs/preact-router), which I was debugging with non-transpiled Preact & HTM before I figured it'd be pretty straightforward to write my own -- router, that is.