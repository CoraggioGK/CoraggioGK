/* ============================================
   合同会社Coraggio コーポレートサイト
   ============================================ */
(function () {
  "use strict";

  /* ---------- ハンバーガーメニュー ---------- */
  var hamburger = document.getElementById("hamburger");
  var nav = document.getElementById("nav");

  function closeNav() {
    nav.classList.remove("is-open");
    hamburger.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
  }

  if (hamburger && nav) {
    hamburger.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      hamburger.classList.toggle("is-open", open);
      hamburger.setAttribute("aria-expanded", String(open));
    });

    // メニュー内リンクをクリックしたら閉じる
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });
  }

  /* ---------- ヘッダーの影（スクロール時） ---------- */
  var header = document.getElementById("header");
  window.addEventListener("scroll", function () {
    if (!header) return;
    header.style.boxShadow = window.scrollY > 10
      ? "0 4px 14px rgba(138, 162, 169, 0.12)"
      : "none";
  });

  /* ---------- スクロールで要素をフェードイン ---------- */
  var reveals = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    reveals.forEach(function (el) { io.observe(el); });
  } else {
    // フォールバック（古いブラウザ）
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- お問い合わせフォーム（Ajax送信） ---------- */
  var form = document.getElementById("contactForm");
  var note = document.getElementById("formNote");

  function showNote(message, type) {
    if (!note) return;
    note.textContent = message;
    note.className = "form__note " + (type === "success" ? "is-success" : "is-error");
    note.hidden = false;
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault(); // ページ遷移せず、その場で送信する

      var action = form.getAttribute("action");

      // 送信先（Formspree等のURL）が未設定の場合は送信せず案内を表示
      if (!action || action.trim() === "") {
        showNote(
          "送信先フォームが未設定です。Formspree等で取得したURLを index.html のフォーム action 属性に設定してください。",
          "error"
        );
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      var originalLabel = submitBtn ? submitBtn.textContent : "";
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "送信中…"; }
      note.hidden = true;

      fetch(action, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" } // FormspreeにJSON応答を要求（ページ遷移しない）
      })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            showNote("お問い合わせを送信しました。確認のうえ、担当者よりご連絡いたします。", "success");
          } else {
            return res.json().then(function (data) {
              var msg = (data && data.errors)
                ? data.errors.map(function (er) { return er.message; }).join(", ")
                : "送信に失敗しました。お手数ですが時間をおいて再度お試しください。";
              showNote(msg, "error");
            });
          }
        })
        .catch(function () {
          showNote("通信エラーが発生しました。ネットワーク環境をご確認のうえ、再度お試しください。", "error");
        })
        .finally(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalLabel; }
        });
    });
  }
})();
