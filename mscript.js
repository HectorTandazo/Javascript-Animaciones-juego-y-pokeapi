// Control del cubo 3D
let cuboElement = document.getElementById('cubo');
let isPaused = false;
let currentSpeed = 8;
let isReverse = false;

function pausarCubo() {
    if (isPaused) {
        cuboElement.style.animationPlayState = 'running';
        isPaused = false;
    } else {
        cuboElement.style.animationPlayState = 'paused';
        isPaused = true;
    }
}

function cambiarVelocidad() {
    const velocidades = [4, 6, 8, 12, 16];
    const currentIndex = velocidades.indexOf(currentSpeed);
    const nextIndex = (currentIndex + 1) % velocidades.length;
    currentSpeed = velocidades[nextIndex];
    
    cuboElement.style.animationDuration = currentSpeed + 's';
}

function cambiarDireccion() {
    isReverse = !isReverse;
    cuboElement.style.animationDirection = isReverse ? 'reverse' : 'normal';
}

// URL base
const baseUrl = 'https://pokeapi.co/api/v2/pokemon';

// referencias a elementos HTML
const el = {
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    randomBtn: document.getElementById('randomBtn'),
    card: document.getElementById('card'),
    pokeImg: document.getElementById('pokeImg'),
    pokeName: document.getElementById('pokeName'),
    pokeId: document.getElementById('pokeId'),
    types: document.getElementById('types'),
    stats: document.getElementById('stats'),
    moves: document.getElementById('moves'),
    error: document.getElementById('error')
};

// función para pedir datos
async function fetchPokemon(query) {
    try {
        el.error.classList.add('hidden');
        const res = await fetch(`${baseUrl}/${encodeURIComponent(query.toLowerCase())}`);
        if (!res.ok) throw new Error('Pokémon no encontrado');
        return await res.json();
    } catch (err) {
        throw err;
    }
}

// FUNCIÓN CORRECTA showPokemon(data)
function showPokemon(data) {
    el.card.classList.remove('hidden');

    // imagen correcta
    const artwork = data.sprites.other['official-artwork'].front_default || data.sprites.front_default;
    el.pokeImg.src = artwork || '';
    el.pokeImg.alt = data.name;

    // info básica
    el.pokeName.textContent = data.name;
    el.pokeId.textContent = `ID: ${data.id}`;

    // tipos
    el.types.innerHTML = '';
    data.types.forEach(t => {
        const d = document.createElement('div');
        d.className = 'type';
        d.textContent = t.type.name;
        el.types.appendChild(d);
    });

    // stats
    el.stats.innerHTML = '';
    data.stats.forEach(s => {
        const box = document.createElement('div');
        box.className = 'stat';
        box.innerHTML = `<strong>${s.stat.name}</strong><div>${s.base_stat}</div>`;
        el.stats.appendChild(box);
    });

    // movimientos
    el.moves.innerHTML = `<strong>Movimientos:</strong> ${data.moves
        .slice(0, 6)
        .map(m => m.move.name)
        .join(', ')}${data.moves.length > 6 ? '...' : ''}`;
}

// mostrar errores
function showError(message) {
    el.card.classList.add('hidden');
    el.error.textContent = message;
    el.error.classList.remove('hidden');
}

// botón buscar
el.searchBtn.addEventListener('click', async () => {
    const q = el.searchInput.value.trim();
    if (!q) return showError('Escribe un nombre o ID.');
    try {
        const data = await fetchPokemon(q);
        showPokemon(data);
    } catch (err) {
        showError(err.message || 'Error inesperado');
    }
});

// botón aleatorio
el.searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') el.searchBtn.click();
});

async function randomPokemon() {
    const list = await fetch('https://pokeapi.co/api/v2/pokemon?limit=2000')
        .then(r => r.json());

    const random = list.results[Math.floor(Math.random() * list.results.length)];
    return await fetchPokemon(random.name);
}

el.randomBtn?.addEventListener('click', async () => {
    try {
        const data = await randomPokemon();
        showPokemon(data);
    } catch {
        showError('No se pudo cargar el Pokémon aleatorio');
    }
});

// Inicializar cubo si existe
if (cuboElement) {
    // Efecto hover en las caras
    document.querySelectorAll('.cara').forEach(cara => {
        cara.addEventListener('mouseenter', () => {
            cara.style.transform += ' scale(1.05)';
        });
        cara.addEventListener('mouseleave', () => {
            cara.style.transform = cara.style.transform.replace(' scale(1.05)', '');
        });
    });
}
