# Hệ thống Báo cáo Lỗi (Bug Reporting System)

Hệ thống này đã được tích hợp hoàn chỉnh vào **Android Server Mini**. Dưới đây là thông tin chi tiết để vận hành và kiểm tra.

## 1. Thành phần chính

- **Frontend:**
  - `src/components/bug-report-dialog.tsx`: Popup báo lỗi "mini".
  - `src/routes/index.tsx`: Nút báo lỗi ở Header, FAB (Floating Action Button) và Mobile Menu.
- **Backend (Server Functions):**
  - `src/lib/api/email.ts`: Gửi email tự động khi báo lỗi và khi xét duyệt.
- **Quản trị:**
  - `src/routes/admin-hidden-portal.tsx`: Trang quản lý tại `/admin-hidden-portal`.
- **Cơ sở dữ liệu:** Tích hợp với Supabase.

## 2. Thông tin đăng nhập Admin

- **URL:** `/admin-hidden-portal`
- **Username:** `nhutcoderteam0902pr`
- **Password:** `090211`

## 3. Cấu hình Quan trọng (SQL)

Để hệ thống hoạt động, bạn **BẮT BUỘC** phải chạy script SQL sau trong [Supabase SQL Editor](https://supabase.com/dashboard/project/tslixhmocdniiflbqprq/sql/new):

```sql
-- 1. Tạo bảng bugs
CREATE TABLE IF NOT EXISTS public.bugs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    email TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'approved'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Kích hoạt Row Level Security (RLS)
ALTER TABLE public.bugs ENABLE ROW LEVEL SECURITY;

-- 3. Cho phép mọi người gửi báo cáo (Insert)
CREATE POLICY "Allow anonymous insert" ON public.bugs
FOR INSERT WITH CHECK (true);

-- 4. Cho phép mọi người xem báo cáo (Select) - Hoặc giới hạn nếu cần
CREATE POLICY "Allow public select" ON public.bugs
FOR SELECT USING (true);

-- 5. Cho phép Admin cập nhật/xóa (Sử dụng Service Role hoặc Policy cụ thể)
-- Ở đây đơn giản hóa cho phép mọi người thực hiện để test
CREATE POLICY "Allow public update" ON public.bugs FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.bugs FOR DELETE USING (true);
```

## 4. Email Automation

- Email gửi từ: `lamminhnhut09022011@gmail.com`
- Tự động gửi email xác nhận cho người dùng ngay khi họ gửi báo lỗi thành công.
- Tự động gửi email "Cảm ơn & Xét duyệt" khi Admin nhấn nút "Xét duyệt" trong Portal.

## 5. Xử lý sự cố

Nếu bạn thấy thông báo lỗi **"Bảng 'bugs' chưa được tạo"**:

1. Đăng nhập vào Dashboard Supabase.
2. Mở mục **SQL Editor**.
3. Copy đoạn mã ở mục số 3 phía trên và nhấn **Run**.
