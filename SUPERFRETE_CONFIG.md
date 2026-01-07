# 📦 Configuração SuperFrete API

## 1. Token de Acesso
Adicione este token ao seu arquivo `.env.local` (crie se não existir):

```env
# SuperFrete API
SUPERFRETE_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3Njc4MDk4OTMsInN1YiI6IkU1SFp1ejFiV0ZocjloWkxXcnVZb1hNUElYajIifQ.9nohC921myyqHy39cOXvJiQra0rQogPv4B8Sp4EC5b0
SUPERFRETE_URL=https://api.superfrete.com/api/v0  # URL de Produção Verificada
```

## 2. Reiniciar Servidor
Após salvar o arquivo `.env.local`, reinicie o servidor:
```bash
npm run dev
```
