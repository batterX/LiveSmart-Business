#!/bin/sh
# launcher.sh

if ! pgrep -x "DataLogger" > /dev/null
then
	cd /
	cd home/pi
	sudo ./DataLogger
	cd /
fi

if ! pgrep -x "CloudStream" > /dev/null
then
	cd /
	cd home/pi
	sudo ./CloudStream
	cd /
fi
