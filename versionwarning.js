(function() {
    // adapted 2020-05 from https://scikit-learn.org/versionwarning.js
    if (location.hostname === 'mne.tools') {
        const urlParts = location.pathname.split('/');
        const version = urlParts[1];
        var filePath = urlParts.slice(2).join('/');
        // see if filePath exists in the stable version of the docs
        $.ajax({
            type: 'HEAD',
            url: `https://mne.tools/stable/${filePath}`,
        }).fail(function() {
            filePath = '';
        });
        if (version !== 'stable') {
            var verText = `an old version (${version})`;
            var devLink = `, or the (unstable) <a class="alert-link" href="https://mne.tools/dev/${filePath}">development version</a>`;
            if (version == 'dev') {
                verText = 'the <em>unstable development version</em>';
                devLink = '';
            }
            $('body').prepend(`<div class="container-fluid alert-danger devbar"><div class="row no-gutters"><div class="col-12 text-center">This is documentation for ${verText} of MNE-Python. Switch to the <a class="alert-link" href="https://mne.tools/stable/${filePath}">stable version</a>${devLink}.</div></div></div>`);
        }
    }
})()
