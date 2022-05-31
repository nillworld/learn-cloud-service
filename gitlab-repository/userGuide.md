# Gitlab User Guide

## 프로젝트 생성 및 공유

1. gitlab root 계정으로 user(application manager) 생성
   - gitlab repository 관리자(root)가 application manager를 위한 user 생성
   - user 생성 시, 해당 user의 프로젝트 생성 가능 개수 제한
   - user 생성 시, 그룹 생성 제한 (권한을 부여하면 그룹 내에서 여러 프로젝트 생성 가능 )
   - 생성 후, gitlab의 메일 서버가 없으므로 해당 user의 edit 메뉴를 통한 임시 패스워드 설정
2. Application manager는 임시 패스워드로 로그인 후 비밀번호 재설정 및 프로젝트 생성
3. Application manager는 생성한 프로젝트에서 token 생성 후, application developers에게 token 전달.
4. Application developers는 전달받은 token을 이용하여 프로젝트 접근

## Admin 계정은 private project라도 접근 가능하다.

- https://gitlab.com/gitlab-org/gitlab-foss/-/issues/21322
