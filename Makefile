# This script assumes mne-tools.github.io lives in the same
# directory as mne-python

copy-dev:
	cp -R ../mne-python/doc/build/html_dev/* dev/

copy-stable:
	cp -R ../mne-python/doc/build/html_stable/* stable/

push:
	git commit -am 'ENH: Update'
	git push origin master

