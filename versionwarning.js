(function() {
    // adapted 2020-05 from https://scikit-learn.org/versionwarning.js
    if (location.hostname === 'mne.tools') {
        const urlParts = location.pathname.split('/');
        const version = urlParts[1];
        const releases = Array.from(
            document.querySelector('.version-switcher__menu')
        );
        const latest_stable = parseFloat(
            releases.filter(
                ver => ver.getAttribute('data-version') == 'stable'
            )[0].getAttribute('data-version-name').split(' ')[0]
        )
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
                    // parse version to figure out which website theme classes to use
                    var pre = '<div class="bd-header-announcement container-fluid"><div class="bd-header-announcement__content"><div class="sidebar-message">';
                    var post = '</div></div></div>';
                    var anchor = 'class="sd-btn sd-btn-danger sd-shadow-sm sd-text-wrap font-weight-bold ms-3 my-3 align-baseline"';
                    if (parseFloat(version) < latest_stable) {  // 'dev' → NaN → false (which is what we want)
                        pre = '<div class="d-block devbar alert alert-danger">';
                        post = '</div>';
                        anchor = 'class="btn btn-danger" style="font-weight: bold; vertical-align: baseline; margin: 0.5rem; border-style: solid; border-color: white;"';
                    }
                    // triage message
                    var verText = `an <strong>old version (${version})</strong>`;
                    if (version == 'dev') {
                        verText = 'the <strong>unstable development version</strong>';
                    }
                    document.querySelector('body').prepend(`${pre}This is documentation for ${verText} of MNE-Python. <a ${anchor} href="https://mne.tools/stable/${filePath}">Switch to stable version</a>${post}`);
                }
            })
    }
})()
