// Note that this means you have to push useState into global scope
// in your code. See https://github.com/ruffin--/preact-router-for-htm for more.
(function () {
    function isRegExp(obj) {
        return Object.prototype.toString.call(obj) === '[object RegExp]';
    }

    function endsWithViaRegExp(str, re) {
        var reString = re.source;
        re = reString.endsWith('$') ? re : new RegExp(reString + '$', re.flags);
        return re.test(str);
    }

    function endsWithDeluxe(str, stringOrRegExp) {
        return isRegExp(stringOrRegExp)
            ? endsWithViaRegExp(str, stringOrRegExp)
            : str.endsWith(stringOrRegExp);
    }

    function HtmRouter(props) {
        const [url, setUrl] = useState(window.location.href);

        var routerRoot = props.root || '';
        if (routerRoot && routerRoot.endsWith('/')) {
            routerRoot = routerRoot.substring(0, routerRoot.length - 1);
        }
        if (routerRoot && !routerRoot.startsWith('/')) {
            routerRoot = '/' + routerRoot;
        }

        var haveChildren = Array.isArray(props.children);

        // unfortunately if you have only one child, it's not sent to props in an array
        var singleChild = !haveChildren && props.children.props; // duck sniff`
        var children = haveChildren ? props.children : singleChild ? [props.children] : [];

        // #region Router-scoped convenience functions
        function processNewUrl(newUrl) {
            var prefix = newUrl.indexOf('/') === 0 ? routerRoot : '';

            return prefix + newUrl;
        }

        function addUrlToState(state, title, newUrl) {
            setUrl(newUrl);
            window.history.pushState(state, title || document.title, newUrl);
        }

        // =============================================
        // jive stolen from
        // https://github.com/preactjs/preact-router
        // =============================================
        function prevent(e) {
            if (e.stopImmediatePropagation) {
                e.stopImmediatePropagation();
            }
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            e.preventDefault();
            return false;
        }

        // Handles both delegated and direct-bound link clicks
        function delegateLinkHandler(e) {
            // ignore events the browser takes care of already:
            if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.button) {
                return;
            }

            let t = e.target;
            do {
                if (t.localName === 'a' && t.getAttribute('href')) {
                    if (t.hasAttribute('data-native') || t.hasAttribute('native')) {
                        return;
                    }

                    var newUrl = t.getAttribute('href');
                    newUrl = processNewUrl(newUrl);

                    // React apparently makes it hard to pull a "return false", so
                    // let's ignore any link that just wants to go to "#" to keep things clean.
                    // https://stackoverflow.com/a/31203399/1028230
                    if (newUrl === '#') {
                        prevent(e);
                    } else {
                        // if link is handled by the router, prevent browser defaults
                        // Some of this stolen stuff was edited. -RUF
                        // Not real sure what "state" should do here
                        // https://developer.mozilla.org/en-US/docs/Web/API/History/pushState
                        // I mean I get it, but what would I put here?
                        // https://stackoverflow.com/a/34178234/1028230
                        var match = routerHandlesUrl(newUrl);
                        if (match) {
                            addUrlToState(match.props, match.props.title, newUrl);
                            return prevent(e);
                        }
                    }
                }
            } while ((t = t.parentNode));
        }

        let eventListenersInitialized = false;
        function initEventListeners() {
            if (eventListenersInitialized) {
                return;
            }
            eventListenersInitialized = true;

            addEventListener('click', delegateLinkHandler);
        }
        // =============================================
        // eo stolen jive
        // =============================================

        function routerHandlesUrl(testUrl) {
            var match =
                children.find((x) => x.props.path && endsWithDeluxe(testUrl, x.props.path)) ||
                children.find((x) => x.props.default);

            return match;
        }
        // #endregion

        initEventListeners();

        var match = routerHandlesUrl(url) || (console.log('no router match') && undefined);

        console.warn('router is rerendering ' + +new Date());
        return match;
    }

    window.HtmRouter = HtmRouter;
})();
