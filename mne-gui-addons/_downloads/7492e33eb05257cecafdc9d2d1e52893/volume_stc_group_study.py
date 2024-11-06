""".. _ex-vol-stc-group:

====================================================
Volume Source Time Course Estimate for a Group Study
====================================================

In this example, we'll show how to use the MNE volume stc viewing
GUI to compare brain activity across subjects in a group study.
"""

# Authors: Alex Rockhill <aprockhill@mailbox.org>
#
# License: BSD-3-Clause

import os.path as op

import autoreject
import mne
import numpy as np
from mne.time_frequency import csd_tfr

import mne_gui_addons as mne_gui

fs_dir = mne.datasets.fetch_fsaverage(verbose=True)
subjects_dir = op.dirname(fs_dir)

template = "fsaverage"
trans = "fsaverage"  # MNE has a built-in fsaverage transformation
src = mne.read_source_spaces(op.join(fs_dir, "bem", "fsaverage-vol-5-src.fif"))
bem = mne.read_bem_solution(
    op.join(fs_dir, "bem", "fsaverage-5120-5120-5120-bem-sol.fif")
)

# basic task parameters
tmin, tmax = -1.0, 4.0
active_win = (0, 4)
baseline_win = (-1, 0)
event_id = dict(hands=2, feet=3)
runs = [6, 10, 14]  # motor imagery: hands vs feet

# %%
# Compute source time course (stc) estimates for both time courses
# and spectrograms (time-frequency).

montage = mne.channels.make_standard_montage("standard_1005")
stcs_tfr = list()
stcs_epochs = list()
insts_tfr = list()
insts_epochs = list()
for sub in range(1, 4):
    print(f"Computing source estimate for subject {sub}")
    raw_fnames = mne.datasets.eegbci.load_data(subject=sub, runs=runs, update_path=True)
    raw = mne.concatenate_raws(
        [
            mne.io.read_raw(raw_fname, preload=True, verbose=False)
            for raw_fname in raw_fnames
        ]
    )
    mne.datasets.eegbci.standardize(raw)  # set channel names
    raw.set_montage(montage, verbose=False)

    # make epochs
    events, _ = mne.events_from_annotations(raw, event_id=dict(T1=2, T2=3))

    picks = mne.pick_types(
        raw.info, meg=False, eeg=True, stim=False, eog=False, exclude="bads"
    )
    epochs = mne.Epochs(
        raw,
        events,
        event_id,
        tmin - 0.5,
        tmax + 0.5,
        proj=True,
        picks=picks,
        baseline=None,
        preload=True,
    )
    del raw
    epochs.set_eeg_reference(projection=True)

    # reject bad epochs
    reject = autoreject.get_rejection_threshold(epochs)
    epochs.drop_bad(reject=reject)

    epochs.filter(l_freq=1, h_freq=None)
    ica = mne.preprocessing.ICA(n_components=15, random_state=11)
    ica.fit(epochs)

    eog_idx, scores = ica.find_bads_eog(epochs, ch_name="Fp1")
    muscle_idx, scores = ica.find_bads_muscle(epochs)
    ica.apply(epochs, exclude=eog_idx + muscle_idx)

    # make forward model
    fwd = mne.make_forward_solution(
        epochs.info, trans=trans, src=src, bem=bem, eeg=True, mindist=5.0
    )

    rank = mne.compute_rank(epochs, tol=1e-6, tol_kind="relative")

    # compute cross-spectral density matrices
    freqs = np.logspace(np.log10(12), np.log10(30), 9)

    # time-frequency decomposition
    epochs_tfr = mne.time_frequency.tfr_morlet(
        epochs,
        freqs=freqs,
        n_cycles=freqs / 2,
        return_itc=False,
        average=False,
        output="complex",
    )

    baseline_csd = csd_tfr(epochs_tfr, tmin=baseline_win[0], tmax=baseline_win[1])

    epochs_tfr.decimate(20)  # decimate for speed
    insts_tfr.append(epochs_tfr)

    # Compute source estimate using MNE solver
    snr = 3.0
    lambda2 = 1.0 / snr**2
    method = "MNE"  # use MNE method (could also be dSPM or sLORETA)

    epochs.decimate(20)
    insts_epochs.append(epochs)

    # do time-series epochs first
    baseline_cov = mne.compute_covariance(epochs, tmax=0)
    inverse_operator = mne.minimum_norm.make_inverse_operator(
        epochs.info, fwd, baseline_cov
    )
    stcs_epochs.append(
        mne.minimum_norm.apply_inverse_epochs(
            epochs,
            inverse_operator,
            lambda2,
            method=method,
            pick_ori="vector",
            return_generator=True,
        )
    )

    # make a different inverse operator for each frequency so as to properly
    # whiten the sensor data
    stcs = list()
    for freq_idx in range(epochs_tfr.freqs.size):
        # for each frequency, compute a separate covariance matrix
        baseline_cov = baseline_csd.get_data(index=freq_idx, as_cov=True)
        # only normalize by real
        baseline_cov["data"] = baseline_cov["data"].real
        # then use that covariance matrix as normalization for the inverse
        # operator
        inverse_operator = mne.minimum_norm.make_inverse_operator(
            epochs.info, fwd, baseline_cov
        )

    # finally, compute the stcs for each epoch and frequency
    stcs = mne.minimum_norm.apply_inverse_tfr_epochs(
        epochs_tfr,
        inverse_operator,
        lambda2,
        method=method,
        pick_ori="vector",
        return_generator=True,
    )

    # append to group
    stcs_tfr.append(stcs)

# %%
# Use the viewer to explore the time-course source estimates.

viewer = mne_gui.view_vol_stc(
    stcs_epochs,
    group=True,
    freq_first=False,
    subject=template,
    subjects_dir=subjects_dir,
    src=src,
    inst=insts_epochs,
    tmin=tmin,
    tmax=tmax,
)
viewer.go_to_extreme()  # show the maximum intensity source vertex
viewer.set_cmap(vmin=0.25, vmid=0.8)
viewer.set_3d_view(azimuth=40, elevation=35, distance=300)
del stcs_epochs, insts_epochs

# %%
# Use the viewer to explore the time-frequency source estimates, we'll
# use the power in this case but you can also view inter-trial coherence (itc).

viewer = mne_gui.view_vol_stc(
    stcs_tfr,
    group="power",  # can also be "itc"
    subject=template,
    subjects_dir=subjects_dir,
    src=src,
    inst=insts_tfr,
    tmin=tmin,
    tmax=tmax,
)
viewer.go_to_extreme()  # show the maximum intensity source vertex
viewer.set_cmap(vmin=0.25, vmid=0.8)
viewer.set_3d_view(azimuth=40, elevation=35, distance=300)
del stcs_tfr, insts_tfr
