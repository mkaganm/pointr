FROM jenkins/jenkins:lts

USER root

# Install Docker CLI
RUN curl -fsSL https://get.docker.com | sh

# Add Jenkins user to the docker group
RUN usermod -aG docker jenkins

# Get the latest Docker Compose version
RUN DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | \
    grep -Po '"tag_name": "\K.*?(?=")') && \
    curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" \
    -o /usr/local/bin/docker-compose && \
    chmod +x /usr/local/bin/docker-compose

USER jenkins

# Ortam değişkenleri
ENV JAVA_OPTS="-Djenkins.install.runSetupWizard=false"

# Çalışma dizini
WORKDIR /var/jenkins_home
