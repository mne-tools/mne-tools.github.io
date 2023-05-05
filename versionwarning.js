function showVersionWarning() {
    // adapted 2020-05 from https://scikit-learn.org/versionwarning.js
    if (location.hostname === "mne.tools") {
        const urlParts = location.pathname.split("/");
        const version = urlParts[1];
        const menu = document.querySelector(".version-switcher__menu");
        var latestStable = Infinity;
        if (menu !== null) {
            const releases = Array.from(menu.children);
            const stableRelease = releases.filter(
                ver => ver.getAttribute("data-version") == "stable"
            )[0]
            if (typeof stableRelease == "undefined") {
                setTimeout(showVersionWarning, 250);
                return;
            }
            latestStable = parseFloat(
                stableRelease.getAttribute("data-version-name").split(" ")[0]
            );
        }
        // see if filePath exists in the stable version of the docs...
        var filePath = urlParts.slice(2).join("/");
        fetch(`https://mne.tools/stable/${filePath}`, { method: "HEAD" })
        // ...if not, redirect will go to the main homepage in stable
        .then((response) => {
            if (!response.ok) {
                filePath = "";
            }
        })
        // now construct the warning banner
        .then(() => {
            if (version !== "stable") {
                var outer = document.createElement("div");
                const middle = document.createElement("div");
                const inner = document.createElement("div");
                const bold = document.createElement("strong");
                const button = document.createElement("a");
                button.href = `https://mne.tools/stable/${filePath}`;
                button.innerText = "Switch to stable version";
                const banner = document.querySelector('#banner');
                // for really old versions
                if (banner !== null) {
                    outer = banner;
                    outer.classList = "container-fluid alert-danger devbar pt-3";
                    middle.classList = "row no-gutters";
                    inner.classList = "col-12 text-center";
                    button.classList = "btn btn-danger font-weight-bold ml-3 my-3 align-baseline";
                } else {
                    outer.classList = "bd-header-announcement container-fluid";
                    middle.classList = "bd-header-announcement__content";
                    inner.classList = "sidebar-message";
                    button.classList = "sd-btn sd-btn-danger sd-shadow-sm sd-text-wrap font-weight-bold ms-3 my-3 align-baseline";
                }
                outer.appendChild(middle);
                middle.appendChild(inner);
                // for less-than comparison: "dev" → NaN → false (which is what we want)
                inner.innerText = "This is documentation for ";
                if (parseFloat(version) < latestStable) {
                    inner.innerText += "an "
                    bold.innerText = `old version (${version})`;
                } else {
                    inner.innerText += "the "
                    bold.innerText = "unstable development version";
                }
                inner.appendChild(bold);
                inner.appendChild(document.createTextNode(" of MNE-Python. "))
                inner.appendChild(button);
                document.body.prepend(outer);
            }
        })
    }
}

showVersionWarning();
