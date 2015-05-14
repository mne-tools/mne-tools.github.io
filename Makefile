# This script assumes mne-tools.github.io lives in the same
# directory as mne-python

all: copy push

copy-dev:
	cp -R ../mne-python/doc/build/html/* dev/

copy-stable:
	cp -R ../mne-python/doc/build/html/* stable/

push:
	git commit -am 'ENH: Update'
	git push origin master

