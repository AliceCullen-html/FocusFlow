# 🧠 FocusFlow

**FocusFlow** é um aplicativo web de organização pessoal focado em produtividade, clareza e foco.  
Ele combina **gerenciamento de tarefas**, **Kanban** e **Pomodoro** em uma interface simples e objetiva.


<img width="1305" height="690" alt="image" src="https://github.com/user-attachments/assets/fde538dd-157c-42ff-b87c-0e772d0204b9" />


---

## 🚀 Funcionalidades

- ✅ Cadastro e login de usuários (Supabase Auth)
- 📝 Gerenciamento de tarefas (criar, editar, concluir e excluir)
- 📊 Organização visual com Kanban
- ⏱️ Temporizador Pomodoro integrado
- 🔁 Recuperação de senha por e-mail
- 🔒 Dados protegidos e autenticados por usuário

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React + JavaScript  
- **Backend / Auth / Database:** Supabase  
- **Banco de Dados:** PostgreSQL  
- **Estilo:** CSS 
- **Hospedagem:** (Vercel / Netlify – em definição)

---

## 📦 Estrutura do Projeto (exemplo)

src/
├── components/
├── pages/
├── services/
│ └── supabaseClient.js
├── hooks/
├── styles/
└── App.jsx



---

## 🔐 Autenticação

A autenticação é feita via **Supabase Auth**, incluindo:
- Login com e-mail e senha
- Criação de conta
- Recuperação de senha com link seguro
- Controle de acesso por usuário (Row Level Security)

---

## 🗃️ Banco de Dados

Principais tabelas:
- `users` (gerenciada pelo Supabase Auth)
- `tasks`
- `task_categories`
- `pomodoro_sessions` (opcional)

Todas as tarefas são associadas ao usuário autenticado.

---

## 🌱 Status do Projeto

## 🚧 Em desenvolvimento
Novas funcionalidades planejadas:

Estatísticas de produtividade

Histórico de Pomodoro

Notificações

Modo dark/light

Versão desktop/mobile

## 🤝 Contribuição

Contribuições são bem-vindas!
Sinta-se à vontade para abrir issues ou pull requests.

## 📄 Licença

Este projeto está sob a licença MIT.

## 👤 Autor

Desenvolvido por Marcus Santos
📫 Entre em contato para sugestões ou parcerias.

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/focusflow.git
