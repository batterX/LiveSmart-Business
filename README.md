# batterX Live&Smart Business (v18.9.1)

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

### Configure the App

Wait for 2-3 minutes...

Open the Web-browser and navigate to `http://localhost/phpliteadmin.php`. Login using password `batterx`.

Open the `/srv/bx/usv.db3` database and run the following query.  
Replace `SERIAL_NUMBER` with the Serial Number of your batterX Business UPS.

```sql
INSERT INTO "device_info" ("setting","value","mod_timestamp") VALUES ('device_serial_number','SERIAL_NUMBER',CURRENT_TIMESTAMP);
INSERT INTO "device_info" ("setting","value","mod_timestamp") VALUES ('device_model','batterX BS',CURRENT_TIMESTAMP);
```

> **NOTE:** To use the Live&Smart Cloud Monitoring App, your batterX Business UPS has to be registered using its serial number in the batterX Cloud (Use ./GetApikey to get the apikey of the Live&Smart).

### Reboot the Live&Smart

Finally, reboot the Raspberry Pi using the `$ sudo reboot` command and after 5-10 minutes the App sould start working.
