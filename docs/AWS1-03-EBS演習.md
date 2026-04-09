# AWS1-03: Amazon EBS 演習 (ラボ4) — ブロックストレージ管理

> **Mục tiêu:** Tạo EBS Volume, attach vào EC2, format, mount, tạo Snapshot, khôi phục dữ liệu.

---

## Kiến trúc

```
EC2 "Lab" (us-east-1a)
  ├── Root Volume: /dev/xvda1  (hệ điều hành)
  ├── New EBS Volume → attach → /dev/sdf → mount → /mnt/data-store
  └── Restored Volume ← từ Snapshot → /mnt/data-store2
```

---

## Task 1: Tạo EBS Volume mới

1. **EC2 → Instances** → chọn instance **"Lab"**
2. Ghi chú **Availability Zone** (vd: `us-east-1a`)
3. **EC2 → Volumes → Create volume:**

| Mục | Giá trị |
|-----|---------|
| Size | 1 GiB |
| Volume Type | gp2 (General Purpose SSD) |
| AZ | Phải **trùng với EC2** (vd: us-east-1a) |

4. Chờ đến khi trạng thái: **available** ✅

> ⚠️ EBS Volume và EC2 phải ở **cùng AZ** mới attach được.

---

## Task 2: Attach Volume vào EC2

1. Chọn Volume → **Actions → Attach volume**
2. Instance: chọn **"Lab"**
3. Nhấn **Attach**
4. Chờ trạng thái: **in-use** ✅

---

## Task 3: Kết nối vào EC2

- EC2 → chọn instance **"Lab"** → **Connect**
- Chọn **Session Manager** → Open → Terminal hiện ra

---

## Task 4: Tạo File System và Mount

### Kiểm tra ổ đĩa hiện tại

```bash
df -h
# Thấy /dev/xvda1 là root volume
```

### Format ổ đĩa mới bằng ext3

```bash
sudo mkfs -t ext3 /dev/sdf
```

### Tạo mount point và mount

```bash
sudo mkdir -p /mnt/data-store
sudo mount /dev/sdf /mnt/data-store
```

### Cấu hình mount tự động khi khởi động (`/etc/fstab`)

```bash
echo "/dev/sdf  /mnt/data-store  ext3  defaults,noatime  1  2" | sudo tee -a /etc/fstab
```

### Ghi dữ liệu vào ổ đĩa

```bash
sudo sh -c "echo some text has been written > /mnt/data-store/file.txt"
```

### Xác nhận dữ liệu đã ghi

```bash
cat /mnt/data-store/file.txt
# Output: some text has been written ✅
```

---

## Task 5: Tạo Snapshot

1. **EC2 → Volumes** → chọn Volume vừa tạo
2. **Actions → Create snapshot**
3. Đặt mô tả: `"My Snapshot"`
4. Chờ trạng thái: **completed** ✅

### Mô phỏng mất dữ liệu

```bash
# Xóa file trên ổ đĩa (mô phỏng sự cố)
sudo rm /mnt/data-store/file.txt

# Xác nhận đã xóa
cat /mnt/data-store/file.txt
# Output: No such file or directory ✅
```

---

## Task 6: Khôi phục dữ liệu từ Snapshot

### Tạo Volume mới từ Snapshot

1. **EC2 → Snapshots** → chọn Snapshot vừa tạo
2. **Actions → Create volume from snapshot**
3. Đặt Name: **"Restored Volume"**
4. AZ: **trùng với EC2** (us-east-1a)

### Attach Volume phục hồi vào EC2

1. Chọn "Restored Volume" → **Actions → Attach volume**
2. Instance: **"Lab"**
3. Device name: `/dev/sdg`
4. Chờ trạng thái: **in-use** ✅

### Mount Volume phục hồi

```bash
sudo mkdir -p /mnt/data-store2
sudo mount /dev/sdg /mnt/data-store2
```

### Xác nhận dữ liệu đã phục hồi

```bash
cat /mnt/data-store2/file.txt
# Output: some text has been written ✅
```

---

## Kết thúc Lab

- Nhấn **Submit** → 25/25 điểm ✅
- Nhấn **End Lab**

---

## Tóm tắt lệnh

| Lệnh | Mục đích |
|------|----------|
| `df -h` | Xem ổ đĩa đang mount |
| `lsblk` | Liệt kê tất cả block device |
| `sudo mkfs -t ext3 /dev/sdf` | Format ext3 |
| `sudo mkfs.ext4 /dev/sdf` | Format ext4 |
| `sudo mount /dev/sdf /mnt/data-store` | Mount thủ công |
| `sudo umount /mnt/data-store` | Unmount |
| `cat /etc/fstab` | Xem cấu hình mount tự động |
