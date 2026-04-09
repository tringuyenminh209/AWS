# AWS1-02: VPC演習 1・2・3 — 仮想ネットワーク構築

> **Mục tiêu:** Xây dựng kiến trúc 2-tier (Web Server công khai + DB Server riêng tư) trên VPC tự tạo.

---

## Kiến trúc tổng quan

```
Internet
   │
[IGW: sk2a22_igw]
   │
VPC: 10.1.0.0/16 (sk2a22_vpc)
   ├── Public Subnet: 10.1.10.0/24 (us-east-1a)
   │      └── EC2 Web Server (sk2a22_sv) ← Apache + PHP
   │      └── NAT Gateway (sk2a22_nat_gw) ← EIP
   │
   └── Private Subnet: 10.1.11.0/24 (us-east-1b)
          └── EC2 DB Server (sk2a22_dbsv) ← MariaDB
```

---

## VPC演習1 — VPC, Subnet, IGW, Web Server

### Bước 1: Tạo VPC

| Mục | Giá trị |
|-----|---------|
| Tên | `[クラス名+番号]_vpc` (vd: `sk2a22_vpc`) |
| IPv4 CIDR | `10.1.0.0/16` |

### Bước 2: Tạo Subnets

**Public Subnet:**

| Mục | Giá trị |
|-----|---------|
| Tên | `[クラス名+番号]_pub` |
| AZ | `us-east-1a` |
| CIDR | `10.1.10.0/24` |
| Auto-assign Public IP | ✅ **Enable** |

**Private Subnet:**

| Mục | Giá trị |
|-----|---------|
| Tên | `[クラス名+番号]_priv` |
| AZ | `us-east-1b` |
| CIDR | `10.1.11.0/24` |
| Auto-assign Public IP | ❌ Disable |

### Bước 3: Internet Gateway

1. Tạo IGW tên `[クラス名+番号]_igw`
2. **Attach** vào VPC vừa tạo

### Bước 4: Route Table

1. Đổi tên Route Table mặc định → `[クラス名+番号]_rt`
2. **Edit routes** → Add route:
   - Destination: `0.0.0.0/0` → Target: **IGW**
3. **Subnet associations** → liên kết với Public Subnet

### Bước 5: Security Group cho Web Server

Tên: `[クラス名+番号]_sg`

| Type | Port | Source |
|------|------|--------|
| SSH | 22 | 0.0.0.0/0 |
| HTTP | 80 | 0.0.0.0/0 |

### Bước 6: Launch Web Server EC2

| Mục | Giá trị |
|-----|---------|
| Tên | `[クラス名+番号]_sv` |
| AMI | Amazon Linux 2023 |
| Type | t2.micro / t3.micro |
| Key Pair | `[クラス名].pem` (ED25519) |
| VPC | VPC vừa tạo |
| Subnet | Public Subnet |
| Public IP | Enable |
| SG | `[クラス名+番号]_sg` |

### Bước 7: Cài Apache

```bash
# SSH vào Web Server (User: ec2-user)
sudo yum install -y httpd
sudo systemctl start httpd
sudo systemctl enable httpd
```

---

## VPC演習2 — DB Server, NAT Gateway

### Bước 1: Security Group cho DB Server

Tên: `[クラス名+番号]_sg2`

| Type | Port | Source |
|------|------|--------|
| SSH | 22 | `10.1.0.0/16` |
| HTTP | 80 | `10.1.0.0/16` |
| All ICMP - IPv4 | — | `10.1.0.0/16` |
| MySQL/Aurora | 3306 | `10.1.0.0/16` |

> ⚠️ DB Server chỉ nhận từ VPC nội bộ, không mở ra Internet.

### Bước 2: Launch DB Server EC2

| Mục | Giá trị |
|-----|---------|
| Tên | `[クラス名+番号]_dbsv` |
| AMI | Amazon Linux 2023 |
| Type | t2.micro / t3.micro |
| Key Pair | Key đã tạo ở bài 1 |
| VPC | VPC bài 1 |
| Subnet | **Private Subnet** |
| Public IP | ❌ **Disable** |
| SG | `[クラス名+番号]_sg2` |

### Bước 3: Tạo NAT Gateway

| Mục | Giá trị |
|-----|---------|
| Tên | `[クラス名+番号]_nat_gw` |
| Subnet | **Public Subnet** |
| Elastic IP | Allocate new |

### Bước 4: Route Table cho Private Subnet

1. Tạo Route Table mới: `[クラス名+番号]_priv_rt`
2. **Subnet associations** → liên kết với Private Subnet
3. **Edit routes** → Add:
   - Destination: `0.0.0.0/0` → Target: **NAT Gateway**

### Bước 5: SSH vào DB Server qua Jump Host

```bash
# Trên máy tính, đẩy file .pem lên Web Server qua Tera Term (SCP)
# Tera Term → File → SSH SCP → gửi file .pem lên ~/ của Web Server

# Trên Web Server, cấp quyền file key
sudo chmod 600 [tên_key].pem

# SSH từ Web Server vào DB Server (Jump Host)
ssh ec2-user@[Private_IP_của_DB] -i [tên_key].pem
```

### Bước 6: Cài MariaDB trên DB Server

```bash
# Trên DB Server
sudo yum -y update
sudo yum -y install mariadb105-server

# Khởi động
sudo systemctl start mariadb
sudo systemctl enable mariadb

# Đăng nhập (Enter nếu hỏi password)
sudo mysql -u root -p
# → quit để thoát
```

---

## VPC演習3 — Kết nối PHP ↔ MariaDB

### Bước 1: Cài PHP trên Web Server

```bash
sudo yum install -y php php-fpm php-mysqli php-json php-devel
sudo systemctl restart httpd
```

### Bước 2: Cấu hình MariaDB — charset utf8

```bash
# Trên DB Server
sudo vi /etc/my.cnf.d/mariadb-server.cnf
```

Thêm dưới `[mysqld]`:
```ini
character-set-server=utf8
```

```bash
sudo systemctl restart mariadb
```

### Bước 3: Tạo Database và User

```sql
sudo mysql -u root -p

-- Tạo database
CREATE DATABASE [クラス名]_db;
USE [クラス名]_db;

-- Tạo bảng và insert dữ liệu (theo file mẫu)

-- Tạo user cho Web Server kết nối
CREATE USER aws@'[Private_IP_của_Web_Server]' IDENTIFIED BY 'ecc';
GRANT ALL ON [クラス名]_db.* TO aws@'[Private_IP_của_Web_Server]';
FLUSH PRIVILEGES;
EXIT;
```

### Bước 4: Cập nhật db.php trên Web Server

```bash
# Sửa file db.php
vi db.php
```

```php
<?php
$host = '[Private_IP_của_DB_Server]';  // ← Thay bằng Private IP
$db   = '[クラス名]_db';               // ← Tên database
$user = 'aws';
$pass = 'ecc';
$conn = new mysqli($host, $user, $pass, $db);
// ...
?>
```

```bash
# Deploy vào thư mục web
sudo mv db.php /var/www/html/
```

### Bước 5: Kiểm tra

Mở trình duyệt → `http://[Public_IP_Web_Server]/db.php` → dữ liệu từ DB hiện ra ✅

---

## Checklist hoàn thành

- [ ] VPC `10.1.0.0/16` đã tạo
- [ ] Public Subnet `10.1.10.0/24` (Auto IP: ON)
- [ ] Private Subnet `10.1.11.0/24` (Auto IP: OFF)
- [ ] IGW đã attach vào VPC
- [ ] Public Route Table: `0.0.0.0/0 → IGW`
- [ ] NAT Gateway với Elastic IP
- [ ] Private Route Table: `0.0.0.0/0 → NAT GW`
- [ ] Web Server chạy Apache trên Public Subnet
- [ ] DB Server chạy MariaDB trên Private Subnet
- [ ] PHP kết nối được với DB → hiển thị dữ liệu
