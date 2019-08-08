# batterX liveX Business (v19.8.1)

### Install the Monitoring App

Login to your Raspberry Pi using `Remote Desktop Connection` or directly using an HDMI display

Open the Linux `Terminal` and execute the following commands:

```
$ cd /home/pi

$ git clone https://github.com/batterx/livesmart-business.git

$ sudo cp /home/pi/livesmart-business/update.sh /home/pi
$ sudo chmod 777 /home/pi/update.sh

$ sudo sh /home/pi/update.sh
```

Run the `$ sudo crontab -e` and add the following line in it:

```
* * * * * sh /home/pi/launcher.sh >/home/pi/logs/crontab.log 2>&1
```

### Reboot the liveX

Finally, reboot the Raspberry Pi using the `$ sudo reboot` command and after 5-10 minutes the App sould start working.
