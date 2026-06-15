-- =====================================================================
-- دالة آمنة لتغيير كلمة مرور أي مستخدم من لوحة تحكم المشرف
-- تُشغّل مرة واحدة في: Supabase Dashboard → SQL Editor → New query → Run
-- =====================================================================

-- التأكد من توفّر pgcrypto (عادة مفعّلة على Supabase)
create extension if not exists pgcrypto with schema extensions;

create or replace function public.admin_set_password(
  target_user uuid,
  new_password text
)
returns void
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
begin
  -- فقط المشرف يمكنه تنفيذ العملية
  if not public.is_admin() then
    raise exception 'غير مصرّح';
  end if;

  if length(new_password) < 6 then
    raise exception 'كلمة المرور قصيرة جدًا';
  end if;

  update auth.users
     set encrypted_password = extensions.crypt(new_password, extensions.gen_salt('bf')),
         updated_at = now()
   where id = target_user;

  if not found then
    raise exception 'المستخدم غير موجود';
  end if;
end;
$$;

-- منح صلاحية التنفيذ للمستخدمين المسجّلين (الدالة نفسها تتحقق أنه مشرف)
revoke all on function public.admin_set_password(uuid, text) from public, anon;
grant execute on function public.admin_set_password(uuid, text) to authenticated;
