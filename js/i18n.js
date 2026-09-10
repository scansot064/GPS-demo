/**
 * Browser-safe localization runtime.
 *
 * Locale content lives in locales/en.js and locales/es.js so the demo can
 * continue to run directly from index.html without requiring a web server.
 */
(function () {
    const originals = new WeakMap();

    function locale() {
        return localStorage.getItem('gps-language') || 'en';
    }

    function translate(value) {
        const dictionary = (window.GPS_LOCALES && window.GPS_LOCALES[locale()]) || {};
        let result = value;
        Object.keys(dictionary).sort((a, b) => b.length - a.length).forEach(key => {
            result = result.split(key).join(dictionary[key]);
        });
        return result;
    }

    function apply() {
        const lang = locale();
        document.documentElement.lang = lang;
        document.title = translate('__document_title__');
        document.querySelectorAll('#language-select').forEach(select => { select.value = lang; });

        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
            if (!originals.has(node)) originals.set(node, node.nodeValue);
            node.nodeValue = translate(originals.get(node));
        }

        document.querySelectorAll('[title],[aria-label]').forEach(element => {
            ['title', 'aria-label'].forEach(attribute => {
                const originalAttribute = `data-i18n-${attribute}`;
                if (!element.hasAttribute(originalAttribute)) {
                    element.setAttribute(originalAttribute, element.getAttribute(attribute));
                }
                const originalValue = element.getAttribute(originalAttribute);
                element.setAttribute(attribute, translate(originalValue));
            });
        });
    }

    window.t = key => {
        const dictionary = (window.GPS_LOCALES && window.GPS_LOCALES[locale()]) || {};
        return dictionary[key] || key;
    };
    window.gpsI18n = { apply };

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('#language-select').forEach(select => {
            select.addEventListener('change', event => {
                localStorage.setItem('gps-language', event.target.value);
                window.location.reload();
            });
        });
        apply();
        new MutationObserver(apply).observe(document.body, { childList: true, subtree: true });
    });
})();
