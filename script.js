//Mobile btn - animação ao clicar e layout da lista

const mobileBtn = document.getElementById('mobile_btn');
const mobileMenu = document.getElementById('mobile_menu');
const mobileIcon = mobileBtn.querySelector('i');
const mobileLinks = document.querySelectorAll('#mobile_menu a');

mobileBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('active');

  if (mobileMenu.classList.contains('active')) {
    mobileIcon.classList.remove('fa-bars');
    mobileIcon.classList.add('fa-xmark');
  } else {
    mobileIcon.classList.remove('fa-xmark');
    mobileIcon.classList.add('fa-bars');
  }
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    mobileIcon.classList.remove('fa-xmark');
    mobileIcon.classList.add('fa-bars');
  });
});

//Botao pra voltar pro topo
const scrollTopBtn = document.getElementById('scroll_top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    scrollTopBtn.classList.add('show');
  } else {
    scrollTopBtn.classList.remove('show');
  }
});

// sobe tudo ao clicar
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

//botao para mudar a cor do sistema / modo noturno e diurno
const themeButtons = document.querySelectorAll('.theme_toggle');

if (themeButtons.length) {
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
  updateIcons(theme);

  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateIcons(newTheme);
    });
  });

  function updateIcons(theme) {
    themeButtons.forEach(btn => {
      const icon = btn.querySelector('i');
      icon.className =
        theme === 'dark'
          ? 'fa-solid fa-sun'
          : 'fa-solid fa-moon';
    });
  }
}

//Animação dos artigos
const objCards = document.querySelectorAll('#obj article');

const objObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      } else {
        entry.target.classList.remove('show');
      }
    });
  },
  {
    threshold: 0.2
  }
);

objCards.forEach((card, index) => {
  card.style.transitionDelay = `${index * 0.05}s`;
  objObserver.observe(card);
});

//Notas no quem.css

const people = document.querySelectorAll('.photo-item');
const note = document.getElementById('profile_note');
const noteName = document.getElementById('note_name');
const noteRole = document.getElementById('note_role');
const noteInfo = document.getElementById('note_info');

let hideTimeout = null; // Variável para controlar o tempo de sumir

function showNote(person) {
  // Limpa qualquer ordem de "sumir" pendente se o mouse voltar
  if (hideTimeout) clearTimeout(hideTimeout);

  noteName.textContent = person.dataset.nome;
  noteRole.textContent = person.dataset.cargo;
  noteInfo.textContent = person.dataset.info;

  // Precisamos mostrar o elemento primeiro para pegar a largura real dele
  note.classList.add('show');

  const rect = person.getBoundingClientRect();
  const noteWidth = note.offsetWidth;
  const padding = 15; // Espacinho entre foto e card
  const scrollY = window.scrollY;
  const scrollX = window.scrollX;

  let top, left;

  // Lógica Desktop (acima de 768px ou 1024px conforme sua preferência)
  if (window.innerWidth > 1024) { 
    top = rect.top + scrollY;
    
    // PEDIDO 1: Lado Esquerdo ou Direito
    // Verifica se tem o atributo data-lado="esquerdo"
    if (person.dataset.lado === 'esquerdo') {
        left = (rect.left + scrollX) - noteWidth - padding;
    } else {
        // Padrão: Lado direito
        left = rect.right + scrollX + padding;
    }

  } else {
    // PEDIDO 2: Centralizar no Mobile
    // Coloca o card logo abaixo da foto
    top = rect.bottom + scrollY + padding;

    // A mágica da centralização: (Largura da Tela / 2) - (Largura do Card / 2)
    left = (window.innerWidth / 2) - (noteWidth / 2);
    
    // Ajuste fino: Se o usuário der scroll horizontal ou tela muito pequena
    // Garante que não saia da tela (margem de segurança de 10px)
    if (left < 10) left = 10;
    if ((left + noteWidth) > window.innerWidth) {
        left = window.innerWidth - noteWidth - 10;
    }
  }

  note.style.top = `${top}px`;
  note.style.left = `${left}px`;
}

// Função para agendar o fechamento
function scheduleHide() {
  hideTimeout = setTimeout(() => {
    note.classList.remove('show');
  }, 200); // Espera 200ms antes de fechar (dá tempo do mouse passar da foto pro card)
}

// PEDIDO 3: Mouse sobre o card não fecha
// Se o mouse entrar no CARD, cancela o fechamento
note.addEventListener('mouseenter', () => {
  if (hideTimeout) clearTimeout(hideTimeout);
});

// Se o mouse sair do CARD, agenda o fechamento
note.addEventListener('mouseleave', scheduleHide);

people.forEach(person => {
  // Entrou na foto -> Mostra
  person.addEventListener('mouseenter', () => showNote(person));
  
  // Saiu da foto -> Agenda fechamento (não fecha na hora)
  person.addEventListener('mouseleave', scheduleHide);
  
  // Click (para mobile principalmente)
  person.addEventListener('click', (e) => {
      // Impede propagação se clicar na foto, para não fechar instantaneamente
      e.stopPropagation(); 
      showNote(person);
  });
});

// Clicar fora fecha imediatamente
document.addEventListener('click', (e) => {
  if (!e.target.closest('.photo-item') && !e.target.closest('#profile_note')) {
    note.classList.remove('show');
  }
});
