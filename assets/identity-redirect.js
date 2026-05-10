/* ============================================================
   Liberta - お客様UX保証スクリプト
   Netlify Identity 経由でログインしたお客様を、
   迷子にせず自動的に編集画面 (/admin/) へ案内する。

   仕組み（Decap CMS 公式推奨パターン）：
   - 招待メール内の Accept the invite リンクから来訪
   - パスワード設定 → Sign up → ログイン完了
   - そのまま自動的に /admin/ へリダイレクト
   - お客様は「次に何をすべきか」を考える必要なし

   組み込み方法（index.html の <head> 内に追加）:
     <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
     <script src="/assets/identity-redirect.js" defer></script>
   ============================================================ */
(function () {
  if (!window.netlifyIdentity) return;

  // URLハッシュに認証トークン系の文字列が含まれているか判定
  // (招待・パスワードリセット・メール確認のリンクから来たかどうか)
  function hasAuthToken() {
    var h = (location.hash || "").toLowerCase();
    return (
      h.indexOf("invite_token") >= 0 ||
      h.indexOf("recovery_token") >= 0 ||
      h.indexOf("confirmation_token") >= 0
    );
  }

  window.netlifyIdentity.on("init", function (user) {
    if (!user) {
      // 未ログインで来たお客様 → ログイン完了したら /admin/ へ
      window.netlifyIdentity.on("login", function () {
        document.location.href = "/admin/";
      });
    } else if (hasAuthToken()) {
      // 既ログイン状態で認証リンクから来た稀なケース → 即座に /admin/ へ
      document.location.href = "/admin/";
    }
    // 上記以外(普通にトップページ閲覧中)は何もしない
  });
})();
