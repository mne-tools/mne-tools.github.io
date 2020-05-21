(function() {
    // adapted 2020-05 from https://scikit-learn.org/versionwarning.js
    const latestStable = '0.20';
    const goodPaths = ['stable', 'dev', latestStable];
    const devbar_style = [
        'text-align: center',
        'padding: 5px',
        'margin-bottom: 5px',
        'border-radius: 0 0 4px 4px !important',
        'background-color: #e74c3c',
        'border-color: #e74c3c',
        'color: #ffffff',
    ].join('; ')
    const showWarning = (msg) => {
        $('body').prepend(`<div class="d-block devbar alert alert-danger" style="${devbar_style}">${msg}</div>`)

    };
    if (location.hostname === 'mne.tools' || location.hostname.includes('circle-artifacts.com')) {
        const versionPath = location.pathname.split('/')[1];
        if (!goodPaths.includes(versionPath)) {
            const link_style = "color: #ffffff; font-weight: bold"
            const warning = `This is documentation for an old release of MNE-Python (version ${versionPath}).
            Try the <a style="${link_style}" href="https://mne.tools">latest stable release</a> (version ${latestStable})
            or the <a style="${link_style}" href="https://mne.tools/dev">development</a> (unstable) version.`;
            showWarning(warning)
        }
    }
})()
