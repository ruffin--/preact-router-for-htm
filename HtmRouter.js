(function () {
    window.HtmRouter = function (props) {
        // =============================================
        // jive stolen from
        // https://github.com/preactjs/preact-router
        // =============================================
        function prevent(e) {
            if (e.stopImmediatePropagation) e.stopImmediatePropagation();
            if (e.stopPropagation) e.stopPropagation();
            e.preventDefault();
            return false;
        }

        // Handles both delegated and direct-bound link clicks
        function delegateLinkHandler(e) {
            // ignore events the browser takes care of already:
            if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.button) return;

            let t = e.target;
            do {
                if (t.localName === "a" && t.getAttribute("href")) {
                    if (t.hasAttribute("data-native") || t.hasAttribute("native")) return;

                    var newUrl = t.getAttribute("href");

                    // if link is handled by the router, prevent browser defaults
                    // Some of this stolen stuff was edited. -RUF
                    // Not real sure what "state" should do here
                    // https://developer.mozilla.org/en-US/docs/Web/API/History/pushState
                    // I mean I get it, but what would I put here?
                    // https://stackoverflow.com/a/34178234/1028230
                    var match = routerHandlesUrl(newUrl);
                    if (match) {
                        setUrl(newUrl);
                        window.history.pushState(
                            match.props,
                            match.props.title || document.title,
                            newUrl
                        );
                        return prevent(e);
                    }
                }
            } while ((t = t.parentNode));
        }

        let eventListenersInitialized = false;

        function initEventListeners() {
            if (eventListenersInitialized) return;
            eventListenersInitialized = true;

            addEventListener("click", delegateLinkHandler);
        }
        // =============================================
        // eo stolen jive
        // =============================================

        function routerHandlesUrl(url) {
            return children.find((x) => x.props.path && url.endsWith(x.props.path));
        }

        const [url, setUrl] = useState(window.location.href);
        initEventListeners();

        // console.log(props.children, url);
        var haveChildren = Array.isArray(props.children);
        var children = haveChildren ? props.children : [];

        var match =
            (haveChildren &&
                (props.children.find((x) => x.props.path && url.endsWith(x.props.path)) ||
                    props.children.find((x) => x.props.default))) ||
            html`<h3>no match</h3>`;

        return match;
    };
})();

