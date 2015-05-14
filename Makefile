# This script assumes mne-tools.github.io lives in the same
# directory as mne-python

all: copy push

copy:
	cp -R ../mne-python/doc/build/html/* .

push:
	git commit -am 'ENH: Update'
	git push origin master

