/* ACB JUDO — planning interactif (cours & horaires) */
(function () {
  var DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

  var GYMS = {
    timbaud: { name: 'Gymnase Jean-Pierre Timbaud', addr: '160 rue Lacide Villard, 93000 Bobigny', prof: 'Namyck Bouzera · Ludovic Amedah (adultes)' },
    eluard:  { name: 'Gymnase Paul Éluard', addr: 'Bobigny (93)', prof: 'Hakim Mouri' },
    cachin:  { name: 'Gymnase Marcel Cachin', addr: 'Bobigny (93)', prof: 'Teddy Grillon' }
  };

  var CATS = [
    { id: 'baby',           label: 'Baby Judo',        age: '2½ – 4 ans' },
    { id: 'eveil',          label: 'Éveil Judo',       age: '4 – 5 ans' },
    { id: 'super-poussins', label: 'Super Poussins',   age: '~6 – 7 ans' },
    { id: 'poussins',       label: 'Poussins',         age: '~8 – 9 ans' },
    { id: 'benjamins',      label: 'Benjamins',        age: '~10 – 11 ans' },
    { id: 'minimes',        label: 'Minimes',          age: '~12 – 13 ans' },
    { id: 'adultes',        label: 'Ados & adultes',   age: '14 ans et +' },
    { id: 'prepa',          label: 'Prépa compétition', age: 'sur sélection' },
    { id: 'fitness',        label: 'Fitness · Taïso',  age: 'adultes' }
  ];
  var CATLABEL = {}; CATS.forEach(function (c) { CATLABEL[c.id] = c.label; });

  var S = [
    ['Lundi','18:00','19:00','Super Poussins',['super-poussins'],'timbaud'],
    ['Lundi','19:00','20:00','Poussins',['poussins'],'timbaud'],
    ['Lundi','20:00','22:00','Adultes',['adultes'],'timbaud'],
    ['Mardi','18:00','19:00','Baby & Éveil Judo',['baby','eveil'],'timbaud'],
    ['Mardi','19:00','20:00','Benjamins / Minimes',['benjamins','minimes'],'timbaud'],
    ['Jeudi','18:00','19:00','Super Poussins / Poussins',['super-poussins','poussins'],'timbaud'],
    ['Jeudi','19:00','20:00','Benjamins / Minimes',['benjamins','minimes'],'timbaud'],
    ['Jeudi','20:00','22:00','Adultes',['adultes'],'timbaud'],

    ['Lundi','18:00','19:00','Super Poussins / Poussins',['super-poussins','poussins'],'eluard'],
    ['Lundi','19:00','20:00','Fitness · Taïso',['fitness'],'eluard'],
    ['Mardi','18:00','19:00','Baby Judo',['baby'],'eluard'],
    ['Mardi','19:00','20:00','Benjamins / Minimes',['benjamins','minimes'],'eluard'],
    ['Mercredi','17:00','18:00','Éveil Judo',['eveil'],'eluard'],
    ['Mercredi','18:00','19:00','Prépa compétition',['prepa'],'eluard'],
    ['Mercredi','19:00','20:00','Fitness · Taïso',['fitness'],'eluard'],
    ['Jeudi','18:00','19:00','Super Poussins / Poussins',['super-poussins','poussins'],'eluard'],
    ['Jeudi','19:00','20:00','Benjamins / Minimes',['benjamins','minimes'],'eluard'],

    ['Lundi','18:00','19:00','Éveil & Baby Judo',['eveil','baby'],'cachin'],
    ['Lundi','19:00','20:00','Super Poussins / Poussins / Benjamins',['super-poussins','poussins','benjamins'],'cachin'],
    ['Vendredi','18:00','19:00','Super Poussins',['super-poussins'],'cachin'],
    ['Vendredi','19:00','20:00','Poussins / Benjamins',['poussins','benjamins'],'cachin']
  ].map(function (r) { return { day: r[0], s: r[1], e: r[2], label: r[3], cats: r[4], gym: r[5] }; });

  var state = { gym: 'all', cat: 'all' };

  /* ---- build filter bar ---- */
  var bar = document.getElementById('filters');
  var gymChips = [['all', 'Tous les gymnases']].concat(Object.keys(GYMS).map(function (k) { return [k, GYMS[k].name.replace('Gymnase ', '')]; }));
  var catChips = [['all', 'Toutes catégories', 'tous âges']].concat(CATS.map(function (c) { return [c.id, c.label, c.age]; }));

  function chipRow(legend, items, key) {
    var html = '<div class="filter-group"><span class="filter-legend">' + legend + '</span><div class="chips">';
    html += items.map(function (it) {
      var age = it[2] ? '<span class="chip-age">' + it[2] + '</span>' : '';
      return '<button class="chip" data-key="' + key + '" data-val="' + it[0] + '" aria-pressed="' + (state[key] === it[0] ? 'true' : 'false') + '"><span class="chip-lbl">' + it[1] + '</span>' + age + '</button>';
    }).join('');
    return html + '</div></div>';
  }
  bar.innerHTML = chipRow('Gymnase', gymChips, 'gym') + chipRow('Catégorie d’âge', catChips, 'cat');

  /* ---- gym info panel ---- */
  var info = document.getElementById('gym-info');

  /* ---- render schedule ---- */
  var grid = document.getElementById('planning');
  function fmt(t) { return t.replace(':00', 'h').replace(':', 'h'); }

  function matches(sess) {
    if (state.gym !== 'all' && sess.gym !== state.gym) return false;
    if (state.cat !== 'all' && sess.cats.indexOf(state.cat) === -1) return false;
    return true;
  }

  function render() {
    var total = 0;
    grid.innerHTML = DAYS.map(function (day) {
      var list = S.filter(function (x) { return x.day === day && matches(x); })
        .sort(function (a, b) { return a.s < b.s ? -1 : 1; });
      total += list.length;
      var body = list.length ? list.map(function (x) {
        return '<div class="sess">' +
          '<div class="sess-time">' + fmt(x.s) + '<span class="dash">–</span>' + fmt(x.e) + '</div>' +
          '<div class="sess-main"><div class="sess-label">' + x.label + '</div>' +
          '<div class="sess-gym"><span class="gdot g-' + x.gym + '"></span>' + GYMS[x.gym].name.replace('Gymnase ', '') + '</div></div>' +
        '</div>';
      }).join('') : '<div class="sess-empty">Aucun cours</div>';
      return '<div class="day-col' + (list.length ? '' : ' is-empty') + '">' +
        '<div class="day-head"><span class="day-name">' + day + '</span><span class="day-count">' + list.length + '</span></div>' +
        '<div class="day-body">' + body + '</div></div>';
    }).join('');

    // count badge
    var cb = document.getElementById('result-count');
    if (cb) cb.textContent = total + (total > 1 ? ' créneaux' : ' créneau');

    // gym info
    if (state.gym === 'all') {
      info.innerHTML = '<span class="muted">Sélectionnez un gymnase pour voir l’adresse et les professeurs.</span>';
      info.classList.remove('active');
    } else {
      var g = GYMS[state.gym];
      info.innerHTML = '<span class="gdot g-' + state.gym + '"></span>' +
        '<strong>' + g.name + '</strong><span class="sep">·</span>' +
        '<span>' + g.addr + '</span><span class="sep">·</span>' +
        '<span class="muted">Prof. ' + g.prof + '</span>';
      info.classList.add('active');
    }

    // pressed states
    bar.querySelectorAll('.chip').forEach(function (c) {
      c.setAttribute('aria-pressed', state[c.dataset.key] === c.dataset.val ? 'true' : 'false');
    });
  }

  bar.addEventListener('click', function (e) {
    var c = e.target.closest('.chip'); if (!c) return;
    state[c.dataset.key] = c.dataset.val;
    render();
  });

  render();
})();
