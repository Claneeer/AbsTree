# AbsTree

AbsTree é uma plataforma interativa e educativa desenvolvida para auxiliar no ensino e aprendizado de Estruturas de Dados, permitindo visualizar o funcionamento de diversas estruturas de forma dinâmica e didática.

---

## 🌟 Novas Implementações & Melhorias

Esta versão foi expandida e refatorada com as seguintes funcionalidades avançadas:

* **Heap (Max e Min)**: Implementação completa de estruturas Max-Heap e Min-Heap, com visualização da árvore binária correspondente e visualizador de Array indexado em tempo real.
* **HeapSort**: Algoritmo de ordenação interativo com animação passo a passo (extração consecutiva e re-sift) com exibição do resultado final formatado.
* **Edição Inline de Nós**: Edição direta de valores dando duplo clique em qualquer nó do canvas ou da heap (o sistema executa a remoção do valor antigo, a inserção do novo e o rebalanceamento automático).
* **Painel de Detalhes do Nó**: Seleção de nós com clique simples exibindo métricas detalhadas (valor, altura, fator de balanceamento, cor, filhos e índice no array).
* **Geração Dinâmica de Código C++**: Painel lateral interativo que exibe código C++ completo e realiza o destaque (highlight) linha por linha de acordo com a operação e o passo atual executados na árvore.
* **Geração de Valores Aleatórios**: Ferramenta na barra de utilitários para construir árvores complexas (5 a 30 nós) com delay controlado para fins de demonstração.
* **Controle de Velocidade**: Slider para alternar a velocidade das animações (Devagar / Normal / Rápido).
* **Robustez e Estabilidade**: Controle assíncrono rigoroso (`isAnimating`) para evitar concorrência de cliques, além de limitação dinâmica de linhas no terminal interno.

## 🛠️ Tecnologias Utilizadas

* **HTML5** (Semântico e responsivo)
* **CSS3** (Tema escuro premium com efeitos de glow e glassmorphism)
* **JavaScript** (ES2020+ Vanilla puro, modularizado internamente)
* **SVG** (Layout dinâmico para renderização perfeita das estruturas)

## 👤 Créditos

Créditos ao [abstree.lab](https://github.com/abstreeilw-lab) pelo código original e concepção inicial desta plataforma educativa de visualização de árvores.

---

Facilitar o aprendizado de árvores em Estrutura de Dados por meio de animações, representações gráficas e interação visual em tempo real.
