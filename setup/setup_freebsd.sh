#/bin/sh

# Requires root privileges

cd /home/robert/br

npm install

cp ./setup/br_service /usr/local/etc/rc.d/br

printf '\nbr_enable="YES"\n' >> /etc/rc.conf

mkdir -p /usr/local/etc/nginx/sites-enabled

cp ./setup/br_nginx /usr/local/etc/nginx/sites-enabled/br
