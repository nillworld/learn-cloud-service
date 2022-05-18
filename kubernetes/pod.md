# Pod

- 하나의 컨테이너에서 두개의 포트를 가질 수 있지만, 파드 안에서 포트를 중복으로 쓸 수는 없다.

- pod의 ip는 자동할당. pod가 재실행 되면 새로운 ip로 재할당(휘발성이 있는 ip).

## label

- object를 목적에 따라 분류하기 위해 사용
- pod뿐만 아니라 모든 object에 달 수 있는데, pod에서 많이 쓰임.
- "Key:Value" 형태로 label를 달음.

## Node Schedule

- nodeSelector를 통해 직접 선택할 수 있다. spec.nodeSelector.hostname: node1
- node scheduler가 판단하여 할당.

  ```yaml
  apiVersion: v1
  kind: Pod
  metadata:
    name: pod-4
  spec:
    containers:
      - name: container
        image: tmkube/init
        resources:
          request:
            memory: 2Gi
          limits:
            memory: 3Gi
  ```

  - pod에서 requests: 필요 자원 크기 명시
  - pod에서 limits: pod의 최대 허용 자원 크기 명시
  - memory는 limits 초과시 pod 종료.
  - cpu는 limits 초과시 requests까지 낮춤.
  - k8s는 노드에 점수를 매겨서 높은 점수가 있는 곳에 pod 생성. 점수에 큰 영향을 끼치는게 남은 자원의 용량
