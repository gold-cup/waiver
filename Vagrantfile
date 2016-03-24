Vagrant.configure(2) do |config|

  config.vm.box = "ubuntu/trusty64"
  config.vm.network :forwarded_port, guest: 9200, host: 9200
  config.vm.provider "virtualbox" do |vb|
    vb.memory = 1024
  end

  config.vm.provision "shell", inline: <<-SHELL
    curl -s https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add -
    echo 'deb https://deb.nodesource.com/node_5.x trusty main' > /etc/apt/sources.list.d/nodesource.list
    apt-get update
    apt-get install -y git nodejs nodejs-legacy build-essential libcairo2-dev libjpeg-dev libgif-dev libpango1.0-dev
    npm install -g webpack
  SHELL
end
