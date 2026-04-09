# AWS2-08: API Gateway + Lambda + DynamoDB 演習 — サーバーレスAPIバックエンド

> **Mục tiêu:** Xây dựng REST API serverless: API Gateway → Lambda → DynamoDB → trả JSON response.

---

## Kiến trúc

```
Browser
   │
   GET https://xxxxx.execute-api.us-east-1.amazonaws.com/default?pid=1001
   │
[API Gateway REST API]
   │  Mapping Template: ?pid=1001 → {"pid": 1001}
   │
[Lambda: cake-function]
   │  boto3 → DynamoDB.get_item(pid=1001)
   │
[DynamoDB: [クラス名+番号]-db]
   │
   Response: {"pid":1001,"pname":"ショートケーキ","price":500}
```

---

## 演習08-1: Tạo API Gateway kết nối Lambda

### Bước 1: Tạo REST API

1. **API Gateway → Create API → REST API (not private)**

| Mục | Giá trị |
|-----|---------|
| Tên | `[クラス名+番号]-cake-function-API` |
| Endpoint type | Regional |

### Bước 2: Cấu hình Method

1. **Resources → / → Actions → Create Method**
2. Chọn **GET** → ✅
3. **Integration type:** Lambda Function
4. **Lambda Function:** `[クラス名+番号]-cake-function`
5. Nhấn **Save** → OK

> ⚠️ Xóa method **ANY** mặc định nếu có, chỉ giữ **GET**.

### Bước 3: Cấu hình Mapping Template

1. **Integration Request → Mapping Templates**
2. **Add mapping template** → Content-Type: `application/json`
3. Nhập template:

```velocity
{
  "pid": $input.params('pid')
}
```

> Template này chuyển query param `?pid=1001` thành JSON `{"pid": 1001}` để truyền vào Lambda.

### Bước 4: Deploy API

1. **Actions → Deploy API**
2. Stage: **[New Stage]** → Stage name: `default`
3. Nhấn **Deploy**
4. Ghi lại **Invoke URL:**
   ```
   https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/default
   ```

### Bước 5: Test trên Browser

```
https://[invoke-url]/default?pid=1001
```

Response:
```json
{"pid": 1001, "pname": "ショートケーキ", "category": "ケーキ", "price": 500}
```

✅

---

## 演習08-2: Lambda ↔ DynamoDB — PUT & GET operations

### Bước 1: Tạo DynamoDB Table

| Mục | Giá trị |
|-----|---------|
| Tên | `[クラス名+番号]-cake-table` |
| Partition key | `pid` (Number) |

### Bước 2: Tạo Lambda Function

| Tên | `cake-dyDB-func` |
|-----|---------|
| Runtime | Python 3.x |
| Role | LabRole |

```python
import json
import boto3
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('[クラス名+番号]-cake-table')

def lambda_handler(event, context):
    action = event.get('action', 'get')
    
    if action == 'put':
        # Insert/Update item
        table.put_item(Item={
            'pid':      int(event['pid']),
            'pname':    event['pname'],
            'category': event['category'],
            'price':    int(event['price'])
        })
        return {'statusCode': 200, 'body': 'Item saved!'}
    
    elif action == 'get':
        # Get item by pid
        response = table.get_item(Key={'pid': int(event['pid'])})
        item = response.get('Item', {})
        # Convert Decimal to int for JSON serialization
        for k, v in item.items():
            if isinstance(v, Decimal):
                item[k] = int(v)
        return {'statusCode': 200, 'body': json.dumps(item, ensure_ascii=False)}
```

### Test Event — Ghi dữ liệu

```json
{
  "action": "put",
  "pid": 2001,
  "pname": "モンブラン",
  "category": "ケーキ",
  "price": 700
}
```

→ DynamoDB thấy item mới ✅

### Test Event — Đọc dữ liệu

```json
{
  "action": "get",
  "pid": 2001
}
```

→ Response: `{"pid": 2001, "pname": "モンブラン", ...}` ✅

---

## Các HTTP Methods tham khảo

| Method | Mục đích | DynamoDB operation |
|--------|----------|--------------------|
| GET | Lấy dữ liệu | `get_item` / `query` / `scan` |
| POST | Tạo mới | `put_item` |
| PUT | Cập nhật | `update_item` |
| DELETE | Xóa | `delete_item` |

---

## Checklist

- [ ] REST API tạo xong
- [ ] Method GET cấu hình Integration với Lambda
- [ ] Mapping Template chuyển `?pid=xxx` → `{"pid": xxx}`
- [ ] API Deploy lên stage `default`
- [ ] URL `?pid=1001` trả đúng JSON từ DynamoDB
- [ ] Lambda `cake-dyDB-func` put/get DynamoDB thành công
