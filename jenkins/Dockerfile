# Jenkins LTS + JDK17 tabanı
FROM jenkins/jenkins:lts-jdk17

USER root

# Sistem araçları
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates curl git gnupg \
  && rm -rf /var/lib/apt/lists/*

# Docker resmi apt reposunu ekle ve sadece CLI + compose-plugin kur
RUN install -m 0755 -d /etc/apt/keyrings \
  && curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg \
  && chmod a+r /etc/apt/keyrings/docker.gpg \
  && . /etc/os-release \
  && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian $VERSION_CODENAME stable" \
     > /etc/apt/sources.list.d/docker.list \
  && apt-get update \
  && apt-get install -y --no-install-recommends docker-ce-cli docker-compose-plugin \
  && rm -rf /var/lib/apt/lists/*

# Jenkins pluginleri (Pipeline + Git + SCM’den Jenkinsfile okuma + GitHub)
# İstediğin gibi çoğaltıp/çıkarabilirsin.
RUN jenkins-plugin-cli --plugins \
  workflow-aggregator \
  workflow-scm-step \
  pipeline-model-definition \
  git git-client \
  github github-branch-source

# (Opsiyonel) docker grubunu oluştur; jenkins kullanıcısını bu gruba ekle
# Not: Host'taki /var/run/docker.sock GID'i farklıysa container run aşamasında group_add vermen gerekebilir.
RUN getent group docker || groupadd -g 999 docker \
  && usermod -aG docker jenkins

# Setup wizard'ı geç
ENV JAVA_OPTS="-Djenkins.install.runSetupWizard=false"

USER jenkins
WORKDIR /var/jenkins_home
