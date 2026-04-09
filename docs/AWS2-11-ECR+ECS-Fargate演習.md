# AWS2-11: ECR + ECS Fargate 演習 — Dockerコンテナのビルド・デプロイ

> **Mục tiêu:** Dùng Cloud9 viết Dockerfile, build image, push lên ECR, deploy lên ECS Fargate với ALB.

---

## Kiến trúc

```
[AWS Cloud9 IDE]
      │
      │  docker build
      ▼
[Docker Image: php_web]
      │
      │  docker push
      ▼
[Amazon ECR: [クラス名+番号]repo]
      │
      │  image pull
      ▼
[Amazon ECS Cluster: [クラス名+番号]Cluster2]
      └── Service: [クラス名+番号]serv
            ├── Fargate Task 1 (Container: websv)
            └── Fargate Task 2 (Container: websv)
                      ↑
            [ALB: [クラス名+番号]-ecs-elb]
                  └── Target Group: [クラス名+番号]-ecs-tg
```

---

## Bước 1: Chuẩn bị trên Cloud9

### Tạo Cloud9 Environment

1. **Cloud9 → Create environment**

| Mục | Giá trị |
|-----|---------|
| Tên | `[クラス名+番号]-cloud9` |
| Instance type | t3.small |
| Platform | Amazon Linux 2023 |

### Tạo file `index.php`

```php
<?php
// Kết nối Aurora và hiển thị danh sách sản phẩm
$host = getenv('DB_HOST') ?: 'localhost';
$user = getenv('DB_USER') ?: 'admin';
$pass = getenv('DB_PASS') ?: '';
$db   = getenv('DB_NAME') ?: 'cakedb';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    echo "<p>DB Connection failed</p>";
} else {
    $result = $conn->query("SELECT * FROM products");
    echo "<h1>菓子一覧</h1><ul>";
    while ($row = $result->fetch_assoc()) {
        echo "<li>" . htmlspecialchars($row['pname']) . " - ¥" . $row['price'] . "</li>";
    }
    echo "</ul>";
}
?>
```

### Tạo `Dockerfile`

```dockerfile
FROM php:8.4-apache

# Cài extension PHP kết nối MySQL
RUN apt-get update && \
    docker-php-ext-install pdo_mysql mysqli && \
    apt-get clean

WORKDIR /var/www/html

# Copy source code
COPY index.php index.php

EXPOSE 80
```

---

## Bước 2: Build & Test Docker Image

```bash
# Build image
docker build --tag php_web .

# Chạy thử locally trên Cloud9
docker run -d -p 80:80 --name [クラス名+番号]sv php_web

# Kiểm tra container đang chạy
docker ps

# Xem log
docker logs [クラス名+番号]sv

# Commit image (snapshot container hiện tại)
docker commit [クラス名+番号]sv [クラス名+番号]sv_image
```

---

## Bước 3: Tạo ECR Repository

1. **ECR → Create repository**

| Mục | Giá trị |
|-----|---------|
| Visibility | Private |
| Tên | `[クラス名+番号]repo` |

2. Sau khi tạo, nhấn **"View push commands"** → Copy các lệnh tự động

### Lệnh Push lên ECR (từ Cloud9)

```bash
# 1. Đăng nhập ECR (lệnh từ "View push commands")
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  [ACCOUNT_ID].dkr.ecr.us-east-1.amazonaws.com

# 2. Tag image
docker tag php_web:latest \
  [ACCOUNT_ID].dkr.ecr.us-east-1.amazonaws.com/[クラス名+番号]repo:latest

# 3. Push lên ECR
docker push \
  [ACCOUNT_ID].dkr.ecr.us-east-1.amazonaws.com/[クラス名+番号]repo:latest
```

→ Vào ECR Console thấy image đã có ✅

---

## Bước 4: Tạo ECS Cluster

1. **ECS → Clusters → Create cluster**

| Mục | Giá trị |
|-----|---------|
| Tên | `[クラス名+番号]Cluster2` |
| Infrastructure | **AWS Fargate (Serverless)** |

---

## Bước 5: Tạo Task Definition

1. **ECS → Task definitions → Create new task definition**

| Mục | Giá trị |
|-----|---------|
| Family name | `[クラス名+番号]_tasks` |
| Launch type | **AWS Fargate** |
| OS/Architecture | Linux/X86_64 |
| CPU | 0.25 vCPU |
| Memory | 0.5 GB |
| Task role | **LabRole** |
| Task execution role | **LabRole** |

**Container:**

| Mục | Giá trị |
|-----|---------|
| Tên | `websv` |
| Image URI | `[ACCOUNT_ID].dkr.ecr.us-east-1.amazonaws.com/[クラス名+番号]repo:latest` |
| Port mapping | 80 → HTTP |

---

## Bước 6: Tạo ECS Service (với ALB)

1. **ECS → Cluster → Services → Create**

| Mục | Giá trị |
|-----|---------|
| Launch type | **FARGATE** |
| Task definition | `[クラス名+番号]_tasks` |
| Service name | `[クラス名+番号]serv` |
| Desired tasks | **2** |

**Networking:**

| Mục | Giá trị |
|-----|---------|
| VPC | `[クラス名+番号]_ecs_vpc` |
| Subnets | 2 Public Subnets |
| SG | `[クラス名+番号]_ecs_websg` (HTTP:80 open) |
| Public IP | ✅ Enable |

**Load balancing:**

| Mục | Giá trị |
|-----|---------|
| Type | Application Load Balancer |
| ALB name | `[クラス名+番号]-ecs-elb` |
| Target group | `[クラス名+番号]-ecs-tg` (new) |
| Health check | HTTP / `/` |

---

## Bước 7: Kiểm tra

```bash
# Xem Service status
# ECS → Cluster → Service → Tasks → thấy 2 tasks Running ✅

# Truy cập qua ALB DNS
http://[ALB_DNS_Name]/
```

→ Trang PHP hiển thị ✅

---

## Lệnh Docker tham khảo

```bash
# Xem images
docker images

# Xem containers đang chạy
docker ps

# Dừng container
docker stop [container_name]

# Xóa container
docker rm [container_name]

# Xóa image
docker rmi php_web

# Shell vào container
docker exec -it [container_name] bash
```

---

## Checklist

- [ ] Dockerfile viết đúng (php:8.4-apache + mysqli)
- [ ] `docker build` thành công
- [ ] Container chạy được trên Cloud9
- [ ] Image push lên ECR thành công
- [ ] ECS Cluster Fargate tạo xong
- [ ] Task Definition đúng image URI
- [ ] Service 2 tasks Running
- [ ] ALB DNS truy cập được trang web ✅
