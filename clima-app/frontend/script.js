const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:8000' 
    : 'https://api-clima-zeta-ten.vercel.app';

const cidadeInput = document.getElementById('cidade-input');
const buscarBtn = document.getElementById('buscar-btn');
const loadingElement = document.getElementById('loading');
const erroContainer = document.getElementById('erro-container');
const erroMensagem = document.getElementById('erro-mensagem');
const resultadoContainer = document.getElementById('resultado-container');

const cidadeNome = document.getElementById('cidade-nome');
const temperaturaElement = document.getElementById('temperatura');
const sensacaoTermicaElement = document.getElementById('sensacao-termica');
const umidadeElement = document.getElementById('umidade');
const descricaoClimaElement = document.getElementById('descricao-clima');
const sugestoesLista = document.getElementById('sugestoes-lista');

let debounceTimer = null;
let indiceSelecionado = -1;

function mostrarLoading() {
    loadingElement.classList.remove('hidden');
    erroContainer.classList.add('hidden');
    resultadoContainer.classList.add('hidden');
    buscarBtn.disabled = true;
}

function esconderLoading() {
    loadingElement.classList.add('hidden');
    buscarBtn.disabled = false;
}

function mostrarErro(mensagem) {
    esconderLoading();
    resultadoContainer.classList.add('hidden');
    erroContainer.classList.remove('hidden');
    erroMensagem.textContent = mensagem;
}

function exibirResultado(dados) {
    esconderLoading();
    erroContainer.classList.add('hidden');
    resultadoContainer.classList.remove('hidden');
    
    cidadeNome.textContent = dados.cidade;
    temperaturaElement.textContent = `${dados.temperatura}°C`;
    sensacaoTermicaElement.textContent = `${dados.sensacao_termica}°C`;
    umidadeElement.textContent = `${dados.umidade}%`;
    descricaoClimaElement.textContent = dados.descricao_clima;
}

function traduzirErro(status, mensagemAPI) {
    if (mensagemAPI) {
        return mensagemAPI;
    }
    
    switch (status) {
        case 400:
            return 'Por favor, digite o nome de uma cidade.';
        case 404:
            return 'Cidade não encontrada. Verifique o nome e tente novamente.';
        case 500:
            return 'Erro interno do servidor. Tente novamente mais tarde.';
        case 504:
            return 'O servidor demorou para responder. Tente novamente.';
        default:
            return 'Ocorreu um erro inesperado. Tente novamente.';
    }
}

async function buscarClima() {
    const cidade = cidadeInput.value.trim();
    
    if (!cidade) {
        mostrarErro('Por favor, digite o nome de uma cidade.');
        cidadeInput.focus();
        return;
    }
    
    mostrarLoading();
    
    try {
        const url = `${API_BASE_URL}/clima?cidade=${encodeURIComponent(cidade)}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        const dados = await response.json();
        
        if (!response.ok) {
            const mensagemErro = dados.detail || null;
            mostrarErro(traduzirErro(response.status, mensagemErro));
            return;
        }
        
        exibirResultado(dados);
        
    } catch (erro) {
        console.error('Erro ao buscar clima:', erro);
        
        if (erro.name === 'TypeError' && erro.message.includes('fetch')) {
            mostrarErro('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
        } else {
            mostrarErro('Erro ao buscar dados do clima. Tente novamente.');
        }
    }
}

buscarBtn.addEventListener('click', buscarClima);

cidadeInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        buscarClima();
    }
});

cidadeInput.addEventListener('input', () => {
    if (!erroContainer.classList.contains('hidden')) {
        erroContainer.classList.add('hidden');
    }
    
    const termo = cidadeInput.value.trim();
    
    if (debounceTimer) {
        clearTimeout(debounceTimer);
    }
    
    if (termo.length < 2) {
        esconderSugestoes();
        return;
    }
    
    debounceTimer = setTimeout(() => {
        buscarSugestoes(termo);
    }, 300);
});

async function buscarSugestoes(termo) {
    try {
        const url = `${API_BASE_URL}/cidades?q=${encodeURIComponent(termo)}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            esconderSugestoes();
            return;
        }
        
        const cidades = await response.json();
        exibirSugestoes(cidades);
        
    } catch (erro) {
        console.error('Erro ao buscar sugestões:', erro);
        esconderSugestoes();
    }
}

function exibirSugestoes(cidades) {
    if (cidades.length === 0) {
        esconderSugestoes();
        return;
    }
    
    indiceSelecionado = -1;
    sugestoesLista.innerHTML = '';
    
    cidades.forEach((cidade, index) => {
        const li = document.createElement('li');
        li.className = 'sugestao-item';
        li.setAttribute('data-index', index);
        li.setAttribute('data-nome', cidade.nome);
        li.innerHTML = cidade.texto;
        
        li.addEventListener('click', () => {
            selecionarSugestao(cidade.nome);
        });
        
        sugestoesLista.appendChild(li);
    });
    
    sugestoesLista.classList.remove('hidden');
}

function esconderSugestoes() {
    sugestoesLista.classList.add('hidden');
    sugestoesLista.innerHTML = '';
    indiceSelecionado = -1;
}

function selecionarSugestao(nome) {
    cidadeInput.value = nome;
    esconderSugestoes();
    buscarClima();
}

cidadeInput.addEventListener('keydown', (event) => {
    const itens = sugestoesLista.querySelectorAll('.sugestao-item');
    
    if (sugestoesLista.classList.contains('hidden') || itens.length === 0) {
        return;
    }
    
    if (event.key === 'ArrowDown') {
        event.preventDefault();
        indiceSelecionado = Math.min(indiceSelecionado + 1, itens.length - 1);
        atualizarSelecao(itens);
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        indiceSelecionado = Math.max(indiceSelecionado - 1, 0);
        atualizarSelecao(itens);
    } else if (event.key === 'Enter' && indiceSelecionado >= 0) {
        event.preventDefault();
        const itemSelecionado = itens[indiceSelecionado];
        selecionarSugestao(itemSelecionado.getAttribute('data-nome'));
    } else if (event.key === 'Escape') {
        esconderSugestoes();
    }
});

function atualizarSelecao(itens) {
    itens.forEach((item, index) => {
        if (index === indiceSelecionado) {
            item.classList.add('ativo');
            item.scrollIntoView({ block: 'nearest' });
        } else {
            item.classList.remove('ativo');
        }
    });
}

document.addEventListener('click', (event) => {
    if (!cidadeInput.contains(event.target) && !sugestoesLista.contains(event.target)) {
        esconderSugestoes();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    cidadeInput.focus();
});
