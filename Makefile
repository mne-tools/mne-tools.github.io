# This script assumes mne-tools.github.io lives in the same
# directory as mne-python

copy-dev: pull
	rm -rf dev
	cp -R ../mne-python/doc/_build/html dev

copy-stable: pull
	cp -R ../mne-python/doc/build/html_stable/* stable/

pull:
	git fetch origin
	git reset --hard origin/master

push:
	git commit -am 'ENH: Update'
	git push origin master

dev: pull copy-dev push

stable: pull copy-stable push

