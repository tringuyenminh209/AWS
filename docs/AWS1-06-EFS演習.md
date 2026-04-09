# AWS1-06: Amazon EFS 演習 — 共有ファイルシステム

> **Mục tiêu:** Tạo EFS, mount đồng thời lên nhiều EC2 instance để chia sẻ file giữa các máy chủ.

---

## Kiến trúc

```
VPC
├── AZ us-east-1a
│     └── EC2 Instance A → mount → /var/www/html ← EFS
└── AZ us-east-1b
      └── EC2 Instance B → mount → /var/www/html ← EFS
                                          ↑
                              Cùng 1 EFS, dữ liệu đồng bộ
```

---

## Bước 1: Tạo Security Group cho EFS

1. **VPC → Security Groups → Create**

Tên: `[クラス名+番号]_efs_sg`

| Type | Port | Source |
|------|------|--------|
| NFS | 2049 | SG của EC2 |

---

## Bước 2: Tạo EFS File System

1. **EFS → Create file system**

| Mục | Giá trị |
|-----|---------|
| Tên | `[クラス名+番号]-efs` |
| VPC | VPC bài VPC演習 |
| Availability | Regional (Multi-AZ) |

2. **Customize → Network:**
   - Mỗi AZ → chọn Subnet + Security Group `[クラス名+番号]_efs_sg`

3. Chờ trạng thái: **Available** ✅
4. Ghi lại **File system ID** (vd: `fs-0123456789abcdef0`)

---

## Bước 3: Cài amazon-efs-utils trên EC2

```bash
# Thực hiện trên CẢ HAI EC2 instance
sudo yum install -y amazon-efs-utils

# Hoặc nếu dùng Ubuntu:
sudo apt-get install -y amazon-efs-utils
```

---

## Bước 4: Mount EFS

### Cách 1: Mount qua DNS (khuyên dùng)

```bash
# Tạo thư mục mount point
sudo mkdir -p /var/www/html

# Mount EFS qua DNS
sudo mount -t nfs4 \
  -o nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2,noresvport \
  [fs-ID].efs.us-east-1.amazonaws.com:/ \
  /var/www/html
```

### Cách 2: Mount bằng EFS mount helper (đơn giản hơn)

```bash
sudo mount -t efs [fs-ID]:/ /var/www/html
```

### Xác nhận

```bash
df -h
# Thấy EFS mount tại /var/www/html với dung lượng lớn (8 EB)
```

---

## Bước 5: Test chia sẻ file

```bash
# Trên EC2 Instance A — tạo file
sudo sh -c "echo 'Hello from EC2-A' > /var/www/html/test.html"

# Trên EC2 Instance B — đọc file
cat /var/www/html/test.html
# Output: Hello from EC2-A ✅
```

---

## Bước 6: Xác nhận qua Web Browser

Mở 2 tab:
- `http://[Public_IP_A]/test.html` → "Hello from EC2-A" ✅
- `http://[Public_IP_B]/test.html` → "Hello from EC2-A" ✅ (cùng file!)

---

## Lưu ý quan trọng

> ❌ Bài này **KHÔNG** yêu cầu cấu hình `/etc/fstab`.
> Mount EFS chỉ thực hiện thủ công (temporary mount).
>
> Nếu muốn mount tự động, thêm vào `/etc/fstab`:
> ```
> [fs-ID].efs.us-east-1.amazonaws.com:/ /var/www/html efs defaults,_netdev 0 0
> ```

---

## So sánh EBS vs EFS vs S3

| Tiêu chí | EBS | EFS | S3 |
|----------|-----|-----|-----|
| Loại | Block Storage | File Storage | Object Storage |
| Protocol | Proprietary | NFS v4.1 | HTTP/HTTPS |
| Attach | 1 EC2 (1 AZ) | Nhiều EC2 (Multi-AZ) | Mọi nơi |
| Performance | Rất cao | Cao | Vừa |
| Use case | OS, DB | Shared web files | Images, videos |

---

## Checklist

- [ ] EFS Security Group mở NFS port 2049
- [ ] EFS file system tạo xong — trạng thái Available
- [ ] Cài amazon-efs-utils trên EC2
- [ ] Mount EFS lên cả 2 EC2
- [ ] Tạo file từ EC2-A → đọc được từ EC2-B ✅
