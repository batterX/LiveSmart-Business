#!/bin/sh
# updater.sh



sudo rm /home/pi/program/BatterN
sudo cp /home/pi/livesmart-business/program/BatterN /home/pi/program
sudo chmod 777 /home/pi/program/BatterN

sudo rm /home/pi/program/TestDb
sudo cp /home/pi/livesmart-business/program/TestDb /home/pi/program
sudo chmod 777 /home/pi/program/TestDb



sudo rm /home/pi/CloudStream
sudo cp /home/pi/livesmart-business/CloudStream /home/pi
sudo chmod 777 /home/pi/CloudStream

sudo cp /home/pi/livesmart-business/launcher.sh /home/pi
sudo chmod 777 /home/pi/launcher.sh

sudo cp /home/pi/livesmart-business/updater.sh /home/pi
sudo chmod 777 /home/pi/updater.sh

sudo mkdir /home/pi/logs
sudo chmod 777 /home/pi/logs



sudo apt-get install libcurl4-openssl-dev -y



sudo kill $(pgrep "CloudStream")

sqlite3 /srv/bx/ram/currentC.db3 "INSERT into CommandsIn (type,entity) values (9,1);"



sudo rm /home/pi/livesmart-business -r

sudo rm /home/pi/update.sh