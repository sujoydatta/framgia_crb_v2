FROM ubuntu:16.04

RUN apt-get update

# basics
RUN apt-get install -y nginx openssh-server git-core openssh-client curl
RUN apt-get install -y nano
RUN apt-get install -y build-essential libmysqlclient-dev

RUN curl -sL https://deb.nodesource.com/setup_7.x | bash -
RUN apt-get install -y nodejs

# Install eslint from https://www.npmjs.com/package/eslint
RUN npm install -g eslint
RUN /bin/bash -l -c "eslint --version"

# install RVM, Ruby, and Bundler
RUN curl -sSL https://rvm.io/mpapis.asc | gpg --import -
RUN  \curl -L https://get.rvm.io | bash -s stable
RUN /bin/bash -l -c "rvm requirements"
RUN /bin/bash /etc/profile.d/rvm.sh
RUN /bin/bash -l -c "rvm install 2.4.0"
RUN /bin/bash -l -c "gem install bundler --no-ri --no-rdoc"

COPY Gemfile /cache/Gemfile
COPY Gemfile.lock /cache/Gemfile.lock

RUN /bin/bash -l -c "cd /cache && bundle install --without production"

RUN curl -o /usr/bin/framgia-ci https://raw.githubusercontent.com/framgia/ci-report-tool/master/dist/framgia-ci && chmod +x /usr/bin/framgia-ci
