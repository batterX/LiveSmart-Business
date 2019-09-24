#!/bin/sh
# updater.sh

sudo rm /home/pi/DataLogger
sudo cp /home/pi/livesmart-business/DataLogger /home/pi
sudo chmod 777 /home/pi/DataLogger

#sudo rm /home/pi/CloudStream
#sudo cp /home/pi/livesmart-business/CloudStream /home/pi
#sudo chmod 777 /home/pi/CloudStream

#sudo rm /home/pi/GetApikey
#sudo cp /home/pi/livesmart-business/GetApikey /home/pi
#sudo chmod 777 /home/pi/GetApikey

sudo cp /home/pi/livesmart-business/launcher.sh /home/pi
sudo chmod 777 /home/pi/launcher.sh

sudo rm /home/pi/livesmart-business -r

sudo mkdir /home/pi/logs
sudo chmod 777 /home/pi/logs

sudo rm /home/pi/update.sh