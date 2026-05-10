/* ==========================================================================
   Liberta - HP状態チェッカー（state-checker.js）
   全Liberta制作HPに必須で組み込む。

   仕組み：
   1. ページ読み込み時に _data/site-state.json を取得
   2. state === "LIVE" → 何もしない（本番動作）
   3. state === "OFFER" → 営業送付日から30日以内なら通常表示、超過なら expired/ へリダイレクト
   4. ファイルが取得できない場合は安全側として何もしない（=表示する）

   絶対のルール：
   - state が LIVE のサイトは絶対にリダイレクトしない
   - state.json の破損や読込失敗時はリダイレクトしない（fail-safe）
   ========================================================================== */
(function () {
  // すでに /expired/ ページにいる場合は無限ループ防止
  if (location.pathname.indexOf('/expired/') === 0 ||
      location.pathname.indexOf('/expired.html') >= 0) {
    return;
  }

  // admin (Decap CMS) は除外
  if (location.pathname.indexOf('/admin') === 0) {
    return;
  }

  fetch('/_data/site-state.json', { cache: 'no-store' })
    .then(function (res) {
      if (!res.ok) throw new Error('state file not available');
      return res.json();
    })
    .then(function (state) {
      // 安全側：state が LIVE なら絶対に何もしない
      if (state.state === 'LIVE') {
        // noindex タグがあれば動的に除去
        var meta = document.querySelector('meta[name="robots"]');
        if (meta && /noindex/i.test(meta.getAttribute('content') || '')) {
          meta.parentNode.removeChild(meta);
        }
        return;
      }

      // state が OFFER の場合のみ期限チェック
      if (state.state === 'OFFER' && state.email_sent_at) {
        var sentAt = new Date(state.email_sent_at + 'T00:00:00');
        var now = new Date();
        var daysPassed = (now - sentAt) / (1000 * 60 * 60 * 24);
        var offerDays = state.offer_days || 30;

        if (daysPassed > offerDays) {
          // 期限切れ：expired ページへ
          location.replace('/expired/');
        }
      }
      // それ以外（不明な state など）は何もしない
    })
    .catch(function () {
      // fail-safe：読み込めなかった場合は何もしない（誤リダイレクト防止）
    });
})();
