# Volume

## emptyDir

- pod내 컨테이너끼리 파일 공유할 때 쓰임.
- 최초로 해당 볼륨을 사용할 땐 비어있으므로 emptyDir라고 명칭 됨.
- pod 안에서 생성되는 volume이기 때문에 pod 삭제시 없어짐. 그러므로 이 volume에 쓰는 데이터는 일시적으로 쓰는 데이터만 넣는게 좋음.

  ```yaml
  apiVersion: v1
  kind: Pod
  metadata:
  name: pod-volume-1
  spec:
  containers:
    - name: container1
      image: kubetm/init
      volumeMounts:
        - name: empty-dir
          mountPath: /mount1
    - name: container2
      image: kubetm/init
      volumeMounts:
        - name: empty-dir
          mountPath: /mount2
  volumes:
    - name: empty-dir
      emptyDir: {}
  ```

  - 위의 volume 형태는 컨테이너마다 다른 mountPath를 가지고 있지만 같은 volume을 mount하고 있다.
  - volume 속성은 마지막에 명시되어 있는것처럼 사용. `emptyDir: {}`

## hostPath

- pod가 올라가 있는 node에 volume 생성
- pod가 재생성 될 때, 해당 node에 자원이 부족해서 다른 node에 pod가 생성 된다면 hostPath는 원래 마운트 했던node의 hostPath로 마운트 할 수 없다.(기존 node에 있는 volume을 새로운 node와 마운트하여 사용할 수 있겠지만 좋은 방법은 아님.)
- hostPath는 pod에서 자신이 해당하는 node의 파일(설정파일 등)을 읽거나 쓸때 즉, node의 데이터를 pod에서 써야할 때 사용.
- 마운트하려는 node의 volume directory는 사전에 생성되어 있어야 함.
- `DirectoryOrCreate`옵션은, 주어진 경로에 아무것도 없다면, 필요에 따라 Kubelet이 가지고 있는 동일한 그룹과 소유권, 권한을 0755로 설정한 빈 디렉터리를 생성한다.

  ```yaml
  apiVersion: v1
  kind: Pod
  metadata:
    name: pod-volume-3
  spec:
    nodeSelector:
      kubernetes.io/hostname: k8s-node1
    containers:
      - name: container
        image: kubetm/init
        volumeMounts:
          - name: host-path
            mountPath: /mount1
    volumes:
      - name: host-path
        hostPath:
          path: /node-v
          type: DirectoryOrCreate
  ```

## PVC/PV

- local volume 뿐만 아니라 aws나 git 혹은 NFS를 사용하여 다른 서버와 연결하여 사용.
- Pod에 영속성 있는 volume을 제공하기 위해 사용.
- Persistent Volume(PV)는 Pod와 바로 연결되지 않고, Persistent Volume Claim(PVC)을 통해 연결.
- 쿠버네티스는 Admin(쿠버네티스 운영자 - PV와 volume 관리) 영역과 User(Pod에 서비스 만들고 배포를 담당하는 배포담당자 - Pod와 PVC 관리) 영역으로 나누어서 관리.
- Admin이 volume을 마운트하기 위해 PV를 만들어 놓으면, User가 PVC를 이용해 접근.

### PV

- 관리자에 의해 설정된 스토리지 볼륨 마운트 (볼륨 역할을 하는 스토리지를 마운트)
- PVC와 연결 했다면 해당 PV는 다른 PVC와 연결할 수 없음.

  ```yaml
  apiVersion: v1
  kind: PersistentVolume
  metadata:
  name: pv-03
  spec:
  capacity:
    storage: 2G
  accessModes:
    - ReadWriteOnce
  local:
    path: /node-v
  nodeAffinity:
    required:
      nodeSelectorTerms:
        - matchExpressions:
            - { key: kubernetes.io/hostname, operator: In, values: [k8s-node1] }
  ```

### PVC

- Pod에서 PV와 연결할 때 쓰기 위한 요청

  ````yaml
  apiVersion: v1
  kind: PersistentVolumeClaim
  metadata:
  name: pvc-01
  spec:
  accessModes:
  - ReadWriteOnce
  resources:
   requests:
     storage: 1G
  storageClassName: ""
  	 ```
  ````

  - `storageClassName: ""`옵션은 현재 만들어진 PV를 통해서만 연결한다는 의미.

  </br>

  pod

  ```yaml
  apiVersion: v1
  kind: Pod
  metadata:
  name: pod-volume-3
  spec:
  containers:
  - name: container
   image: kubetm/init
   volumeMounts:
   - name: pvc-pv
     mountPath: /mount3
  volumes:
  - name : pvc-pv
   persistentVolumeClaim:
     claimName: pvc-01
  ```

  - `persistentVolumeClaim: claimName: pvc-01`처럼 pod생성시, pvc 마운팅
