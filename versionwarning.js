(function() {
    // adapted 2020-05 from https://scikit-learn.org/versionwarning.js
    const latestStable = '0.20';
    const goodPaths = ['stable', 'dev', latestStable];
    const showWarning = (msg) => {
        $('body').prepend(`<div class="d-block devbar alert alert-danger">${msg}</div>`)
    };
    if (location.hostname === 'mne.tools' || location.hostname.includes('circle-artifacts.com')) {
        const versionPath = location.pathname.split('/')[1];
        if (!goodPaths.includes(versionPath)) {
            const warning = `This is documentation for an old release of MNE-Python (version ${versionPath}).
            Try the <a href="https://mne.tools">latest stable release</a> (version ${latestStable})
            or the <a href="https://mne.tools/dev">development</a> (unstable) version.`;
            showWarning(warning)
        }
    }
})()
