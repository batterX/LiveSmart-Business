#!/bin/sh
# updater.sh

sudo cp /home/pi/livesmart-business/html /var/www -r
sudo chmod 777 /var/www -R

sudo rm /home/pi/CloudStream
sudo cp /home/pi/livesmart-business/CloudStream /home/pi
sudo chmod 777 /home/pi/CloudStream

sudo cp /home/pi/livesmart-business/launcher.sh /home/pi
sudo chmod 777 /home/pi/launcher.sh

sudo cp /home/pi/livesmart-business/updater.sh /home/pi
sudo chmod 777 /home/pi/updater.sh

sudo mkdir /home/pi/logs
sudo chmod 777 /home/pi/logs

sudo rm /home/pi/program/BatterN
sudo cp /home/pi/livesmart-business/program/BatterN /home/pi/program
sudo chmod 777 /home/pi/program/BatterN
sudo chown pi /home/pi/program/BatterN

sudo rm /home/pi/program/TestDb
sudo cp /home/pi/livesmart-business/program/TestDb /home/pi/program
sudo chmod 777 /home/pi/program/TestDb
sudo chown pi /home/pi/program/TestDb



sudo kill $(pgrep "CloudStream")

sudo killall BatterN -9



sudo rm /home/pi/livesmart-business -r

sudo rm /home/pi/update.sh