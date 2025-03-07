-- إصلاح مشكلة التكرار اللانهائي في سياسات الأمان

-- تعطيل RLS مؤقتًا للتحقق من المشكلة
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- حذف جميع السياسات الحالية التي قد تسبب التكرار اللانهائي
DROP POLICY IF EXISTS "Admin can do anything" ON profiles;
DROP POLICY IF EXISTS "Public profiles read access" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profiles" ON profiles;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON profiles;

-- إنشاء سياسات جديدة بسيطة
-- سياسة للقراءة العامة (بدون استعلامات متداخلة)
CREATE POLICY "Public profiles read access"
ON profiles
FOR SELECT
USING (true);

-- سياسة للتحديث (فقط للمستخدم نفسه)
CREATE POLICY "Users can update their own profiles"
ON profiles
FOR UPDATE
USING (auth.uid() = id);

-- سياسة للحذف (فقط للمستخدم نفسه أو المشرف)
CREATE POLICY "Users can delete their own profiles"
ON profiles
FOR DELETE
USING (auth.uid() = id);

-- إعادة تفعيل RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
