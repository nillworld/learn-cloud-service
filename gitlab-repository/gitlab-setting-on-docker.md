# Gitlab setting on docker

## Set up the volume location

- docker volume과 local volume을 연결하기위한 path 변수 설정

  ```sh
  export GITLAB_HOME=/srv/gitlab
  ```

  - `$GITLAB_HOME/data` - `/var/opt/gitlab` : For storing application data.
  - `$GITLAB_HOME/log` - `/var/log/gitlab` : For storing logs.
  - `$GITLAB_HOME/config` - `/etc/gitlab` : For storing the GitLab configuration files.

## Docker run

- docker hub에 있는 gitlab 이미지 run

  ```sh
  sudo docker run --detach \
   --hostname gitlab.example.com \
   --publish 443:443 --publish 80:80 --publish 22:22 \
   --name gitlab \
   --restart always \
   --volume $GITLAB_HOME/config:/etc/gitlab \
   --volume $GITLAB_HOME/logs:/var/log/gitlab \
   --volume $GITLAB_HOME/data:/var/opt/gitlab \
   --shm-size 256m \
   gitlab/gitlab-ee:latest
  ```

  - 이때 `--publish 22:22` 이 부분엔서 port 충돌이 나서, `23:22`로 수정 하였음. 공식 문서 예시에는 똑같이 docker 이용 하는 건데 충돌이 안나는 것으로 보아, vm port와 충돌 나는것으로 추정.

## Get and set gitlab password

- `http://192.168.0.154`로 접속하면 gitlab 로그인 화면이 뜸. 이때 기본 계정 id는 `root`이다.

  ```sh
  sudo docker exec -it gitlab grep 'Password:' /etc/gitlab/initial_root_password
  ```

- password는 위와 같은 방법으로 초기 값을 읽어와서 복붙.
  - `The password file will be automatically deleted in the first reconfigure run after 24 hours.` 이렇게 언급한 것과 같이 24시간 내 기본값은 삭제 되는 것 같다. 즉, 새로 비밀번호 설정 필요.

## Hardware requirements

- CPU: 4 Cores (500명까지)
- Memory: 4 Gb (500명 까지)
- Storage: 설치를 위해 2.5Gb 필요.
  - CPU: 2 Cores, Memory: 4Gb의 VM에 설치하니 10분만에 많이 느려짐.

## Gitlab 비밀번호 재설정

1. gitlab 컨테이너로 접근

   ```sh
    docker exec -it gitlab /bin/bash
   ```

2. 입력 후 콘솔이 로드될 때 까지 기달림.

   ```sh
    gitlab-rails console -e production
   ```

3. 사용자 찾기

   ```sh
    user = User.where(id: 1).first
   ```

4. 비밀번호 변경

   ```sh
    user.password = '[password]'
    user.password_confirmation = '[password]'
   ```

5. 비밀번호 변경사항 저장

   ```sh
    user.save!
   ```

## Gitlab 연결

1. local에서 ssh keygen 생성 및 복사 (명령어 `ssh-keygen`입력 후 키 생성)
2. Gitlab 페이지에서 프로필 설정에 ssh keys에서 ssh key 등록
3. 프로젝트 clone. (ex. `git clone http://192.168.0.154:89/gitlab-instance-4391a29b/test-gitlab-server.git`)

## docker-compose setting

### centOS 기준 docker-compose 설치

1. Update Repositories and Packages

   ```sh
    sudo yum update &&\
    sudo yum upgrade &&\
    sudo yum install curl &&\
   ```

2. Download Docker Compose

   ```sh
    sudo curl -L "https://github.com/docker/compose/releases/download/1.24.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   ```

3. Permission change

   ```sh
    sudo chmod +x /usr/local/bin/docker-compose
   ```

4. Check installed docker-compose

   ```sh
    docker–compose –-version
   ```

### Deploy docker registry using compose file

1.  `docker-compose.yml` 파일 위치로 이동

2.  start docker compose

    ```sh
     docker-compose up -d
    ```

</br>
</br>

### reference

> install: \
> <https://docs.gitlab.com/ee/install/docker.html#install-gitlab-using-docker-compose> \
> 하드웨어 요구 사항: \
> <https://docs.gitlab.com/ee/install/requirements.html> \
> GitLab SSH Key 등록: \
> <https://haejun0317.tistory.com/271> \
> enterprise 가격정책: \
> <https://about.gitlab.com/pricing/self-managed/feature-comparison>
> Docker compose install(centOS): \
> <https://phoenixnap.com/kb/install-docker-compose-centos-7>
