# Sistema de Gestão Kaizen/TPM — Escopo Funcional

---

## 1. Visão Geral

O Sistema de Gestão Kaizen/TPM é uma plataforma para centralizar, padronizar e acompanhar a implementação da metodologia Kaizen/TPM em unidades fabris. O sistema permite gerenciar grupos de trabalho, aplicar auditorias estruturadas com checklists, acompanhar a evolução das equipes por sequências (passos) e fornecer visibilidade gerencial sobre o andamento da metodologia.

---

## 2. Objetivos do Sistema

- Centralizar o gerenciamento do Kaizen/TPM em múltiplas unidades fabris
- Padronizar o processo de auditoria e avaliação das áreas
- Controlar a progressão das sequências de cada grupo dentro do Kaizen/TPM
- Manter histórico completo de auditorias e follow-ups
- Gerar relatórios e dashboards para acompanhamento gerencial

---

## 3. Unidades Fabris

O sistema atende duas unidades fabris, cada uma com cadastros completamente independentes:

- **Puma**
- **Monte Alegre**

Cada unidade possui seus próprios cadastros de gerências, áreas, tipos de grupo, checklists, grupos e usuários. Não há compartilhamento de dados entre as unidades.

---

## 4. Perfis de Acesso

O sistema possui três perfis de acesso, sendo que um mesmo usuário pode acumular mais de um perfil:

- **Administrador:** acesso completo a todos os cadastros do módulo de administração, pode aplicar auditorias e follow-ups, visualizar histórico e decidir sobre progressão de sequência.
- **Avaliador:** pode aplicar auditorias e follow-ups, visualizar histórico e decidir sobre progressão de sequência. Não tem acesso aos cadastros de administração.
- **Usuário Comum:** acesso apenas à visualização do histórico de auditorias e follow-ups. Não pode aplicar avaliações nem alterar cadastros.

**Regra de acessibilidade:** todas as telas e botões do sistema ficam visíveis para todos os perfis. Porém, ao tentar acessar uma funcionalidade para a qual não possui permissão, o sistema exibe a mensagem: *"Acesso negado. Você não tem o perfil necessário para acessar essa funcionalidade."*

---

## 5. Telas do Sistema

### 5.1. Seleção de Unidade (FirstPage)

Primeira tela exibida ao usuário após o login. Apresenta as duas unidades fabris disponíveis (Puma e Monte Alegre) para que o usuário selecione em qual deseja trabalhar. Após a escolha, todos os dados exibidos e gerenciados no sistema passam a ser exclusivos da unidade selecionada. O usuário pode trocar de unidade a qualquer momento retornando a essa tela.

### 5.2. Portal da Unidade (Home)

Tela principal da unidade selecionada. Funciona como painel central de navegação e visão executiva. Possui duas grandes seções:

**Painel Executivo (Dashboard)**

Exibe indicadores visuais de alto nível sobre o andamento da metodologia na unidade. Esses indicadores permitem ao gestor ter um panorama rápido sem precisar navegar para outras telas. Os indicadores sugeridos são:

- **Resumo geral de grupos por status:** quantos grupos estão ativos, quantos já atingiram a sequência máxima, quantos estão em andamento.
- **Distribuição de grupos por tipo:** visão de quantos grupos existem em cada tipo (Administrativo, Operacional, 5S etc.).
- **Nota média das últimas auditorias:** nota média geral e segmentada por gerência, área ou tipo de grupo. Permite identificar rapidamente áreas que precisam de atenção.
- **Grupos próximos de avançar sequência:** lista dos grupos cuja última auditoria ficou próxima da meta (por exemplo, acima de 70% da meta), sinalizando oportunidade de acompanhamento.
- **Grupos com auditorias pendentes/atrasadas:** grupos que estão há mais tempo sem receber uma auditoria, ordenados do mais antigo para o mais recente.
- **Evolução temporal:** gráfico de linha mostrando a evolução das notas médias ao longo do tempo, permitindo visualizar tendências de melhoria ou queda.

**Acesso Rápido (Atalhos)**

Botões ou cards de acesso rápido para as funcionalidades mais utilizadas:

- Visualizar Grupos
- Aplicar Auditoria (leva para seleção de grupo)
- Aplicar Follow-up (leva para seleção de grupo)
- Consultar Histórico
- Administração (visível para todos, restrito por perfil)

### 5.3. Visualização de Grupos

Tela dedicada à consulta e gestão dos grupos cadastrados na unidade. Apresenta todos os grupos em formato de lista ou cards, com informações resumidas de cada grupo visíveis à primeira vista: nome do grupo, tipo, gerência/área, sequência atual e sequência máxima.

**Filtros disponíveis:**

- Gerência
- Área
- Tipo de Grupo
- Busca por nome do grupo

**Informações exibidas por grupo:**

- Nome do grupo
- Tipo de grupo
- Gerência e área a que pertence
- Sequência atual / Sequência máxima (ex: "Passo 2 de 5")
- Nota da última auditoria
- Data da última avaliação (auditoria ou follow-up)

**Ações disponíveis por grupo:**

- **Aplicar Auditoria:** inicia o processo de auditoria com possibilidade de avanço de sequência.
- **Aplicar Follow-up:** inicia acompanhamento sem possibilidade de avanço de sequência.
- **Ver Histórico:** consultar todas as auditorias e follow-ups anteriores deste grupo.
- **Editar Grupo:** acessar os dados cadastrais do grupo (restrito por perfil).

### 5.4. Detalhe do Grupo

Tela com todas as informações de um grupo específico, dividida nas seguintes seções:

**Dados do Grupo:**

- Nome do grupo
- Tipo de grupo
- Gerência e área
- Sequência atual e sequência máxima
- Indicação visual de progresso (ex: barra de progresso mostrando "Passo 2 de 5")

**Equipe do Grupo:**

Lista dos integrantes com seus respectivos papéis (Facilitador, Auditor, Membro).

**Últimas Avaliações:**

Resumo das avaliações mais recentes (últimas 3 a 5), com data, tipo (auditoria ou follow-up), nota obtida e nome do aplicador. Link direto para ver o detalhe completo de cada avaliação.

**Ações:**

- Aplicar Auditoria
- Aplicar Follow-up
- Ver Histórico Completo
- Editar Grupo (restrito por perfil)

### 5.5. Tela de Aplicação de Auditoria / Follow-up

Tela onde o avaliador realiza a avaliação de fato. O comportamento é o mesmo para auditoria e follow-up, com a única diferença de que o follow-up não permite decisão de avanço de sequência ao final.

**Cabeçalho da avaliação:**

- Tipo de avaliação (Auditoria ou Follow-up) — preenchido automaticamente conforme a ação escolhida
- Data e hora — gerado automaticamente pelo sistema
- Aplicador — nome do usuário logado, capturado automaticamente da sessão
- Pessoas presentes — seleção múltipla entre os membros cadastrados na equipe do grupo
- Outras pessoas — campo de texto livre para incluir pessoas não cadastradas que estejam participando

**Corpo do checklist:**

O sistema carrega automaticamente o checklist vinculado à sequência atual do grupo. As perguntas são exibidas na ordem definida pela sequência cadastrada. Para cada pergunta, o avaliador informa:

- **Resposta:** Sim, Não, Parcial ou N/A
- **Justificativa:** obrigatória quando a resposta for "Não" ou "Parcial"
- **Anexos:** o avaliador pode incluir fotos ou documentos como evidência em qualquer pergunta

**Barra de progresso:**

Indicação visual do percentual de perguntas já respondidas, para que o avaliador saiba quanto falta para concluir.

**Finalização:**

Ao responder todas as perguntas obrigatórias, o avaliador pode finalizar a avaliação. O sistema então:

1. Calcula a nota final.
2. Exibe o resultado ao avaliador.
3. **Apenas para auditorias:** se o grupo atender todos os critérios de avanço (nota atingiu a meta, todas as perguntas obrigatórias respondidas com "Sim" e grupo não está na sequência máxima), o sistema exibe um alerta e apresenta a opção de "Avançar para próxima sequência" ou "Manter na sequência atual". O avaliador deve obrigatoriamente escolher uma opção antes de salvar.
4. A avaliação é salva no histórico.

### 5.6. Tela de Histórico

Tela de consulta de todas as avaliações já realizadas. Pode ser acessada de forma geral (todos os grupos) ou a partir de um grupo específico.

**Filtros disponíveis:**

- Grupo
- Gerência
- Área
- Tipo de grupo
- Tipo de avaliação (Auditoria / Follow-up)
- Período (data inicial e data final)

**Informações exibidas por avaliação:**

- Data da avaliação
- Grupo avaliado
- Tipo de avaliação (Auditoria / Follow-up)
- Sequência em que o grupo estava no momento da avaliação
- Nota obtida
- Aplicador
- Indicação se houve avanço de sequência (apenas para auditorias)

**Ação de detalhar:**

Ao selecionar uma avaliação, o sistema exibe o detalhamento completo: todas as respostas dadas, justificativas informadas, anexos incluídos, nota calculada, revisão do checklist utilizada na época e, no caso de auditorias, a decisão tomada sobre avanço de sequência.

**Exportação de anexos:**

O usuário pode baixar individualmente qualquer anexo de uma avaliação anterior.

### 5.7. Módulo de Administração

Tela (ou conjunto de telas) acessível a partir do menu principal, dedicada ao gerenciamento de todos os cadastros base do sistema. Restrito ao perfil Administrador.

A organização sugerida é um menu lateral ou abas com as seguintes seções:

- Usuários
- Gerências
- Áreas
- Tipos de Grupo
- Checklists
- Grupos

Cada seção é detalhada no capítulo 6 (Cadastros).

---

## 6. Cadastros (Módulo de Administração)

### 6.1. Cadastro de Usuários

Gerenciamento dos usuários que terão acesso ao sistema.

**Campos:**

- **Nome:** nome completo do usuário.
- **Perfil:** seleção múltipla entre Administrador, Avaliador e/ou Usuário Comum. Um mesmo usuário pode acumular perfis.

**Operações:** Criar, Editar, Visualizar, Excluir.

### 6.2. Cadastro de Gerências

Gerenciamento das gerências (departamentos) da unidade.

**Campos:**

- **Nome:** nome da gerência.
- **Status:** Ativo ou Inativo.

**Operações:** Criar, Editar, Visualizar, Ativar/Inativar.

### 6.3. Cadastro de Áreas

Gerenciamento das áreas vinculadas às gerências.

**Campos:**

- **Nome:** nome da área.
- **Gerência:** gerência à qual a área pertence (seleção entre as gerências ativas).
- **Status:** Ativo ou Inativo.

**Operações:** Criar, Editar, Visualizar, Ativar/Inativar.

### 6.4. Cadastro de Tipos de Grupo

Define os diferentes tipos de grupo (Administrativo, Operacional, 5S etc.) que podem existir na unidade.

**Campos:**

- **Nome:** nome do tipo de grupo.
- **Meta Padrão:** percentual padrão para aprovação (ex: 80%).
- **Status:** Ativo ou Inativo.

**Operações:** Criar, Editar, Visualizar, Ativar/Inativar.

#### 6.4.1. Cadastro de Sequências (Passos)

Após cadastrar um tipo de grupo, o administrador define as sequências (passos) que os grupos desse tipo devem percorrer. Cada sequência possui seu próprio checklist associado.

**Campos:**

- **Tipo de Grupo:** tipo ao qual a sequência pertence.
- **Número da Sequência:** ordem do passo (1, 2, 3...).
- **Meta:** usar a meta padrão do tipo ou definir meta personalizada para esta sequência.
- **Meta Personalizada:** valor percentual específico, caso não use a meta padrão.
- **Checklist:** checklist associado a esta sequência (seleção entre os checklists ativos).

### 6.5. Cadastro de Checklists

Gerenciamento dos checklists utilizados nas auditorias e follow-ups.

**Campos:**

- **Nome:** nome identificador do checklist.
- **Revisão:** número da revisão atual (controle de versão).
- **Status:** Ativo ou Inativo.

**Operações:** Criar, Editar, Visualizar, Criar Nova Revisão, Ativar/Inativar.

#### 6.5.1. Versionamento de Checklists

O sistema mantém controle de versões para preservar o histórico das auditorias já realizadas:

- Antes de alterar um checklist que esteja em uso, o administrador deve criar uma nova revisão. A nova revisão pode ser criada clonando um checklist existente ou partindo do zero.
- A revisão anterior, se não estiver mais vinculada a nenhum grupo ativo, deve ser inativada pelo administrador.
- Auditorias já realizadas mantêm vínculo permanente com a revisão do checklist que foi utilizada na época, preservando o histórico.

#### 6.5.2. Cadastro de Perguntas do Checklist

Após cadastrar um checklist, o administrador cadastra as perguntas que compõem a avaliação.

**Campos:**

- **Pergunta:** texto da pergunta a ser avaliada.
- **Sequência:** ordem de exibição da pergunta.
- **Peso:** peso da pergunta no cálculo da nota.
- **Tipo de Resposta:** fixo em Sim / Não / Parcial / N/A.
- **Obrigatório Sim para Avançar:** se ativado, uma resposta diferente de "Sim" nesta pergunta impede o avanço de sequência do grupo em auditorias.

### 6.6. Cadastro de Grupos

O cadastro de grupo é realizado dentro do contexto de uma área. Cada grupo representa uma instância específica de implementação do Kaizen/TPM em um local da fábrica. Uma mesma área pode ter vários grupos.

**Campos:**

- **Tipo de Grupo:** tipo previamente cadastrado.
- **Nome do Grupo:** identificação do grupo.
- **Área:** área à qual o grupo pertence.
- **Sequência Atual:** passo atual do grupo.
- **Sequência Máxima:** até qual passo este grupo deve evoluir (pode ser menor que o máximo do tipo).

**Regras de validação:**

- A sequência atual não pode ser menor que 1.
- A sequência atual não pode ser maior que a sequência máxima definida para o grupo.
- A sequência máxima não pode exceder o número de sequências cadastradas no tipo de grupo.
- Se o grupo já está na sequência máxima, não é possível avançar.

**Regra de exclusão:**

- Grupos que já possuem ao menos uma auditoria ou follow-up registrada não podem ser excluídos, apenas inativados.

#### 6.6.1. Equipe do Grupo

Cada grupo possui sua equipe própria, composta por diferentes papéis.

**Campos:**

- **Nome da Pessoa:** nome do integrante da equipe.
- **Tipo:** Facilitador (líder do grupo), Auditor (responsável por aplicar avaliações) ou Membro (participante da equipe).

---

## 7. Processo de Auditoria e Follow-up

### 7.1. Início da Avaliação

O avaliador seleciona um grupo e escolhe entre aplicar "Auditoria" ou "Follow-up". O sistema carrega automaticamente o checklist vinculado à sequência atual do grupo e exibe o cabeçalho da avaliação para preenchimento.

### 7.2. Preenchimento do Checklist

O avaliador responde cada pergunta conforme as seguintes regras:

| Resposta | Valor para Cálculo | Ação Requerida |
|----------|-------------------|----------------|
| Sim | 100% do peso da pergunta | Nenhuma ação adicional obrigatória |
| Parcial | 50% do peso da pergunta | Obrigatório informar justificativa |
| Não | 0% | Obrigatório informar justificativa |
| N/A | Pergunta removida do cálculo | Nenhuma ação adicional |

Para respostas "Não" ou "Parcial", o avaliador deve obrigatoriamente informar uma justificativa. Em qualquer pergunta, o avaliador pode anexar fotos ou documentos como evidência.

### 7.3. Cálculo da Nota

A nota final é calculada com base nos pesos das perguntas:

**Nota = (Soma dos Pontos Obtidos / Soma dos Pontos Possíveis) × 100%**

Onde: Pontos Obtidos = Peso da pergunta × Valor da resposta, para cada pergunta respondida. Perguntas marcadas como N/A são excluídas tanto do numerador quanto do denominador.

### 7.4. Progressão de Sequência (Apenas Auditorias)

Ao finalizar uma auditoria, o sistema verifica se o grupo está apto a avançar de sequência.

**Critérios para elegibilidade de avanço (todos devem ser atendidos simultaneamente):**

1. A nota final atingiu ou superou a meta definida para a sequência atual.
2. Todas as perguntas marcadas como "Obrigatório Sim para Avançar" foram respondidas com "Sim".
3. O grupo não está na sua sequência máxima.

**Decisão de avanço:**

Quando todos os critérios são atendidos, o sistema exibe um alerta informando que o grupo atingiu os requisitos para avançar e apresenta as opções:

- "Avançar para próxima sequência"
- "Manter na sequência atual"

O avaliador deve obrigatoriamente selecionar uma opção antes de finalizar a auditoria. A decisão é registrada no histórico.

**Importante:** esta funcionalidade de decisão de avanço existe apenas em auditorias. Follow-ups nunca permitem avanço de sequência.

---

## 8. Relatório Executivo (Portal)

O portal da unidade apresenta um relatório executivo com visão gerencial do andamento da metodologia. Este relatório não substitui ferramentas de BI mais robustas (previstas para o futuro), mas oferece um panorama imediato e acessível dentro do próprio sistema.

**Indicadores e visões disponíveis:**

- **Panorama geral por gerência:** quantidade de grupos, nota média, percentual de grupos que atingiram a sequência máxima.
- **Panorama por área:** detalhamento por área dentro de cada gerência, com os mesmos indicadores.
- **Panorama por tipo de grupo:** visão cruzada por tipo (Administrativo, Operacional, 5S etc.), permitindo comparar o desempenho entre tipos.
- **Evolução temporal das notas:** gráfico mostrando a tendência das notas médias ao longo dos meses, segmentável por gerência, área ou tipo.
- **Ranking de grupos:** grupos ordenados pela nota da última auditoria, destacando os melhores e os que precisam de atenção.
- **Grupos sem avaliação recente:** lista de grupos que estão há mais tempo sem receber auditoria, útil para planejamento de agenda.
- **Taxa de avanço de sequência:** percentual de auditorias que resultaram em avanço, indicando a efetividade geral do programa.

**Filtros do relatório:**

- Gerência
- Área
- Tipo de grupo
- Período

---

## 9. Regras de Negócio Consolidadas

1. Cada unidade fabril é um ambiente totalmente independente, sem compartilhamento de dados.
2. Um usuário pode acumular mais de um perfil de acesso (ex: Administrador e Avaliador).
3. Todas as telas são visíveis para todos os perfis, mas funcionalidades restritas exibem mensagem de acesso negado.
4. Um grupo com auditoria ou follow-up registrado não pode ser excluído, apenas inativado.
5. Auditorias já realizadas mantêm vínculo permanente com a revisão do checklist utilizada, mesmo que o checklist seja alterado posteriormente.
6. A progressão de sequência é exclusiva de auditorias; follow-ups nunca permitem avanço.
7. A decisão de avanço ou permanência é obrigatória quando o grupo atinge os critérios — o avaliador não pode finalizar a auditoria sem escolher.
8. Perguntas marcadas como N/A são totalmente excluídas do cálculo da nota (não contam nem como ponto possível nem como ponto obtido).
9. Justificativas são obrigatórias para respostas "Não" e "Parcial".
10. Uma mesma área pode ter vários grupos cadastrados.
11. A sequência máxima de um grupo pode ser menor que o total de sequências do seu tipo, permitindo que grupos diferentes evoluam até patamares diferentes.
