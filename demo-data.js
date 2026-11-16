/*
  DONNÉES DE DÉMONSTRATION — MPW Clips
  -------------------------------------
  Ce fichier fabrique des chiffres fictifs pour faire fonctionner le tableau de bord
  tant que les API ne sont pas branchées.

  Le tableau de bord attend un objet de cette forme (c'est ce que ton API devra renvoyer) :

  {
    creator:  { name: "Nom du créateur" },
    updatedAt: "2026-11-14T10:00:00Z",
    sources:  [ { id: "tiktok", label: "TikTok", connected: false }, ... ],
    accounts: [ { id: "tt1", platform: "tiktok", handle: "@compte" }, ... ],
    daily:    [ { date: "2026-11-14", accountId: "tt1", views: 0, followers: 0, clicks: 0, clips: 0 }, ... ],
    clips:    [ { title: "...", accountId: "tt1", date: "2026-11-14", views: 0, likes: 0, clicks: 0 }, ... ]
  }

  - "followers" = abonnés gagnés ce jour-là sur ce compte.
  - "clicks"    = clics sur le lien en bio de ce compte ce jour-là.
  - "daily" doit couvrir au moins 180 jours pour que la comparaison avec la période
    précédente fonctionne sur 90 jours.

  Pour brancher les vraies données : remplace le contenu de loadData() dans dashboard.html.
*/
(function () {
  // Générateur pseudo-aléatoire à graine fixe : les chiffres de démo ne changent pas à chaque rechargement.
  var seed = 20261114;
  function rnd() { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }

  var accounts = [
    { id: 'tt1', platform: 'tiktok',    handle: '@demo.clips',     base: 9000 },
    { id: 'tt2', platform: 'tiktok',    handle: '@demo.moments',   base: 5200 },
    { id: 'yt1', platform: 'youtube',   handle: 'Demo Clips',      base: 6100 },
    { id: 'yt2', platform: 'youtube',   handle: 'Demo Best Of',    base: 3000 },
    { id: 'ig1', platform: 'instagram', handle: '@demo.clips',     base: 4300 },
    { id: 'ig2', platform: 'instagram', handle: '@demo.highlights', base: 2100 }
  ];

  var DAYS = 180;
  var today = new Date();
  today.setHours(12, 0, 0, 0);

  function iso(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  var daily = [];
  var clips = [];
  var themes = ['Clutch 1v4', 'Rage quit', 'Fail en direct', 'Réaction au drop', 'Moment drôle', 'Ace en ranked',
                'Le chat explose', 'Jump scare', 'Défi perdu', 'Meilleur kill', 'Bug improbable', 'Victoire à 1 HP'];

  accounts.forEach(function (acc) {
    for (var i = DAYS - 1; i >= 0; i--) {
      var d = new Date(today); d.setDate(today.getDate() - i);
      var growth = 0.35 + 0.65 * ((DAYS - i) / DAYS);          // montée progressive
      var weekend = (d.getDay() === 0 || d.getDay() === 6) ? 1.25 : 1;
      var spike = rnd() > 0.955 ? 2.2 + rnd() * 2.5 : 1;        // un clip qui décolle de temps en temps
      var views = Math.round(acc.base * growth * weekend * spike * (0.7 + rnd() * 0.6));
      var nbClips = 1 + Math.floor(rnd() * 3);
      daily.push({
        date: iso(d),
        accountId: acc.id,
        views: views,
        followers: Math.round(views * (0.003 + rnd() * 0.003)),
        clicks: Math.round(views * (0.001 + rnd() * 0.0012)),
        clips: nbClips
      });
      if (spike > 1 || rnd() > 0.8) {
        var v = Math.round(views * (0.45 + rnd() * 0.35));
        clips.push({
          title: themes[Math.floor(rnd() * themes.length)],
          accountId: acc.id,
          date: iso(d),
          views: v,
          likes: Math.round(v * (0.05 + rnd() * 0.06)),
          clicks: Math.round(v * (0.001 + rnd() * 0.0015))
        });
      }
    }
  });

  window.MPW_DEMO_DATA = {
    creator: { name: 'Créateur démo' },
    updatedAt: today.toISOString(),
    sources: [
      { id: 'tiktok',    label: 'TikTok',          connected: false },
      { id: 'youtube',   label: 'YouTube Shorts',  connected: false },
      { id: 'instagram', label: 'Instagram Reels', connected: false },
      { id: 'links',     label: 'Liens en bio',    connected: false }
    ],
    accounts: accounts.map(function (a) { return { id: a.id, platform: a.platform, handle: a.handle }; }),
    daily: daily,
    clips: clips
  };
})();
