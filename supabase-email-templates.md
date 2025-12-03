# Supabase Auth メールテンプレート（TagNote 向け）

Supabase ダッシュボードの **Authentication > Templates** にコピーして利用してください。Hosted 環境ではダッシュボードに貼り付けるだけで適用されます。ローカル開発の `supabase/config.toml` を使う場合は `supabase/templates/confirmation.html` / `supabase/templates/magic_link.html` を指定してください。

## サインアップ確認（auth.email.template.confirmation）
- Subject: `【TagNote】メールアドレスの確認をお願いします`
- HTML:
```html
<html>
  <body style="background:#f8fafc;padding:24px;font-family:'Segoe UI',sans-serif;color:#0f172a;">
    <table width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;padding:24px;">
      <tr>
        <td style="font-size:14px;color:#64748b;">TagNote</td>
        <td align="right" style="font-size:12px;color:#94a3b8;">メール確認</td>
      </tr>
      <tr>
        <td colspan="2" style="padding-top:16px;">
          <h1 style="font-size:20px;margin:0 0 8px 0;color:#0f172a;">メールアドレスの確認をお願いします</h1>
          <p style="font-size:14px;line-height:1.6;margin:0 0 16px 0;color:#334155;">
            TagNote へのサインアップありがとうございます。下のボタンをクリックしてメールアドレスを確認してください。<br />
            ボタンが機能しない場合は、以下のリンクをブラウザに貼り付けてください。
          </p>
          <p style="text-align:center;margin:24px 0;">
            <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#0f172a;color:#ffffff;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:600;">メールアドレスを確認する</a>
          </p>
          <p style="font-size:13px;line-height:1.6;color:#475569;word-break:break-all;">{{ .ConfirmationURL }}</p>
          <p style="font-size:12px;line-height:1.6;color:#94a3b8;margin-top:24px;">
            このメールに心当たりがない場合は破棄してください。リンクは一定時間で無効になります。
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
```

## サインイン（マジックリンク） auth.email.template.magic_link
- Subject: `【TagNote】ログイン用リンクをお送りします`
- HTML:
```html
<html>
  <body style="background:#f8fafc;padding:24px;font-family:'Segoe UI',sans-serif;color:#0f172a;">
    <table width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;padding:24px;">
      <tr>
        <td style="font-size:14px;color:#64748b;">TagNote</td>
        <td align="right" style="font-size:12px;color:#94a3b8;">サインイン</td>
      </tr>
      <tr>
        <td colspan="2" style="padding-top:16px;">
          <h1 style="font-size:20px;margin:0 0 8px 0;color:#0f172a;">ログイン用リンク</h1>
          <p style="font-size:14px;line-height:1.6;margin:0 0 16px 0;color:#334155;">
            {{ .Email }} 宛にログイン用のリンクを発行しました。<br />
            下のボタンをクリックするだけでサインインが完了します。
          </p>
          <p style="text-align:center;margin:24px 0;">
            <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#0f172a;color:#ffffff;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:600;">TagNote にログインする</a>
          </p>
          <p style="font-size:13px;line-height:1.6;color:#475569;word-break:break-all;">{{ .ConfirmationURL }}</p>
          <p style="font-size:12px;line-height:1.6;color:#94a3b8;margin-top:24px;">
            このメールに心当たりがない場合は破棄してください。リンクは一定時間で失効します。
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
```

### 補足
- Supabase ダッシュボード: `Authentication > URL Configuration` に `https://<your-domain>/auth/callback` を設定してください。
- テンプレート変数:
  - `{{ .ConfirmationURL }}`: 認証リンク
  - `{{ .Email }}`: 受信者メールアドレス
- ローカル開発でテンプレートをファイルとして使う場合は `supabase/config.toml` に以下のように設定します（例）:
```toml
[auth.email.template.confirmation]
subject = "【TagNote】メールアドレスの確認をお願いします"
content_path = "./supabase/templates/confirmation.html"

[auth.email.template.magic_link]
subject = "【TagNote】ログイン用リンクをお送りします"
content_path = "./supabase/templates/magic_link.html"
```
（テンプレートファイルはリポジトリの `supabase/templates/` に含まれています）
