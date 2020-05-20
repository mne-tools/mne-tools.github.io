(function() {
    // adapted 2020-05 from https://scikit-learn.org/versionwarning.js
    const latestStable = '0.20.5';
    const goodPaths = ['stable', 'dev', latestStable];
    const showWarning = (msg) => {
        $('.body[role=main]').prepend(`<div class="d-block devbar alert alert-danger">${msg}</div>`)
    };
    if (location.hostname === 'mne.tools' || location.hostname.includes('circle-artifacts.com')) {
        const versionPath = location.pathname.split('/')[1];
        if (!goodPaths.includes(versionPath)) {
            const warning = `This is documentation for an old release of MNE-Python (version ${versionPath}).
            Try the <a href="https://mne.tools">latest stable release</a> (version ${latestStable})
            or the <a href="https://mne.tools/dev">development</a> (unstable) version.`;
            showWarning(warning)
        } else if (versionPath == 'dev') {
            const warning = `This is documentation for the unstable development version of MNE-Python.
            (To use it, <a href="https://mne.tools/dev/install/advanced.html#using-the-development-version-of-mne-python-latest-master">install latest master from GitHub</a>.)
            The latest stable release is <a href="https://mne.tools">version ${latestStable}</a>.`;
            showWarning(warning)
        }
    }
})()
