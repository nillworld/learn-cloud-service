# Docker Repository

- Registry Server: Docker Registry container를 실행하는 호스트
- Client: Docker Registry server에 접근하는 클라이언트(ex- local PC)

## 1. Docker Registry 이미지 다운 및 실행

1. registry server에서 docker hub에 있는 공식 docker registry 이미지 다운.

   ```sh
   docker pull registry
   ```

2. docker registry 포트 5000번을 통한 실행.

   ```sh
   docker run -itd --name=dockerRegi -p 5000:5000 registry
   ```

   - < -i > -t와 같이 사용해야 합니다. 표준입력을 활성화시키며 컨테이너와 연결되어있지 않더라도 표준입력을 유지합니다.

   - < -t > -i옵션과 같이 사용해야 합니다. TTY모드로 사용하며 bash를 사용하기 위해서는 꼭 필요합니다.

   - < -d > 컨테이너를 백그라운드로 실행시킵니다. 실행시킨 뒤 docker ps 명령어로 컨테이너 실행을 확인할 수 있습니다.

## 2. Docker image 태그 및 Registry에 push

1. 기존에 있는 image에 tag를 하여 registry에 올릴 수 있는 형태로 만듬.

   ```sh
   docker tag nilltobesoft/theia 192.168.0.154:5000/theia
   ```

2. tag한 이미지를 registry에 업로드

   ```sh
   docker push 192.168.0.154:5000/theia
   ```

   - curl 명령어를 통해 해당 이미지 업로드 유무 확인

     ```sh
     curl -X GET http://192.168.0.154:5000/v2/_catalog
     ```

## 3. SSL 인증서 생성 및 적용

- 클라이언트와 Registry 서버는 https 프로토콜을 사용하므로 SSL 인증서를 생성하고 설치해 주어야 한다.

1. Registry 서버에서 SSL 인증서 생성

   1. SSL과 관련된 파일 저장하기 위한 '~/certs' 디렉토리를 생성

      ```sh
      mkdir ~/certs
      cd ~/certs
      openssl genrsa -des3 -out server.key 2048
      ```

   2. Private Key 생성

      ```sh
      openssl genrsa -des3 -out server.key 2048
      ```

      - 여기에선 server.key 라는 이름으로 생성.
      - private key에 사용할 비밀번호 입력.

   3. CSR 파일 생성

      ```sh
      openssl req -new -key server.key -out server.csr
      ```

      - CN 값에 registry server의 IP 주소 혹은 도메인 명을 입력.
      - 다른값은 공백이여도 상관 없음.

   4. key 파일의 암호화 해제

      ```sh
      openssl rsa -in server.key -out server.key
      ```

   5. SAN 설정을 위해 config 파일 생성.

      ```sh
      echo subjectAltName=IP:192.168.0.154 > extfile.cnf
      ```

   6. 자체서명인증서 생성.

      ```sh
      openssl x509 -req -days 800 -signkey server.key -in server.csr -out server.crt -extfile extfile.cnf
      ```

2. SSL 인증서 적용 ( Registry Sever )

   1. 인증서 적용을 위해 기존 컨테이너 제거

      ```sh
      docker stop dockerRegi && docker rm dockerRegi
      ```

   2. 인증서 폴더를 마운트 하여 컨테이너 실행

      ```sh
      docker run -itd --name=dockerRegi - ~/certs:/certs \
      -e REGISTRY_HTTP_ADDR=0.0.0.0:5000 \
      -e REGISTRY_HTTP_TLS_CERTIFICATE=/certs/server.crt \
      -e REGISTRY_HTTP_TLS_KEY=/certs/server.key -p 5000:5000 registry
      server.csr -out server.crt -extfile extfile.cnf
      ```

3. SSL 인증서 적용 ( Client )

   1. Registry에 있는 인증서를 Client에 옮김.

      ```sh
      scp root@192.168.0.154:~/certs
      ```

   2. 인증서를 시스템 인증 보관 폴더로 옮기고 적용. (CentOS 기준)

      ```sh
      cp certs/server.crt /etc/pki/ca-trust/source/anchors/server.crt
      update-ca-trust
      ```

   3. 도커 데몬 다시 실행

      ```sh
      service docker restart
      ```

## 4. Registry를 이용해서 push/pull

- 이미지 태그 후 push
- push: `docker push 192.168.0.154/theia`
- pull: `docker pull 192.168.0.154/theia`

</br>

### ++ 에러 발생시

만약 `x509: certificate signed by unknown authority` 에러가 발생하면, 아래와 같이 처리.

```sh
mkdir /etc/docker/certs.d
mkdir /etc/docker/certs.d/192.168.0.154:5000
cp ~/certs/server.crt /etc/docker/certs.d/192.168.0.154:5000/
```

- Docker는 hostname을 port와 같이 사용할 경우, docker가 어떤 인증서가 사용되어야 하는지에 대해서 추측하지 않는다. (192.168.0.101:5000, 127.0.0.1:8080 등) 따라서 포트 단위로 인증서를 제공해야 docker가 어떤 인증서를 사용해야 하는지 알 수 있다. 이를 위해서는 /etc/docker/certs.d/{hostname:port} 와 같이 'private container registry 서버의 IP 혹은 도메인명:포트번호' 로 구분되는 디렉터리 하위에 인증서를 저장해두어야 한다.
