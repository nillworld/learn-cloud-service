# Jenkins

## Jenkins 설치

1. Docker Jenkins install

   ```sh
    sudo docker run -d --name jenkins -p 8080:8080 -p 50000:50000 -v /home/deploy/jenkins_v:/var/jenkins_home jenkins/jenkins:lts
   ```

2. 초기 Jenkins 계정 비밀번호 조회

   ```sh
    docker exec -it jenkins cat /var/jenkins_home/secrets/initialAdminPassword
   ```

3. 계정 설정 및 로그인 후 Jenkins에서 Docker 이미지 빌드를 하기 위해 "Docker Pipeline" 설치

4. 도커 파이프라인 설정.

- https://may9noy.tistory.com/359
- https://freedeveloper.tistory.com/181
- https://velog.io/@2012monk/Jenkins-%EC%84%A4%EC%B9%98%EB%B0%8F-%ED%8C%8C%EC%9D%B4%ED%94%84%EB%9D%BC%EC%9D%B8-%EA%B5%AC%EC%B6%95
- docker volume 오류 에러 - https://chiftkey.tistory.com/3
