# AWS2-07: AWS Lambda 演習 07-1・07-2・07-3(ACA13) — サーバーレス処理

> **Mục tiêu:** Viết Lambda function Python để đọc DynamoDB, ghi S3, và xây dựng luồng serverless tự động hóa tồn kho.

---

## 演習07-1: Lambda ↔ DynamoDB

### Bước 1: Tạo DynamoDB Table

| Mục | Giá trị |
|-----|---------|
| Tên | `[クラス名+番号]-db` |
| Partition key | `pid` (Number) |

→ Insert vài item mẫu:

| pid | pname | category | price |
|-----|-------|----------|-------|
| 1001 | ショートケーキ | ケーキ | 500 |
| 1002 | チョコケーキ | ケーキ | 600 |
| 1003 | チーズケーキ | ケーキ | 450 |

### Bước 2: Tạo Lambda Function

| Mục | Giá trị |
|-----|---------|
| Tên | `[クラス名+番号]-cake-function` |
| Runtime | Python 3.13 |
| Execution role | **LabRole** |

### Code Python (07-1)

```python
import json
import boto3

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('[クラス名+番号]-db')
    
    pid = event.get('pid', 1001)
    
    response = table.get_item(
        Key={'pid': pid}
    )
    
    item = response.get('Item', {})
    
    return {
        'statusCode': 200,
        'body': json.dumps(item, ensure_ascii=False)
    }
```

### Test Event

```json
{
  "pid": 1001
}
```

→ Response: `{"pid": 1001, "pname": "ショートケーキ", "price": 500}` ✅

---

## 演習07-2: Lambda → S3 (ファイル書き込み)

### Bước 1: Tạo S3 Bucket

| Mục | Giá trị |
|-----|---------|
| Tên | `[クラス名+番号]-bucket` |
| Region | us-east-1 |

### Bước 2: Lambda Function

| Tên | `[クラス名+番号]-s3-function` |
|-----|------|

```python
import json
import boto3
from datetime import datetime

def lambda_handler(event, context):
    s3 = boto3.client('s3')
    bucket_name = '[クラス名+番号]-bucket'
    
    # Tạo tên file theo thời gian
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    file_name = f'report_{timestamp}.txt'
    
    # Nội dung file
    content = 'Hello AWS Lambda!!'
    
    # Ghi vào S3
    s3.put_object(
        Bucket=bucket_name,
        Key=file_name,
        Body=content.encode('utf-8')
    )
    
    return {
        'statusCode': 200,
        'body': json.dumps(f'File {file_name} uploaded to S3!')
    }
```

→ Chạy Test → vào S3 bucket thấy file `.txt` mới tạo ✅

---

## 演習07-3 / ACA13: Serverless Inventory System

### Kiến trúc

```
CSV upload lên S3
        ↓ S3 Event Trigger
Lambda: Load-Inventory
        ├── Ghi vào DynamoDB "Inventory"
        └── DynamoDB Stream Trigger
                    ↓
            Lambda: Check-Stock
                    └── Nếu count == 0
                              ↓
                        SNS: NoStock → Email Alert
```

### Bước 1: Tạo các thành phần

**S3 Bucket:**
```
Tên: inventory-[クラス名+番号]
```

**DynamoDB Table:**
```
Tên: Inventory
Partition key: Store (String)
Sort key: Item (String)
Stream: Enable (New and old images)
```

**SNS Topic:**
```
Tên: NoStock
Type: Standard
→ Subscribe: Email → [email của bạn] → Confirm subscription
```

### Bước 2: Lambda Function 1 — Load-Inventory

```
Tên: Load-Inventory
Runtime: Python 3.x
Role: LabRole
```

**S3 Event Trigger:**
- Bucket: `inventory-[クラス名+番号]`
- Event type: **All object create events**

```python
import boto3
import csv
import urllib.parse

def lambda_handler(event, context):
    s3 = boto3.client('s3')
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('Inventory')
    
    # Lấy thông tin file vừa upload
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.parse.unquote_plus(
        event['Records'][0]['s3']['object']['key']
    )
    
    # Đọc file CSV từ S3
    response = s3.get_object(Bucket=bucket, Key=key)
    lines = response['Body'].read().decode('utf-8').splitlines()
    
    reader = csv.DictReader(lines)
    for row in reader:
        table.put_item(Item={
            'Store': row['store'],
            'Item':  row['item'],
            'Count': int(row['count'])
        })
    
    return {'statusCode': 200, 'body': 'Inventory loaded!'}
```

### Bước 3: Lambda Function 2 — Check-Stock

```
Tên: Check-Stock
Runtime: Python 3.x
Role: LabRole
```

**DynamoDB Trigger:**
- Table: `Inventory`
- Batch size: 100
- Starting position: Latest

```python
import boto3
import os

def lambda_handler(event, context):
    sns = boto3.client('sns')
    topic_arn = '[SNS_TOPIC_ARN_NoStock]'
    
    for record in event['Records']:
        if record['eventName'] in ('INSERT', 'MODIFY'):
            new_image = record['dynamodb'].get('NewImage', {})
            
            store = new_image.get('Store', {}).get('S', '')
            item  = new_image.get('Item',  {}).get('S', '')
            count = int(new_image.get('Count', {}).get('N', 1))
            
            if count == 0:
                message = f'{store} - {item} is out of stock!'
                sns.publish(
                    TopicArn=topic_arn,
                    Subject='在庫切れアラート',
                    Message=message
                )
                print(f'Alert sent: {message}')
    
    return {'statusCode': 200}
```

### Bước 4: Test toàn bộ luồng

1. Tạo file `inventory.csv`:
```csv
store,item,count
Tokyo,ショートケーキ,0
Osaka,チョコケーキ,5
Nagoya,チーズケーキ,0
```

2. Upload lên `inventory-[クラス名+番号]`
3. Lambda `Load-Inventory` tự kích hoạt → ghi DynamoDB
4. DynamoDB Stream → `Check-Stock` → SNS gửi Email
5. Kiểm tra hòm thư → nhận 2 email (Tokyo + Nagoya count=0) ✅

---

## Checklist

- [ ] DynamoDB table `[クラス名+番号]-db` tạo xong
- [ ] Lambda `cake-function` đọc DynamoDB thành công
- [ ] Lambda `s3-function` ghi file vào S3
- [ ] S3 bucket `inventory-[クラス名+番号]` tạo xong
- [ ] DynamoDB `Inventory` với Stream enabled
- [ ] SNS `NoStock` + Email subscription confirmed
- [ ] `Load-Inventory` trigger khi upload CSV
- [ ] `Check-Stock` trigger từ DynamoDB Stream
- [ ] Email nhận cảnh báo khi count = 0 ✅
