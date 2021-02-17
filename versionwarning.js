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
            var pre = '<div class="container-fluid alert-danger devbar"><div class="row no-gutters"><div class="col-12 text-center">';
            var post = '</div></div></div>';
            var anchor = 'class="alert-link"';
            if (parseFloat(version) < 0.23) {  // 'stable' or 'dev' → NaN → false (which is what we want)
                pre = '<div class="d-block devbar alert alert-danger" style="font-weight: normal;"></div>';
                post = '</div>';
                anchor = 'style="font-weight: bold; color: #fff;"';
            }
            // triage message
            var verText = `an old version (${version})`;
            var devLink = `, or the (unstable) <a ${anchor} href="https://mne.tools/dev/${filePath}">development version</a>`;
            if (version == 'dev') {
                verText = 'the <em>unstable development version</em>';
                devLink = '';
            }
            $('body').prepend(`${pre}This is documentation for ${verText} of MNE-Python. Switch to the <a ${anchor} href="https://mne.tools/stable/${filePath}">stable version</a>${devLink}.${post}`);
        }
    }
})()
