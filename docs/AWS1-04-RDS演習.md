# AWS1-04: Amazon RDS 演習 (ラボ5) — マネージドデータベース

> **Mục tiêu:** Thay thế DB Server tự quản lý bằng Amazon RDS MySQL, kết nối từ EC2 Web Server.

---

## Kiến trúc

```
EC2 Web Server (Public Subnet)
  └── PHP → RDS Endpoint:3306
              └── Amazon RDS MySQL 8.x
                    ├── Subnet Group (Multi-AZ)
                    └── Parameter Group (utf8)
```

---

## Bước 1: Tạo DB Subnet Group

1. **RDS → Subnet groups → Create DB subnet group**

| Mục | Giá trị |
|-----|---------|
| Tên | `[クラス名+番号]-subnet-group` |
| VPC | VPC bài VPC演習 |
| AZs | us-east-1a, us-east-1b |
| Subnets | Private Subnet (`10.1.11.0/24`) + Public Subnet (`10.1.10.0/24`) |

> Cần bao gồm ít nhất 2 AZ khác nhau.

---

## Bước 2: Tạo Parameter Group

1. **RDS → Parameter groups → Create parameter group**

| Mục | Giá trị |
|-----|---------|
| Tên | `[クラス名+番号]-param-group` |
| Engine type | MySQL Community |
| Family | `mysql8.0` |

2. Sau khi tạo xong, chỉnh tham số `character_set_server` = `utf8` (tùy chọn)

---

## Bước 3: Tạo RDS Instance

1. **RDS → Databases → Create database**

| Mục | Giá trị |
|-----|---------|
| Engine | MySQL |
| Version | MySQL 8.x |
| Template | Free tier |
| DB Instance ID | `[クラス名+番号]-mysql-db` |
| Master username | `root` |
| Master password | `123qwecc` |
| Instance class | `db.t3.micro` |
| Storage | 20 GiB (gp2) |
| VPC | VPC bài VPC演習 |
| Subnet group | `[クラス名+番号]-subnet-group` |
| Public access | **No** |
| Parameter group | `[クラス名+番号]-param-group` |

2. Chờ trạng thái: **Available** ✅
3. Ghi lại **Endpoint** (vd: `sk2a22-mysql-db.xxxxx.us-east-1.rds.amazonaws.com`)

---

## Bước 4: Security Group cho RDS

Thêm Inbound Rule vào SG của RDS:

| Type | Port | Source |
|------|------|--------|
| MySQL/Aurora | 3306 | SG của EC2 Web Server |

---

## Bước 5: Kết nối PHP với RDS

### Chuẩn bị file `rds.php` trên EC2 Web Server

```bash
# Copy từ db.php
cp db.php rds.php
vi rds.php
```

```php
<?php
// Thay địa chỉ IP cục bộ bằng RDS Endpoint
$host = 'sk2a22-mysql-db.xxxxx.us-east-1.rds.amazonaws.com';
$user = 'root';
$pass = '123qwecc';
$db   = '[クラス名]_db';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Query và hiển thị dữ liệu
$result = $conn->query("SELECT * FROM products");
while ($row = $result->fetch_assoc()) {
    echo $row['name'] . " - " . $row['price'] . "<br>";
}
$conn->close();
?>
```

```bash
# Deploy vào thư mục web
sudo mv rds.php /var/www/html/
```

### Kiểm tra

```
http://[Public_IP_Web_Server]/rds.php
```

→ Dữ liệu từ RDS hiển thị ✅

---

## Bước 6: Tạo DB và Table trên RDS

```bash
# Từ EC2 Web Server, kết nối vào RDS
mysql -h [RDS_Endpoint] -u root -p
# Nhập password: 123qwecc
```

```sql
-- Tạo database
CREATE DATABASE [クラス名]_db CHARACTER SET utf8;
USE [クラス名]_db;

-- Tạo bảng mẫu
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price INT NOT NULL
);

-- Insert dữ liệu mẫu
INSERT INTO products (name, price) VALUES ('ショートケーキ', 500);
INSERT INTO products (name, price) VALUES ('チョコケーキ', 600);
INSERT INTO products (name, price) VALUES ('チーズケーキ', 450);

-- Xác nhận
SELECT * FROM products;
EXIT;
```

---

## So sánh: EC2 DB tự quản lý vs RDS

| Tiêu chí | EC2 + MariaDB | Amazon RDS |
|----------|---------------|------------|
| Cài đặt | Thủ công | AWS tự động |
| Backup | Thủ công | Tự động (snapshot) |
| Patching | Thủ công | AWS quản lý |
| Multi-AZ | Cấu hình phức tạp | 1 click |
| Read Replica | Cấu hình phức tạp | 1 click |
| Chi phí | Rẻ hơn | Cao hơn |

---

## Checklist

- [ ] DB Subnet Group tạo xong (2 AZ)
- [ ] Parameter Group với mysql8.0
- [ ] RDS instance trạng thái **Available**
- [ ] Ghi lại RDS Endpoint
- [ ] Security Group RDS mở port 3306 từ EC2 SG
- [ ] PHP kết nối RDS thành công
