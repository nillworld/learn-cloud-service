# Service

- pod는 시스템장애나 성능 장애로 인해 재생성 될 수 있는데, 이때 ip가 달라지므로 service를 통해서 접속.
- service는 사용자가 삭제하지 않는 한 유지됨.

## ClusterIP

- 클러스터 내에서만 접근 가능 (외부에서는 접근 불가)
- 클러스터에 접근 가능한 사람 즉, 운영자가 이용. 내부 대쉬보드를 이용하거나 pod의 서비스 상태 디버깅.
- service를 여러개의 pod에 연결했다면, service에서 자동으로 트래픽 분산
- Service와 Pod를 연결하기 위해 selector와 label이용.
- Service의 type의 default는 ClusterIP

  Pod

  ```yaml
  apiVersion: v1
  kind: Pod
  metadata:
  name: pod-1
  labels:
    app: pod
  spec:
    nodeSelector:
      kubernetes.io/hostname: k8s-node1
    containers:
      - name: container
        image: kubetm/app
        ports:
          - containerPort: 8080
  ```

  Service

  ```yaml
  apiVersion: v1
  kind: Service
  metadata:
  name: svc-1
  spec:
    selector:
      app: pod
    ports:
      - port: 9000
        targetPort: 8080
    type: ClusterIP
  ```

## NodePort

- 클러스터내의 모든 node에 똑같은 port를 할당.
- nodePort의 할당 가능 범위는 30000 ~ 32767 (넣지 않는다면 이 범위내에 자동으로 할당)
- 특정 node를 통해서 접속해도 이 특정 노드가 아닌 다른 노드에 있는 pod를 Service가 연결 할 수 있는데, 이를 원하지 않는다면 다음과 같은 옵션을 입력
  - externalTrafficPolicy: Local
- 호스트 IP는 보안때문에 내부에서만 접근할 수 있도록 네트워크를 구성하기 때문에 NodePort는 데모나 임시 연결용으로 사용한다.

  Service

  ```yaml
  apiVersion: v1
  kind: Service
  metadata:
    name: svc-2
  spec:
    selector:
      app: pod
    ports:
      - port: 9000
        targetPort: 8080
        nodePort: 30000
    type: NodePort
    externalTrafficPolicy: Local
  ```

## Load Balancer

- NodePort 특징 + Load Balancer(각각의 노드에 트래픽 분산 역할)
- Node Port는 자동으로 할당
- Load Balancer에 접속하기 위한 ip는 쿠버네티스에서 해주는 것이 아닌 별로도 외부 접속 ip를 할당 해 주는 플러그인이 설치 되어 있어야 함.(AWS, GCP, Azure, OpenStack 등 쿠버네티스 플랫폼을 사용하면 플랫폼에 자체적으로 플러그인이 설치되어 있어서 알아서 ip 생성해 줌)
- 외부ip를 할당 해 주는 플러그인이 없으면 서비스는 pending 상태가 됨.
- 외부 시스템 노출용으로, 서비스 운영할 때 사용.

  ```yaml
  apiVersion: v1
  kind: Service
  metadata:
    name: svc-3
  spec:
    selector:
      app: pod
    ports:
      - port: 9000
        targetPort: 8080
    type: LoadBalancer
  ```
