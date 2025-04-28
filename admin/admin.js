document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const conteudoForm = document.getElementById('conteudo-form');
    const conteudoIdInput = document.getElementById('conteudo-id');
    const tituloInput = document.getElementById('titulo');
    const descricaoInput = document.getElementById('descricao');
    const categoriaSelect = document.getElementById('categoria');
    const formTitle = document.getElementById('form-title');
    const cancelarBtn = document.getElementById('cancelar-btn');
    const conteudosContainer = document.getElementById('conteudos-container');
    const filtroCategoriaSelect = document.getElementById('filtro-categoria');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    
    // URL da API
    const API_URL = 'http://localhost:8000';
    
    // Estado da aplicação
    let conteudos = [];
    let modoEdicao = false;
    
    // Carregar conteúdos ao iniciar
    carregarConteudos();
    
    // Event Listeners
    conteudoForm.addEventListener('submit', handleFormSubmit);
    cancelarBtn.addEventListener('click', resetForm);
    filtroCategoriaSelect.addEventListener('change', filtrarConteudos);
    
    // Funções
    
    /**
     * Carrega todos os conteúdos da API
     */
    async function carregarConteudos() {
      try {
        const response = await fetch(`${API_URL}/conteudos`);
        if (!response.ok) throw new Error('Falha ao carregar conteúdos');
        
        conteudos = await response.json();
        renderizarConteudos();
      } catch (error) {
        console.error('Erro ao carregar conteúdos:', error);
        mostrarNotificacao('Erro ao carregar conteúdos. Tente novamente.', 'error');
      }
    }
    
    /**
     * Renderiza os conteúdos na interface
     */
    function renderizarConteudos() {
      const filtroCategoria = filtroCategoriaSelect.value;
      
      // Filtrar conteúdos se necessário
      let conteudosFiltrados = conteudos;
      if (filtroCategoria !== 'todos') {
        conteudosFiltrados = conteudos.filter(c => c.categoria === filtroCategoria);
      }
      
      // Limpar container
      conteudosContainer.innerHTML = '';
      
      // Verificar se há conteúdos
      if (conteudosFiltrados.length === 0) {
        conteudosContainer.innerHTML = `
          <div class="text-center py-8 text-gray-400">
            Nenhum conteúdo encontrado.
          </div>
        `;
        return;
      }
      
      // Renderizar cada conteúdo
      conteudosFiltrados.forEach(conteudo => {
        const categoriaClass = conteudo.categoria === 'Avanços Tecnológicos' 
          ? 'text-neon-blue bg-neon-blue/10 border-neon-blue/30' 
          : 'text-neon-purple bg-neon-purple/10 border-neon-purple/30';
        
        const card = document.createElement('div');
        card.className = 'border-gradient p-6 content-card';
        card.innerHTML = `
          <div class="flex flex-col md:flex-row justify-between">
            <div class="mb-4 md:mb-0 md:mr-6 flex-1">
              <h3 class="font-future text-xl font-bold mb-2 text-neon-blue">${conteudo.titulo}</h3>
              <p class="text-gray-300 mb-4">${conteudo.descricao}</p>
              <div class="inline-block px-3 py-1 rounded-full ${categoriaClass} text-sm">
                ${conteudo.categoria}
              </div>
            </div>
            
            <div class="flex flex-row md:flex-col space-x-3 md:space-x-0 md:space-y-3">
              <button 
                class="border border-neon-blue/50 bg-neon-blue/10 hover:bg-neon-blue/20 py-2 px-4 rounded-md font-future text-sm transition-all duration-300 text-neon-blue"
                onclick="editarConteudo('${conteudo.id}')"
              >
                EDITAR
              </button>
              
              <button 
                class="border border-neon-pink/50 bg-neon-pink/10 hover:bg-neon-pink/20 py-2 px-4 rounded-md font-future text-sm transition-all duration-300 text-neon-pink"
                onclick="excluirConteudo('${conteudo.id}')"
              >
                EXCLUIR
              </button>
            </div>
          </div>
        `;
        
        conteudosContainer.appendChild(card);
      });
    }
    
    /**
     * Manipula o envio do formulário (criar ou atualizar)
     */
    async function handleFormSubmit(e) {
      e.preventDefault();
      
      const conteudo = {
        titulo: tituloInput.value,
        descricao: descricaoInput.value,
        categoria: categoriaSelect.value
      };
      
      try {
        let response;
        
        if (modoEdicao) {
          // Atualizar conteúdo existente
          response = await fetch(`${API_URL}/conteudos/${conteudoIdInput.value}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(conteudo)
          });
          
          if (!response.ok) throw new Error('Falha ao atualizar conteúdo');
          mostrarNotificacao('Conteúdo atualizado com sucesso!');
        } else {
          // Criar novo conteúdo
          response = await fetch(`${API_URL}/conteudos`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(conteudo)
          });
          
          if (!response.ok) throw new Error('Falha ao criar conteúdo');
          mostrarNotificacao('Conteúdo criado com sucesso!');
        }
        
        // Resetar formulário e recarregar conteúdos
        resetForm();
        carregarConteudos();
        
      } catch (error) {
        console.error('Erro ao salvar conteúdo:', error);
        mostrarNotificacao('Erro ao salvar conteúdo. Tente novamente.', 'error');
      }
    }
    
    /**
     * Prepara o formulário para edição de um conteúdo
     */
    window.editarConteudo = function(id) {
      const conteudo = conteudos.find(c => c.id === id);
      if (!conteudo) return;
      
      // Preencher formulário
      conteudoIdInput.value = conteudo.id;
      tituloInput.value = conteudo.titulo;
      descricaoInput.value = conteudo.descricao;
      categoriaSelect.value = conteudo.categoria;
      
      // Atualizar UI para modo de edição
      formTitle.textContent = 'EDITAR CONTEÚDO';
      cancelarBtn.classList.remove('hidden');
      modoEdicao = true;
      
      // Scroll para o formulário
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };
    
    /**
     * Exclui um conteúdo
     */
    window.excluirConteudo = async function(id) {
      if (!confirm('Tem certeza que deseja excluir este conteúdo?')) return;
      
      try {
        const response = await fetch(`${API_URL}/conteudos/${id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Falha ao excluir conteúdo');
        
        mostrarNotificacao('Conteúdo excluído com sucesso!');
        carregarConteudos();
        
      } catch (error) {
        console.error('Erro ao excluir conteúdo:', error);
        mostrarNotificacao('Erro ao excluir conteúdo. Tente novamente.', 'error');
      }
    };
    
    /**
     * Reseta o formulário para o estado inicial
     */
    function resetForm() {
      conteudoForm.reset();
      conteudoIdInput.value = '';
      formTitle.textContent = 'ADICIONAR NOVO CONTEÚDO';
      cancelarBtn.classList.add('hidden');
      modoEdicao = false;
    }
    
    /**
     * Filtra os conteúdos por categoria
     */
    function filtrarConteudos() {
      renderizarConteudos();
    }
    
    /**
     * Mostra uma notificação temporária
     */
    function mostrarNotificacao(mensagem, tipo = 'success') {
      notificationMessage.textContent = mensagem;
      
      // Definir cor com base no tipo
      if (tipo === 'error') {
        notification.classList.remove('bg-neon-blue/20', 'border-neon-blue/50');
        notification.classList.add('bg-neon-pink/20', 'border-neon-pink/50');
      } else {
        notification.classList.remove('bg-neon-pink/20', 'border-neon-pink/50');
        notification.classList.add('bg-neon-blue/20', 'border-neon-blue/50');
      }
      
      // Mostrar notificação
      notification.classList.remove('translate-y-20', 'opacity-0');
      
      // Esconder após 3 segundos
      setTimeout(() => {
        notification.classList.add('translate-y-20', 'opacity-0');
      }, 3000);
    }
  });