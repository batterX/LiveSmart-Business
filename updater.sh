#!/bin/sh
# updater.sh

cd /home/pi

sudo rm -rf livesmart-business

git clone https://github.com/batterx/livesmart-business.git

sudo cp /home/pi/livesmart-business/update.sh /home/pi
sudo chmod 777 /home/pi/update.sh

sudo sh /home/pi/update.sh
