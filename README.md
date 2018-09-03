# batterX Live&Smart Business (v18.9.1)

### Install the Live&Smart Monitoring App

Login to your Raspberry Pi using `Remote Desktop Connection` or directly using an HDMI display

Open the Linux `Terminal` and execute the following commands:

```
$ cd /home/pi

$ git clone https://github.com/batterx/livesmart-business.git

$ sudo cp /home/pi/livesmart-business/html /var/www -r
$ sudo chmod 777 /var/www -R

$ sudo rm /home/pi/DataLogger
$ sudo cp /home/pi/livesmart-business/DataLogger /home/pi
$ sudo chmod 777 /home/pi/DataLogger

$ sudo rm /home/pi/CloudStream
$ sudo cp /home/pi/livesmart-business/CloudStream /home/pi
$ sudo chmod 777 /home/pi/CloudStream

$ sudo cp /home/pi/livesmart-business/launcher.sh /home/pi
$ sudo chmod 777 /home/pi/launcher.sh

$ sudo rm /home/pi/livesmart-business -r

$ sudo mkdir /home/pi/logs
$ sudo chmod 777 /home/pi/logs
```

Run the `$ sudo crontab -e` and add the following line in it:

```
* * * * * sh /home/pi/launcher.sh >/home/pi/logs/crontab.log 2>&1
```

### Configure the App

Wait for 2-3 minutes...

Open the Web-browser and navigate to `http://localhost/phpliteadmin.php`. Login using password `batterx`.

Open the `/srv/bx/usv.db3` database and run the following query.  
Replace `SERIAL_NUMBER` with the Serial Number of your batterX Business UPS.

```sql
INSERT INTO "device_info" ("setting","value","mod_timestamp") VALUES ('device_serial_number','SERIAL_NUMBER','2017-11-10 13:12:07');
INSERT INTO "device_info" ("setting","value","mod_timestamp") VALUES ('device_model','batterX BS','2017-11-10 13:12:07');
```

> **NOTE:** To use the Live&Smart Cloud Monitoring App, your batterX Business UPS has to be registered using its serial number in the batterX Cloud.

### Reboot the Live&Smart

Finally, reboot the Raspberry Pi using `$ sudo reboot` and after 
