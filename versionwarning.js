// compare X.Y strings numerically per part (parseFloat gets 1.9 > 1.13 wrong)
function compareVersions(a, b) {
    const pa = a.split(".").map(Number), pb = b.split(".").map(Number);
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
        const diff = (pa[i] || 0) - (pb[i] || 0);
        if (diff !== 0) return diff;
    }
    return 0;
}

function showVersionWarning() {
    // adapted 2020-05 from https://scikit-learn.org/versionwarning.js
    if (location.hostname === "mne.tools") {
        const urlParts = location.pathname.split("/");
        const version = urlParts[1];
        var latestStable = null;
        var filePath = urlParts.slice(2).join("/");
        // the switcher manifest marks the stable release as "preferred"
        fetch("https://mne.tools/versions.json")
        .then((response) => response.json())
        .then((entries) => {
            const preferred = entries.filter(entry => entry.preferred)[0];
            if (typeof preferred !== "undefined") {
                latestStable = preferred.version;
            }
        })
        // see if filePath exists in the stable version of the docs...
        .then(() => fetch(`https://mne.tools/stable/${filePath}`, { method: "HEAD" }))
        // ...if not, redirect will go to the main homepage in stable
        .then((response) => {
            if (!response.ok) {
                filePath = "";
            }
        })
        // now construct the warning banner
        .then(() => {
            // numbered directories of the stable release use the theme's own banner
            if (version === "stable" || version === latestStable) {
                return;
            }
            // honor a dismissal the same way the theme does: per version, for 14 days
            const dismissed = JSON.parse(localStorage.getItem("pst_banner_pref") || "{}")[version];
            if (dismissed != null && (new Date() - new Date(dismissed)) / 864e5 < 14) {
                return;
            }
            var outer = document.createElement("div");
            const middle = document.createElement("div");
            const inner = document.createElement("div");
            const bold = document.createElement("strong");
            const button = document.createElement("a");
            button.href = `https://mne.tools/stable/${filePath}`;
            button.innerText = "Switch to stable version";
            const banner = document.querySelector('#banner');
            const themeWarning = document.querySelector('#bd-header-version-warning');
            // pydata-sphinx-theme >= 0.15 (1.7+): use its own hidden container; the theme
            // removes any .bd-header-announcement once an announcement has been dismissed
            if (themeWarning !== null) {
                outer = themeWarning;
                middle.classList = "bd-header-announcement__content ms-auto me-auto";
                inner.classList = "sidebar-message";
                button.classList = "btn text-wrap font-weight-bold ms-3 my-1 align-baseline pst-button-link-to-stable-version";
            // for versions 0.23, 0.24, 1.0
            } else if (banner !== null) {
                outer = banner;
                outer.classList = "container-fluid alert-danger devbar";
                middle.classList = "row no-gutters";
                inner.classList = "col-12 text-center";
                button.classList = "btn btn-danger font-weight-bold ml-3 my-3 align-baseline";
            // for versions newer than 1.0
            } else if (parseFloat(version) > 1) {
                outer.classList = "bd-header-announcement container-fluid";
                middle.classList = "bd-header-announcement__content";
                inner.classList = "sidebar-message";
                button.classList = "sd-btn sd-btn-danger sd-shadow-sm sd-text-wrap font-weight-bold ms-3 my-3 align-baseline";
            // for versions older than 0.23
            } else {
                outer.style = "background-color: rgb(248, 215, 218); color: rgb(114, 28, 36); text-align: center;";
                button.style = "background-color: rgb(220, 53, 69); color: rgb(255, 255, 255); margin: 1rem; padding: 0.375rem 0.75rem; border-radius: 4px; display: inline-block; text-align: center;"
            }

            outer.appendChild(middle);
            middle.appendChild(inner);
            inner.innerText = "This is documentation for ";
            if (latestStable !== null && /^[0-9.]+$/.test(version) && compareVersions(version, latestStable) < 0) {
                inner.innerText += "an "
                bold.innerText = `old version (${version})`;
            } else {
                inner.innerText += "the "
                bold.innerText = "unstable development version";
            }
            inner.appendChild(bold);
            inner.appendChild(document.createTextNode(" of MNE-Python. "))
            inner.appendChild(button);
            if (outer === themeWarning) {
                const close = document.createElement("a");
                close.classList = "ms-3 my-1 align-baseline";
                close.innerHTML = '<i class="fa-solid fa-xmark"></i>';
                close.onclick = () => {
                    outer.remove();
                    const prefs = JSON.parse(localStorage.getItem("pst_banner_pref") || "{}");
                    prefs[version] = new Date().toISOString();
                    localStorage.setItem("pst_banner_pref", JSON.stringify(prefs));
                };
                outer.appendChild(close);
                outer.classList.remove("d-none");
            } else {
                document.body.prepend(outer);
            }
        })
    }
}

showVersionWarning();
