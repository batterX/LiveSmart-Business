#!/bin/sh
# launcher.sh

sleep 2

if ! pgrep -x "MqttStream" > /dev/null
then
	cd /
	cd home/pi
	sudo ./MqttStream &
	cd /
fi
