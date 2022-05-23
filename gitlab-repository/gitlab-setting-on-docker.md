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
