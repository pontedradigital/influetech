# Configuração de Variáveis na Vercel

Para que sua aplicação funcione online, a Vercel precisa das chaves de acesso ao banco de dados (que agora é o Supabase) e outras configurações.

## Passo 1: Acesse as Configurações
1. Faça login na [Vercel](https://vercel.com/dashboard).
2. Selecione o projeto **influetech**.
3. No menu superior, clique na aba **Settings** (Configurações).
4. No menu lateral esquerdo, clique em **Environment Variables**.

## Passo 2: Adicione as Variáveis
Você precisa copiar os valores do arquivo `.env` que criamos na pasta do seu projeto e adicionar um por um na Vercel.

**Variável 1:**
*   **Key:** `DATABASE_URL`
*   **Value:** (Copie o valor de `DATABASE_URL` do seu arquivo `.env`)
*   *Clique em "Save" ou "Add"*

**Variável 2:**
*   **Key:** `DIRECT_URL`
*   **Value:** (Copie o valor de `DIRECT_URL` do seu arquivo `.env`)
*   *Clique em "Save" ou "Add"*

**Variável 3 (Se houver):**
*   **Key:** `GEMINI_API_KEY`
*   **Value:** (Seu valor da chave Gemini, caso o projeto use AI)

## Passo 3: Redeploy
Depois de adicionar as variáveis, elas só valem para **novos** deploys.
1. Vá para a aba **Deployments** (no menu superior).
2. Encontre o último deploy (provavelmente está vermelho/falhando).
3. Clique nos **três pontinhos** (...) ao lado dele.
4. Selecione **Redeploy**.
5. Marque a opção "Use existing build cache" (opcional) e confirme em **Redeploy**.

Agora o site deve subir com sucesso!
