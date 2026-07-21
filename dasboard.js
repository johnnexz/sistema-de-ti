const adminLoginForm = document.getElementById('adminLoginForm');
const adminLoginError = document.getElementById('adminLoginError');
const adminUser = document.getElementById('adminUser');
const adminPass = document.getElementById('adminPass');
const loginSection = document.getElementById('loginSection');
const dashboardSection = document.getElementById('dashboardSection');
const dashboardTotal = document.getElementById('dashboardTotal');
const dashboardOpen = document.getElementById('dashboardOpen');
const dashboardClosed = document.getElementById('dashboardClosed');
const dashboardTicketList = document.getElementById('dashboardTicketList');
const backBtn = document.getElementById('backBtn');

const STORAGE_KEY = 'tiChamados';
const ADMIN_USER = 'adm';
const ADMIN_PASS = 'johnnes 12';

function loadTickets() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function formatDate(timestamp) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(timestamp));
}

function createTicketCard(ticket) {
  const card = document.createElement('article');
  card.className = 'ticket-card';
  card.innerHTML = `
    <header>
      <div>
        <h3>${ticket.title}</h3>
        <div class="ticket-badges">
          <span class="badge">${ticket.department}</span>
          <span class="badge">${ticket.priority}</span>
        </div>
      </div>
      <span class="badge ${ticket.status === 'Fechado' ? 'status-closed' : 'status-open'}">${ticket.status}</span>
    </header>
    <div class="ticket-meta">
      <p><strong>${ticket.name}</strong> · ${formatDate(ticket.createdAt)}</p>
    </div>
    <p style="margin-top: 16px; color: var(--text);">${ticket.description}</p>
    <div class="ticket-footer">
      <span class="badge">ID: ${ticket.id}</span>
    </div>
  `;
  return card;
}

function renderDashboard(tickets) {
  dashboardTicketList.innerHTML = '';

  if (tickets.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'Nenhum chamado registrado. Abra um novo chamado agora.';
    dashboardTicketList.appendChild(empty);
    return;
  }

  tickets.sort((a, b) => b.createdAt - a.createdAt).forEach(ticket => {
    dashboardTicketList.appendChild(createTicketCard(ticket));
  });
}

function updateDashboard(tickets) {
  const total = tickets.length;
  const closed = tickets.filter(t => t.status === 'Fechado').length;
  dashboardTotal.textContent = total;
  dashboardOpen.textContent = total - closed;
  dashboardClosed.textContent = closed;
}

function showDashboard() {
  const tickets = loadTickets();
  updateDashboard(tickets);
  renderDashboard(tickets);
  loginSection.classList.add('hidden');
  dashboardSection.classList.remove('hidden');
}

function handleLogin(event) {
  event.preventDefault();
  const user = adminUser.value.trim();
  const pass = adminPass.value;

  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    adminLoginError.classList.add('hidden');
    showDashboard();
    adminLoginForm.reset();
    return;
  }

  adminLoginError.classList.remove('hidden');
}

function handleBack() {
  window.location.href = 'index.html';
}

adminLoginForm.addEventListener('submit', handleLogin);
backBtn.addEventListener('click', handleBack);
