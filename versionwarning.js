function showVersionWarning() {
    // adapted 2020-05 from https://scikit-learn.org/versionwarning.js
    if (location.hostname === 'mne.tools') {
        const urlParts = location.pathname.split('/');
        const version = urlParts[1];
        const releases = Array.from(
            document.querySelector('.version-switcher__menu').children
        );
        const stableRelease = releases.filter(
            ver => ver.getAttribute('data-version') == 'stable'
        )
        if (typeof stableRelease == "undefined") {
            setTimeout(showVersionWarning, 250);
            return
        }
        const latestStable = parseFloat(
            stableRelease[0].getAttribute('data-version-name').split(' ')[0]
        );
        // see if filePath exists in the stable version of the docs
        var filePath = urlParts.slice(2).join('/');

        fetch(`https://mne.tools/stable/${filePath}`, { method: "HEAD" })
        .then((response) => {
            if (!response.ok) {
                filePath = '';
            }
        })
        .then(() => {
            if (version !== 'stable') {
                const outer = document.createElement("div", { "class": "bd-header-announcement container-fluid" });
                const middle = document.createElement("div", { "class": "bd-header-announcement__content" });
                const inner = document.createElement("div", { "class": "sidebar-message" });
                const bold = document.createElement("strong");
                outer.appendChild(middle);
                middle.appendChild(inner);
                // for less-than comparison: 'dev' → NaN → false (which is what we want)
                inner.innerText = "This is documentation for";
                if (parseFloat(version) < latestStable) {
                    inner.innerText += "an"
                    bold.innerText = `old version (${version})`;
                } else {
                    inner.innerText += "the"
                    bold.innerText = "unstable development version";
                }
                inner.appendChild(bold);
                inner.appendChild(document.createTextNode("of MNE-Python."))
                const anchor = document.createElement("a", {
                    "class": "sd-btn sd-btn-danger sd-shadow-sm sd-text-wrap font-weight-bold ms-3 my-3 align-baseline",
                    "href": `https://mne.tools/stable/${filePath}` },
                    "Switch to stable version");
                inner.appendChild(anchor);
                const refNode = document.querySelector('.bd-header');
                document.body.insertBefore(newNode, refNode);
            }
        })
    }
}

showVersionWarning();
