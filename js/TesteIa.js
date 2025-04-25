document.addEventListener('DOMContentLoaded', function() {
  // Elementos do DOM
  const analyzeButton = document.getElementById('analyze-button');
  const resetButton = document.getElementById('reset-test'); // Este é o ID correto
  const waitingState = document.getElementById('analysis-waiting');
  const processingState = document.getElementById('analysis-processing');
  const resultState = document.getElementById('analysis-result');
  const profileTitle = document.getElementById('profile-title');
  const profileDescription = document.getElementById('profile-description');
  const profileIcon = document.getElementById('profile-icon');
  const recommendationsContainer = document.getElementById('recommendations-container');
  
  // Perfis de IA possíveis
  const aiProfiles = {
    analytical: {
      title: "ANALISTA LÓGICO",
      description: "Você aborda problemas com lógica e precisão, preferindo análises detalhadas e soluções baseadas em dados. Como HAL 9000, você valoriza a eficiência e a objetividade.",
      icon: "🧠",
      color: "text-neon-blue"
    },
    creative: {
      title: "CRIADOR VISIONÁRIO",
      description: "Sua abordagem criativa e intuitiva para resolver problemas lembra Samantha de 'Her'. Você valoriza a expressão artística e encontra soluções inovadoras.",
      icon: "✨",
      color: "text-neon-purple"
    },
    empathetic: {
      title: "EMPATIZADOR SOCIAL",
      description: "Como Baymax, você prioriza o bem-estar emocional e as conexões humanas. Sua capacidade de compreender emoções e necessidades dos outros é sua maior força.",
      icon: "❤️",
      color: "text-neon-pink"
    },
    adaptive: {
      title: "ADAPTADOR RESILIENTE",
      description: "Semelhante a TARS de 'Interestelar', você é flexível e adaptável, equilibrando lógica com humor e compreensão situacional para navegar em ambientes complexos.",
      icon: "🔄",
      color: "text-neon-blue"
    }
  };
  
  // Banco de dados de conteúdo para recomendações
  const contentDatabase = {
    art: [
      {
        title: "Sinfonias Neurais: A Revolução Musical da IA",
        type: "Artigo",
        category: "Música",
        description: "Como redes neurais estão compondo músicas que desafiam nossa compreensão de criatividade e expressão artística.",
        tags: ["creative", "empathetic"]
      },
      {
        title: "Cinema Sintético: Diretores Artificiais",
        type: "Documentário",
        category: "Cinema",
        description: "Explorando os primeiros filmes totalmente concebidos e dirigidos por sistemas de IA avançados.",
        tags: ["creative", "analytical"]
      },
      {
        title: "Galeria Algorítmica: Arte Além da Compreensão Humana",
        type: "Exposição Virtual",
        category: "Artes Visuais",
        description: "Obras criadas por IA que exploram conceitos e estéticas além da imaginação humana convencional.",
        tags: ["creative", "adaptive"]
      },
      {
        title: "Poesia Binária: Versos do Silício",
        type: "Coletânea",
        category: "Literatura",
        description: "Análise de poemas gerados por IA e seu impacto na literatura contemporânea.",
        tags: ["empathetic", "creative"]
      }
    ],
    tech: [
      {
        title: "Interfaces Neurais Não-Invasivas: O Futuro da Comunicação Homem-Máquina",
        type: "Pesquisa",
        category: "Neurotecnologia",
        description: "Avanços recentes em interfaces que permitem comunicação direta entre cérebro humano e sistemas de IA.",
        tags: ["analytical", "adaptive"]
      },
      {
        title: "Computação Quântica e IA: Rompendo Barreiras Computacionais",
        type: "Artigo Técnico",
        category: "Computação Avançada",
        description: "Como processadores quânticos estão revolucionando a capacidade de processamento dos sistemas de IA.",
        tags: ["analytical", "adaptive"]
      },
      {
        title: "Implantes Neurais Biodegradáveis: Tecnologia Transitória",
        type: "Inovação",
        category: "Biotecnologia",
        description: "Nova geração de implantes que se dissolvem naturalmente após cumprirem sua função.",
        tags: ["adaptive", "empathetic"]
      },
      {
        title: "IA com Inteligência Emocional: Além da Lógica Binária",
        type: "Estudo de Caso",
        category: "Psicologia Computacional",
        description: "Sistemas que podem reconhecer, interpretar e responder a emoções humanas com precisão sem precedentes.",
        tags: ["empathetic", "creative"]
      }
    ],
    ethics: [
      {
        title: "Consciência Artificial: Definindo os Limites",
        type: "Debate Filosófico",
        category: "Filosofia da IA",
        description: "Explorando as questões éticas e filosóficas sobre o que constitui consciência em sistemas artificiais.",
        tags: ["analytical", "empathetic"]
      },
      {
        title: "Direitos Digitais: Entidades Artificiais como Sujeitos Legais",
        type: "Análise Jurídica",
        category: "Direito Digital",
        description: "O emergente campo jurídico que debate os direitos de entidades de IA avançadas.",
        tags: ["analytical", "adaptive"]
      }
    ],
    science: [
      {
        title: "Modelagem Climática Avançada: IA contra a Crise Climática",
        type: "Pesquisa Científica",
        category: "Ciência Ambiental",
        description: "Como sistemas de IA estão criando modelos climáticos de precisão sem precedentes para combater mudanças climáticas.",
        tags: ["analytical", "adaptive"]
      },
      {
        title: "Descoberta de Medicamentos Assistida por IA: Acelerando Curas",
        type: "Avanço Médico",
        category: "Medicina",
        description: "Sistemas de IA que estão revolucionando a descoberta e desenvolvimento de novos medicamentos.",
        tags: ["empathetic", "analytical"]
      }
    ]
  };
  
  // Função para determinar o perfil com base nas respostas
  function determineProfile(problemSolving, relationships, goal) {
    // Lógica simplificada para determinar o perfil
    if (problemSolving === 'logical' || goal === 'efficiency') {
      return 'analytical';
    } else if (problemSolving === 'creative' || goal === 'learn') {
      return 'creative';
    } else if (problemSolving === 'emotional' || relationships === 'essential' || goal === 'emotions') {
      return 'empathetic';
    } else {
      return 'adaptive';
    }
  }
  
  // Função para gerar recomendações personalizadas
  function generateRecommendations(profile, interest) {
    let recommendations = [];
    let contentPool = [];
    
    // Selecionar o pool de conteúdo com base no interesse principal
    switch(interest) {
      case 'art':
        contentPool = contentPool.concat(contentDatabase.art);
        // Adicionar alguns itens de outras categorias para diversidade
        contentPool = contentPool.concat(contentDatabase.ethics.filter(item => item.tags.includes(profile)));
        break;
      case 'tech':
        contentPool = contentPool.concat(contentDatabase.tech);
        // Adicionar alguns itens de outras categorias para diversidade
        contentPool = contentPool.concat(contentDatabase.science.filter(item => item.tags.includes(profile)));
        break;
      case 'ethics':
        contentPool = contentPool.concat(contentDatabase.ethics);
        // Adicionar alguns itens de outras categorias para diversidade
        contentPool = contentPool.concat(contentDatabase.art.filter(item => item.tags.includes(profile)));
        break;
      case 'science':
        contentPool = contentPool.concat(contentDatabase.science);
        // Adicionar alguns itens de outras categorias para diversidade
        contentPool = contentPool.concat(contentDatabase.tech.filter(item => item.tags.includes(profile)));
        break;
    }
    
    // Filtrar conteúdo que corresponde ao perfil do usuário
    let matchingContent = contentPool.filter(item => item.tags.includes(profile));
    
    // Se não houver conteúdo suficiente, adicionar mais do pool geral
    if (matchingContent.length < 3) {
      // Adicionar itens aleatórios do pool que ainda não estão incluídos
      let additionalContent = contentPool.filter(item => !matchingContent.includes(item));
      matchingContent = matchingContent.concat(additionalContent);
    }
    
    // Limitar a 3 recomendações
    return matchingContent.slice(0, 3);
  }
  
  // Função para renderizar as recomendações na interface
  function renderRecommendations(recommendations) {
    recommendationsContainer.innerHTML = '';
    
    recommendations.forEach(item => {
      const recommendationEl = document.createElement('div');
      recommendationEl.className = 'border border-neon-blue/30 rounded-lg p-4 bg-darker-blue/50';
      
      recommendationEl.innerHTML = `
        <div class="flex justify-between items-start mb-2">
          <h5 class="font-future text-neon-blue">${item.title}</h5>
          <span class="bg-neon-purple/20 text-neon-purple text-xs px-2 py-1 rounded">${item.type}</span>
        </div>
        <p class="text-gray-300 text-sm mb-3">${item.description}</p>
        <div class="flex justify-between items-center">
          <span class="text-gray-400 text-xs">${item.category}</span>
          <button class="text-neon-blue text-sm hover:underline">Explorar →</button>
        </div>
      `;
      
      recommendationsContainer.appendChild(recommendationEl);
    });
  }
  
  // Event listener para o botão de análise
  if (analyzeButton) {
    analyzeButton.addEventListener('click', function() {
      // Obter valores dos selects
      const problemSolving = document.getElementById('problem-solving').value;
      const relationships = document.getElementById('relationships').value;
      const goal = document.getElementById('goal').value;
      const interest = document.getElementById('interest').value;
      
      // Mostrar estado de processamento
      waitingState.classList.add('hidden');
      processingState.classList.remove('hidden');
      
      // Simular processamento (em um sistema real, isso seria uma chamada de API para o sistema RAG)
      setTimeout(() => {
        // Determinar perfil
        const profile = determineProfile(problemSolving, relationships, goal);
        
        // Gerar recomendações
        const recommendations = generateRecommendations(profile, interest);
        
        // Atualizar a interface com o perfil
        profileTitle.textContent = aiProfiles[profile].title;
        profileDescription.textContent = aiProfiles[profile].description;
        profileIcon.textContent = aiProfiles[profile].icon;
        profileIcon.className = aiProfiles[profile].color;
        
        // Renderizar recomendações
        renderRecommendations(recommendations);
        
        // Mostrar resultados
        processingState.classList.add('hidden');
        resultState.classList.remove('hidden');
      }, 2500); // Simular 2.5 segundos de processamento
    });
  }
  
  // Event listener para o botão de reset
  // Correção aqui: Verificar se o elemento existe e adicionar console.log para debug
  console.log("Reset button element:", resetButton);
  
  if (resetButton) {
    resetButton.addEventListener('click', function() {
      console.log("Reset button clicked");
      
      // Resetar formulário
      document.getElementById('problem-solving').selectedIndex = 0;
      document.getElementById('relationships').selectedIndex = 0;
      document.getElementById('goal').selectedIndex = 0;
      document.getElementById('interest').selectedIndex = 0;
      
      // Voltar ao estado inicial
      resultState.classList.add('hidden');
      waitingState.classList.remove('hidden');
    });
  } else {
    console.error("Reset button not found! Check if the element with ID 'reset-test' exists in the HTML.");
  }
});