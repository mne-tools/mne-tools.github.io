"""
.. _ex-xdawn-denoising:

===============
XDAWN Denoising
===============

XDAWN filters are trained from epochs, signal is projected in the sources
space and then projected back in the sensor space using only the first two
XDAWN components. The process is similar to an ICA, but is
supervised in order to maximize the signal to signal + noise ratio of the
evoked response :footcite:`RivetEtAl2009, RivetEtAl2011`.

.. warning:: As this denoising method exploits the known events to
             maximize SNR of the contrast between conditions it can lead
             to overfitting. To avoid a statistical analysis problem you
             should split epochs used in fit with the ones used in
             apply method.
"""

# Authors: Alexandre Barachant <alexandre.barachant@gmail.com>
#
# License: BSD-3-Clause

# %%


from mne import io, compute_raw_covariance, read_events, pick_types, Epochs
from mne.datasets import sample
from mne.preprocessing import Xdawn
from mne.viz import plot_epochs_image

print(__doc__)

data_path = sample.data_path()

# %%
# Set parameters and read data
meg_path = data_path / "MEG" / "sample"
raw_fname = meg_path / "sample_audvis_filt-0-40_raw.fif"
event_fname = meg_path / "sample_audvis_filt-0-40_raw-eve.fif"
tmin, tmax = -0.1, 0.3
event_id = dict(vis_r=4)

# Setup for reading the raw data
raw = io.read_raw_fif(raw_fname, preload=True)
raw.filter(1, 20, fir_design="firwin")  # replace baselining with high-pass
events = read_events(event_fname)

raw.info["bads"] = ["MEG 2443"]  # set bad channels
picks = pick_types(raw.info, meg=True, eeg=False, stim=False, eog=False, exclude="bads")
# Epoching
epochs = Epochs(
    raw,
    events,
    event_id,
    tmin,
    tmax,
    proj=False,
    picks=picks,
    baseline=None,
    preload=True,
    verbose=False,
)

# Plot image epoch before xdawn
plot_epochs_image(epochs["vis_r"], picks=[230], vmin=-500, vmax=500)

# %%
# Now, we estimate a set of xDAWN filters for the epochs (which contain only
# the ``vis_r`` class).

# Estimates signal covariance
signal_cov = compute_raw_covariance(raw, picks=picks)

# Xdawn instance
xd = Xdawn(n_components=2, signal_cov=signal_cov)

# Fit xdawn
xd.fit(epochs)

# %%
# Epochs are denoised by calling ``apply``, which by default keeps only the
# signal subspace corresponding to the first ``n_components`` specified in the
# ``Xdawn`` constructor above.
epochs_denoised = xd.apply(epochs)

# Plot image epoch after Xdawn
plot_epochs_image(epochs_denoised["vis_r"], picks=[230], vmin=-500, vmax=500)

# %%
# References
# ----------
# .. footbibliography::
