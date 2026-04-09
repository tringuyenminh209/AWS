# AWS1-01: EC2 基礎実習 — 演習0 & ACFラボ3

> **Mục tiêu:** Tạo và cấu hình EC2 instance, cài Apache, kiểm tra Monitoring và Termination Protection.

---

## Phần 1: 演習0 — Tạo Web Server cơ bản

### Bước 1: Tạo Key Pair

| Mục | Giá trị |
|-----|---------|
| Tên | `[クラス名+番号]` ví dụ: `sk2a22` |
| Type | **ED25519** |
| Format | `.pem` |

> File `.pem` sẽ tự tải về — lưu cẩn thận, không thể tải lại.

---

### Bước 2: Launch EC2 Instance

| Mục | Giá trị |
|-----|---------|
| Name | `[クラス名+番号]-sv` ví dụ: `sk2a22-sv` |
| AMI | **Amazon Linux 2023 AMI** |
| Instance Type | `t2.micro` |
| Key Pair | Key vừa tạo (`.pem`) |
| VPC | Default |
| Subnet | `us-east-1a` (172.31.0.0/20) |
| Auto-assign Public IP | **Enable** |
| Termination Protection | **Enable** |

**Security Group (Inbound Rules):**

| Type | Port | Source |
|------|------|--------|
| SSH | 22 | 0.0.0.0/0 |
| HTTP | 80 | 0.0.0.0/0 |

---

### Bước 3: Kiểm tra sau khi Launch

1. Ghi chú **Instance ID** và **Public IPv4 Address**
2. Tab **Status checks** → chờ cả 2 mục đạt **Pass** ✅
3. Tab **Monitoring** → xem biểu đồ CPU/Network

---

### Bước 4: Kết nối SSH qua Tera Term

| Mục | Giá trị |
|-----|---------|
| Host | Public IPv4 của EC2 |
| User name | `ec2-user` |
| Auth method | Private key file (`.pem`) |

---

### Bước 5: Cài đặt Apache Web Server

```bash
# Cài đặt Apache
sudo yum -y install httpd

# Khởi động
sudo systemctl start httpd

# Tự khởi động cùng hệ thống
sudo systemctl enable httpd
```

### Bước 6: Kiểm tra kết quả

Mở trình duyệt → nhập **Public IPv4** → thấy trang **"It Works!"** → chụp màn hình nộp bài.

---

## Phần 2: ACFラボ3 — Khám phá các tính năng EC2

### Cấu hình

| Mục | Giá trị |
|-----|---------|
| AMI | Amazon Linux 2023 |
| Instance Type | `t3.micro` |
| Storage | 8 GB |

### Bước 1: Xem System Log

- Vào EC2 → Actions → **Monitor and troubleshoot → Get system log**
- Tìm dòng: `Installing: httpd`
- Tải về → đổi tên thành `[クラス名+番号+Tên]-system.log`
- Lấy **Instance screenshot** → lưu thành `[クラス名+番号+Tên]-screenshot.jpg`

### Bước 2: Mở HTTP qua Security Group

Security Group chưa có rule HTTP → trang web chưa mở được.

1. Vào Security Group → **Edit inbound rules**
2. Thêm: **HTTP / Port 80 / 0.0.0.0/0**
3. F5 trình duyệt → thấy: **"Hello From Your Web Server!"**

### Bước 3: Nâng cấp cấu hình

1. **Đổi Instance Type:** Stop instance → Actions → **Change instance type** → `t2.small` → Start
2. **Mở rộng Storage:** Volumes → Modify → đổi lên **10 GB**

### Bước 4: Xem Quotas/Limits

- EC2 → Limits → tìm **"Running On-Demand Standard"**
- Ghi lại giá trị Quota mặc định (thường là `5`)

### Bước 5: Termination Protection

1. **Bật** Termination Protection → thử **Terminate** → hệ thống báo lỗi, không cho xóa ✅
2. **Tắt** Termination Protection → **Terminate** lần nữa → xóa thành công

### Bước 6: Kết thúc

- Nhấn **Submit** → 25/25 điểm ✅
- Nhấn **End Lab**

---

## Lệnh tham khảo

```bash
# Kiểm tra trạng thái Apache
sudo systemctl status httpd

# Xem log Apache
sudo tail -f /var/log/httpd/access_log
sudo tail -f /var/log/httpd/error_log

# Xem thông tin hệ thống
curl http://169.254.169.254/latest/meta-data/instance-type
curl http://169.254.169.254/latest/meta-data/public-ipv4
```
