(function() {
    // adapted 2020-05 from https://scikit-learn.org/versionwarning.js
    if (location.hostname === 'mne.tools') {
        const urlParts = location.pathname.split('/');
        const version = urlParts[1];
        // see if filePath exists in the stable version of the docs
        var filePath = urlParts.slice(2).join('/');
        $.ajax({
            type: 'HEAD',
            url: `https://mne.tools/stable/${filePath}`,
        }).fail(function() {
            filePath = '';
        });
        if (version !== 'stable') {
            // parse version to figure out which website theme classes to use
            var pre = '<div class="container-fluid alert-danger devbar"><div class="row no-gutters"><div class="col-12 text-center text-dark">';
            var post = '</div></div></div>';
            var anchor = 'class="btn btn-danger alert-link font-weight-bold ml-3 my-3 d-md align-baseline text-white"';
            if (parseFloat(version) < 0.23) {  // 'stable' or 'dev' → NaN → false (which is what we want)
                pre = '<div class="d-block devbar alert alert-danger font-weight-normal">';
                post = '</div>';
                const style = 'vertical-align: baseline; margin-left: 0.5rem; margin-top: 0.5rem; margin-bottom: 0.5rem; border-style: solid; border-color: white;';
                anchor = `class="btn btn-danger d-md font-weight-bold" style="${style}"`;
            }
            // triage message
            var verText = `an <strong>old version (${version})</strong>`;
            if (version == 'dev') {
                verText = 'the <strong>unstable development version</strong>';
            }
            $('body').prepend(`${pre}This is documentation for ${verText} of MNE-Python. <a ${anchor} href="https://mne.tools/stable/${filePath}">Switch to stable version</a>${post}`);
        }
    }
})()
