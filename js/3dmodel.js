    // Inicialização da cena 3D
    function init3DScene() {
        // Elementos DOM
        const container = document.getElementById('container3D');
        if (!container) return;
        
        // Dimensões
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        // Cena, câmera e renderizador
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x050510); // Cor de fundo que combina com o tema
        
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(0, 0, 5);
        
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
        container.appendChild(renderer.domElement);
        
        // Iluminação
        const ambientLight = new THREE.AmbientLight(0x404040, 2);
        scene.add(ambientLight);
        
        const pointLight1 = new THREE.PointLight(0x00f3ff, 2); // Luz neon azul
        pointLight1.position.set(2, 3, 4);
        scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0x9d00ff, 2); // Luz neon roxa
        pointLight2.position.set(-2, -1, 2);
        scene.add(pointLight2);
        
        // Controles de órbita para rotação
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 3;
        controls.maxDistance = 10;
        
        // Carregador de modelo GLTF
        const loader = new THREE.GLTFLoader();
        
        // Efeito de carregamento
        const loadingElement = document.createElement('div');
        loadingElement.style.position = 'absolute';
        loadingElement.style.top = '50%';
        loadingElement.style.left = '50%';
        loadingElement.style.transform = 'translate(-50%, -50%)';
        loadingElement.style.color = '#00f3ff';
        loadingElement.style.fontFamily = "'Orbitron', sans-serif";
        loadingElement.style.fontSize = '1.2rem';
        loadingElement.textContent = 'CARREGANDO...';
        container.appendChild(loadingElement);
        
        // Carregar o modelo
        loader.load(
          'models/360_sphere_robot.glb',
          function (gltf) {
            const model = gltf.scene;
            
            // Ajustar escala e posição
            model.scale.set(1, 1, 1);
            model.position.set(0, 0, 0);
            
            // Adicionar efeito de brilho neon
            model.traverse((node) => {
              if (node.isMesh) {
                // Aplicar material com brilho para elementos metálicos
                if (node.material && node.material.metalness) {
                  node.material.emissive = new THREE.Color(0x00f3ff);
                  node.material.emissiveIntensity = 0.2;
                }
              }
            });
            
            scene.add(model);
            
            // Remover mensagem de carregamento
            container.removeChild(loadingElement);
            
            // Animar o modelo
            if (gltf.animations && gltf.animations.length) {
              const mixer = new THREE.AnimationMixer(model);
              const action = mixer.clipAction(gltf.animations[0]);
              action.play();
              
              const clock = new THREE.Clock();
              
              function animate() {
                requestAnimationFrame(animate);
                
                const delta = clock.getDelta();
                mixer.update(delta);
                
                controls.update();
                renderer.render(scene, camera);
              }
              
              animate();
            } else {
              // Se não houver animações, apenas renderizar
              function animate() {
                requestAnimationFrame(animate);
                controls.update();
                renderer.render(scene, camera);
              }
              
              animate();
            }
          },
          // Progresso de carregamento
          function (xhr) {
            const percentComplete = (xhr.loaded / xhr.total) * 100;
            loadingElement.textContent = `CARREGANDO: ${Math.round(percentComplete)}%`;
          },
          // Erro de carregamento
          function (error) {
            console.error('Erro ao carregar o modelo:', error);
            loadingElement.textContent = 'ERRO AO CARREGAR MODELO';
            loadingElement.style.color = '#ff00f7';
            
            // Criar um modelo de fallback (uma esfera simples)
            const geometry = new THREE.SphereGeometry(1, 32, 32);
            const material = new THREE.MeshStandardMaterial({
              color: 0x00f3ff,
              emissive: 0x00f3ff,
              emissiveIntensity: 0.2,
              metalness: 0.8,
              roughness: 0.2
            });
            const sphere = new THREE.Mesh(geometry, material);
            scene.add(sphere);
            
            function animate() {
              requestAnimationFrame(animate);
              sphere.rotation.y += 0.01;
              controls.update();
              renderer.render(scene, camera);
            }
            
            animate();
            
            // Remover mensagem de erro após 3 segundos
            setTimeout(() => {
              container.removeChild(loadingElement);
            }, 3000);
          }
        );
        
        // Adicionar efeito de partículas cibernéticas
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 500;
        
        const posArray = new Float32Array(particlesCount * 3);
        
        for (let i = 0; i < particlesCount * 3; i++) {
          posArray[i] = (Math.random() - 0.5) * 10;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
          size: 0.02,
          color: 0x00f3ff,
          transparent: true,
          opacity: 0.8,
          blending: THREE.AdditiveBlending
        });
        
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);
        
        // Redimensionar quando a janela mudar de tamanho
        window.addEventListener('resize', () => {
          const newWidth = container.clientWidth;
          const newHeight = container.clientHeight;
          
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          
          renderer.setSize(newWidth, newHeight);
        });
        
        // Animação das partículas
        function animateParticles() {
          requestAnimationFrame(animateParticles);
          
          particlesMesh.rotation.x += 0.0005;
          particlesMesh.rotation.y += 0.0005;
          
          renderer.render(scene, camera);
        }
        
        animateParticles();
      }
      
      // Inicializar a cena quando o DOM estiver carregado
      document.addEventListener('DOMContentLoaded', init3DScene);