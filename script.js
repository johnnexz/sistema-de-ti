const ticketForm = document.getElementById('ticketForm');
const ticketList = document.getElementById('ticketList');
const totalTickets = document.getElementById('totalTickets');
const resolvedTickets = document.getElementById('resolvedTickets');
const introScreen = document.getElementById('introScreen');
const appShell = document.getElementById('appShell');
const enterAppBtn = document.getElementById('enterAppBtn');
const introSaluxBtn = document.getElementById('introSaluxBtn');
const openSaluxBtn = document.getElementById('openSaluxBtn');
const openTicketSection = document.getElementById('openTicketSection');
const modalOverlay = document.getElementById('saluxModal');
const modalConfirmBtn = document.getElementById('modalConfirmBtn');
const modalCancelBtn = document.getElementById('modalCancelBtn');

const STORAGE_KEY = 'tiChamados';

function loadTickets() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveTickets(tickets) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
}

function formatDate(timestamp) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(timestamp));
}

function updateStats(tickets) {
  const total = tickets.length;
  const resolved = tickets.filter(ticket => ticket.status === 'Fechado').length;
  totalTickets.textContent = total;
  resolvedTickets.textContent = resolved;
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
      <div class="ticket-actions">
        <button class="btn btn-secondary" data-action="toggle" data-id="${ticket.id}">${ticket.status === 'Fechado' ? 'Reabrir' : 'Fechar'}</button>
        <button class="btn btn-secondary" data-action="delete" data-id="${ticket.id}">Remover</button>
      </div>
    </div>
  `;
  return card;
}

function renderTickets() {
  const tickets = loadTickets();
  ticketList.innerHTML = '';

  if (tickets.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'Nenhum chamado registrado. Abra um novo chamado agora.';
    ticketList.appendChild(empty);
  } else {
    tickets.sort((a, b) => b.createdAt - a.createdAt).forEach(ticket => {
      ticketList.appendChild(createTicketCard(ticket));
    });
  }

  updateStats(tickets);
}

function addTicket(data) {
  const tickets = loadTickets();
  tickets.push({
    id: `TI-${Date.now()}`,
    ...data,
    status: 'Aberto',
    createdAt: Date.now(),
  });
  saveTickets(tickets);
  renderTickets();
}

function toggleTicket(id) {
  const tickets = loadTickets();
  const updated = tickets.map(ticket => {
    if (ticket.id === id) {
      return {
        ...ticket,
        status: ticket.status === 'Aberto' ? 'Fechado' : 'Aberto',
      };
    }
    return ticket;
  });
  saveTickets(updated);
  renderTickets();
}

function deleteTicket(id) {
  const tickets = loadTickets().filter(ticket => ticket.id !== id);
  saveTickets(tickets);
  renderTickets();
}

ticketForm.addEventListener('submit', event => {
  event.preventDefault();
  const data = {
    name: document.getElementById('inputName').value.trim(),
    department: document.getElementById('inputDepartment').value,
    priority: document.getElementById('inputPriority').value,
    title: document.getElementById('inputTitle').value.trim(),
    description: document.getElementById('inputDescription').value.trim(),
  };

  addTicket(data);
  ticketForm.reset();
});

ticketList.addEventListener('click', event => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const action = button.dataset.action;
  const id = button.dataset.id;

  if (action === 'toggle') {
    toggleTicket(id);
  }
  if (action === 'delete') {
    deleteTicket(id);
  }
});

function showAppShell() {
  introScreen.classList.add('hidden');
  appShell.classList.remove('hidden');
  openTicketSection.classList.add('active');
  openDashboardBtn.classList.remove('active');
  openSaluxBtn.classList.remove('active');
  ticketSection.classList.remove('hidden');
  dashboardSection.classList.add('hidden');
}

function showDashboard() {
  if (!isAdminLogged) {
    openAdminLoginModal();
    return;
  }

  openTicketSection.classList.remove('active');
  openDashboardBtn.classList.add('active');
  openSaluxBtn.classList.remove('active');
  ticketSection.classList.add('hidden');
  dashboardSection.classList.remove('hidden');
  const tickets = loadTickets();
  renderDashboard(tickets);
}

function openAdminLoginModal() {
  adminLoginError.classList.add('hidden');
  adminLoginModal.classList.remove('hidden');
}

function closeAdminLoginModal() {
  adminLoginModal.classList.add('hidden');
}

function showSaluxModal() {
  openTicketSection.classList.remove('active');
  openDashboardBtn.classList.remove('active');
  openSaluxBtn.classList.add('active');
  ticketSection.classList.remove('hidden');
  dashboardSection.classList.add('hidden');
  modalOverlay.classList.remove('hidden');
}

function hideSaluxModal() {
  modalOverlay.classList.add('hidden');
}

function openSaluxWhatsApp() {
  window.open('https://wa.me/5592991969284', '_blank');
  hideSaluxModal();
}

enterAppBtn.addEventListener('click', showAppShell);
introSaluxBtn.addEventListener('click', showSaluxModal);
openTicketSection.addEventListener('click', showAppShell);
openSaluxBtn.addEventListener('click', showSaluxModal);
modalConfirmBtn.addEventListener('click', openSaluxWhatsApp);
modalCancelBtn.addEventListener('click', hideSaluxModal);
modalOverlay.addEventListener('click', event => {
  if (event.target === modalOverlay) {
    hideSaluxModal();
  }
});

renderTickets();
