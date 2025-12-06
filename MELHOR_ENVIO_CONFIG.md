# 🔐 Configuração da API Melhor Envio

## ⚠️ IMPORTANTE: Configuração Manual Necessária

O arquivo `.env.local` está protegido pelo `.gitignore` por questões de segurança (correto!). Você precisa criar este arquivo manualmente.

---

## Passo a Passo

### 1. Criar o arquivo `.env.local`

Na raiz do projeto (`influetech/`), crie um arquivo chamado `.env.local` com o seguinte conteúdo:

```env
# Melhor Envio API - Sandbox (Testes)
VITE_MELHOR_ENVIO_SANDBOX=true
VITE_MELHOR_ENVIO_TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NTYiLCJqdGkiOiJhYjgxYzhhMWViMTJjZjYyMjg1OWIxNTQ2NDEwZDZkMWZjOWExMzk3ZGFjYjg1YjU3NTgzOWRiMjk4NDA1MzQ5ZDQ0N2VlNjdiMzhiMjczNiIsImlhdCI6MTc2NDg5MzA1Mi45NzQ1MzYsIm5iZiI6MTc2NDg5MzA1Mi45NzQ1MzgsImV4cCI6MTc5NjQyOTA1Mi45NjM2NzUsInN1YiI6ImEwODQxZDg2LTIzNzEtNDRlNy05ODE4LTBhM2E5ZTFlYzhhNSIsInNjb3BlcyI6WyJjYXJ0LXJlYWQiLCJjYXJ0LXdyaXRlIiwiY29tcGFuaWVzLXJlYWQiLCJjb21wYW5pZXMtd3JpdGUiLCJjb3Vwb25zLXJlYWQiLCJjb3Vwb25zLXdyaXRlIiwibm90aWZpY2F0aW9ucy1yZWFkIiwib3JkZXJzLXJlYWQiLCJwcm9kdWN0cy1yZWFkIiwicHJvZHVjdHMtZGVzdHJveSIsInByb2R1Y3RzLXdyaXRlIiwicHVyY2hhc2VzLXJlYWQiLCJzaGlwcGluZy1jYWxjdWxhdGUiLCJzaGlwcGluZy1jYW5jZWwiLCJzaGlwcGluZy1jaGVja291dCIsInNoaXBwaW5nLWNvbXBhbmllcyIsInNoaXBwaW5nLWdlbmVyYXRlIiwic2hpcHBpbmctcHJldmlldyIsInNoaXBwaW5nLXByaW50Iiwic2hpcHBpbmctc2hhcmUiLCJzaGlwcGluZy10cmFja2luZyIsImVjb21tZXJjZS1zaGlwcGluZyIsInRyYW5zYWN0aW9ucy1yZWFkIiwidXNlcnMtcmVhZCIsInVzZXJzLXdyaXRlIiwid2ViaG9va3MtcmVhZCIsIndlYmhvb2tzLXdyaXRlIiwid2ViaG9va3MtZGVsZXRlIiwidGRlYWxlci13ZWJob29rIl19.VTBYXxzYftZpdhtis-jg5fjZ_9fNrqps5V4FF_-hhQNkBRpoDq68ljLC3TtRuWaS9hJI41hD-fiDawk6b-yvGs-fR6l0FIGbaWOSaTpL29zVNbRyuHkln4BtAa53j1yIhyhB4M-h3Tty6AqbgdZvT4MbOfGjCSDGIZK8LR8NbnqPeZ8YA_UU6hFmlYlq_Dzjk0l2yVbcnLsFFx1n-FdKhLY4sXwrg267I_XJPXzXYYvGKs9R8-9QQmyS6-kEVdGuMtU31uqxypetAPgOH0lLjxEgF9l3BzlHzPvUSG521osXhJCdh2-nGP4Rx4sdg0hqrM9fzGCOTfnGrafBBYFSXws00DpPJzTzOgJ_WBgzV3IiRFKxiBftQwzODH-YILfj2u7kfinF1XV3a3wXI077Sxlc33FTponhtbKeUCjQSWpc7ssoULyxNEFFIGyewcZg5J1ERNu9mHfw3Ftyl5-22oBbpuC6R_kqDJ8N4ZETpk83MjmW9Y7iUhfupHCZGuy3fJGSRNIMyZ_al3YZrYWNW4mefh5-ELP8ngh0eL9YpoqEUJ0a8QKIaFRYMMx0wgeXRHRVb4_KvnEfS67ym1zsFW9NntuwZT0Zgl0DZXVTdBuPt2e-OO0dsxf0d2m-TiTBHAJrjJO375b2ABU0Oo0joHWOXVFdjRw1E5Or0pwM6D0

# Informações do aplicativo (obrigatório)
VITE_APP_NAME=InflueTech
VITE_APP_EMAIL=contato@influetech.com.br
```

### 2. Reiniciar o servidor

⚠️ **IMPORTANTE:** Após criar o arquivo, você **DEVE reiniciar o servidor** para que as mudanças tenham efeito:

```bash
# Pare TODOS os servidores em execução (Ctrl+C em cada terminal)
# Depois inicie novamente:
npm run dev
```

> [!CAUTION]
> O servidor **NÃO** recarrega automaticamente quando você cria `.env.local`. Você precisa parar e iniciar manualmente!

### 3. Como Funciona

O sistema agora usa um **proxy local** para evitar problemas de CORS:

1. Frontend faz requisição para `/api/melhor-envio/...`
2. Vite proxy intercepta e redireciona para `https://sandbox.melhorenvio.com.br/api/v2/...`
3. Proxy adiciona automaticamente os headers `Authorization` e `User-Agent`
4. API retorna os dados para o proxy
5. Proxy retorna para o frontend

**Vantagens:**
- ✅ Sem problemas de CORS
- ✅ Token não exposto no frontend
- ✅ Headers adicionados automaticamente

---

## ✅ Verificação

Após reiniciar, o sistema automaticamente:
- Detectará o token configurado
- Usará a API real do Melhor Envio
- Retornará valores reais de todas as transportadoras

---

## 📝 Notas

- **Sandbox:** Este token é do ambiente de testes (sandbox)
- **Produção:** Para usar em produção, gere um novo token em https://melhorenvio.com.br e altere `VITE_MELHOR_ENVIO_SANDBOX=false`
- **Segurança:** O arquivo `.env.local` nunca será commitado no Git (protegido pelo `.gitignore`)
