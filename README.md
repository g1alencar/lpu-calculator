
# NetApp LPU Calculator

![Badge: HTML5](https://img.shields.io/badge/HTML5-✓-orange?style=flat-square)
![Badge: JS](https://img.shields.io/badge/JavaScript-✓-yellow?style=flat-square)
![Badge: CSS3](https://img.shields.io/badge/CSS3-✓-blue?style=flat-square)
![Badge: LocalStorage](https://img.shields.io/badge/LocalStorage-Suportado-brightgreen?style=flat-square)

Calculadora moderna e responsiva para estimativa de horas, custos e geração de proposta para projetos de storage NetApp.

## Funcionalidades Principais

- Cadastro de cliente, seleção de serviços, definição de valores por perfil
- Busca dinâmica de serviços
- Cálculo automático de horas e estimativa de custos
- **Múltiplos projetos**: salve, carregue e exclua propostas no navegador
- Exportação **PDF** profissional e **CSV**
- Copiar resumo da proposta em 1 clique
- Estilo visual moderno, tabelas responsivas e layout preparado para uso interno
- **Armazenamento local** (não precisa de backend/servidor)

## Pré-requisitos

- Apenas um navegador moderno (Google Chrome, Edge, Firefox, etc)
- Não requer instalação de dependências, backend ou banco de dados

## Como Usar

1. **Clone ou baixe o repositório**  
   ```bash
   git clone https://github.com/seu-usuario/nome-do-repo.git
   ```
   Ou baixe e extraia o .zip

2. **Abra o arquivo `index.html`** no seu navegador  
   > Dica: Para usar exportação PDF com logo externa, rode localmente um servidor (ex: `python -m http.server`).

3. **Preencha os campos** de cliente, serviços e valores
4. Clique em **Calcular** para ver a estimativa
5. Salve, carregue ou exclua projetos
6. **Exporte a proposta em PDF ou CSV**, ou copie o resumo

## Imagens de Exemplo

| Cadastro de proposta | Resultado e exportação |
|----------------------|-----------------------|
| ![cadastro](docs/cadastro.png) | ![resultado](docs/resultado.png) |

> **Obs:** Imagens e nomes são fictícios.  
> Customize o estilo e a logo conforme sua identidade visual!

## Estrutura do Projeto

```
/
├── index.html
├── style.css
├── app.js
├── README.md
└── (logo.png ou logo externa)
```

## FAQ

- **Meus dados ficam salvos?**  
  Sim, tudo é salvo no seu navegador, sem sair do seu computador.

- **Funciona em celular?**  
  Sim! O layout é responsivo.

- **Posso personalizar os serviços?**  
  Sim, basta editar o array `services` no `app.js`.

- **Como hospedar para equipe?**  
  Suba numa página interna, OneDrive, GitHub Pages ou servidor local.

## Autor

Desenvolvido por [Gabriel Alencar](https://github.com/g1alencar) para Columbia Integração TI.

---

> **Sugestões, bugs ou melhorias:**  
> Crie uma issue ou abra um pull request!
