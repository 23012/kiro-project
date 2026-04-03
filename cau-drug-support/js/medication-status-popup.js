function switchTab(idx, el) {
  document.querySelectorAll('.tab-content').forEach((t, i) => {
    t.style.display = i === idx ? 'block' : 'none';
  });
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

function updateRange(months) {
  const end = new Date(2026, 3, 3);
  const start = new Date(2026, 3 - parseInt(months), 3);
  const fmt = d => `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  document.getElementById('range-display').textContent = fmt(start) + ' ~ ' + fmt(end);
}
