# Faísca — loja

## Checklist para colocar no ar

1. [ ] Subir esta pasta para um repositório no GitHub.
2. [ ] Importar o repositório na Vercel (Add New → Project).
3. [ ] Ligar o banco: Storage → Upstash for Redis → Connect to project.
4. [ ] Criar a aplicação no Mercado Pago (Checkout Pro) e cadastrar o webhook.
5. [ ] Cadastrar as variáveis de ambiente (Mercado Pago, domínio e **dados da empresa**).
6. [ ] Redeploy e uma compra de teste com as credenciais de teste.
7. [ ] Trocar para as credenciais de produção e ligar o domínio próprio.

O passo a passo detalhado está em "Publicar na Vercel", mais abaixo.

E-commerce da Faísca em Next.js, pronto para publicar na Vercel. Inclui home, loja com filtros, uma página para cada produto, sacola, checkout com Mercado Pago (Pix, cartão e boleto), aviso automático de pagamento, controle de estoque e lista de e-mails.

## O que tem aqui

| Caminho | O que é |
| --- | --- |
| `/` | Home: a mesa com as 13 velas em cerâmica e a seção "Em breve: Faísca & Gio Soifer" com o avise-me |
| `/loja`, `/loja?categoria=velas`, `mergulho`, `objetos` | As 20 peças, com filtro por categoria |
| `/produtos/[slug]` | Página de cada peça, com galeria de fotos, ficha e "Combina com" |
| `/sobre`, `/ajuda`, `/privacidade` | Páginas institucionais (trocas e devoluções ficam em `/ajuda#trocas`) |
| `/sacola` | Sacola, dados de entrega e botão de pagamento |
| `/pedido/aprovado`, `/pendente`, `/recusado` | Volta do Mercado Pago |
| `/api/checkout` | Confere preços e estoque no servidor e cria o pagamento |
| `/api/webhooks/mercadopago` | Recebe a confirmação do pagamento, salva o pedido e desconta o estoque |
| `/api/estoque` | Estoque atual (usado pela sacola) |
| `/api/newsletter` | Cadastro na carta |
| `/api/avise-me` | "Avise-me quando estiver disponível": grava o e-mail (POST) e baixa a lista em CSV (GET com token) |

## O catálogo

Tudo sai de **`lib/products.ts`**, preenchido com a planilha de peças do Figma (Branding › Peças):

- **13 velas em cerâmica** (Ambi, Redondinho, Vulcão Azul, Potinho, Ancião Rio, Ancião Colar, Ancião Alças, Vulcão P, M, G, GG, Prata e Verde): 1 peça de cada, R$ 70 a R$ 90.
- **3 pares de velas de mergulho** (Nanica, Ouro, Da Terra): R$ 30, R$ 40 e R$ 60.
- **4 objetos de metal** (Cinzeiro, Colher, Vaso e o Castiçal de chão, que é sob encomenda e abre a conversa no Instagram).

O custo da planilha não aparece no site. As fotos ficam em `public/images/produtos/<peça>/`: `recorte.webp` (sem fundo, usado na mesa da home e na sacola) e `1.webp`, `2.webp`… (galeria da página de produto; a primeira também aparece na Loja).

Para mudar preço ou estoque, edite o produto em `lib/products.ts` (preço em **centavos**: R$ 70 = `7000`) e faça um novo deploy. Depois que o banco estiver ligado, o estoque real passa a ficar no Upstash (ver "Repor estoque").

## Publicar na Vercel

1. **Suba o projeto para o GitHub.** Crie um repositório (pode ser privado) e envie esta pasta.
2. **Importe na Vercel.** vercel.com → Add New → Project → escolha o repositório. A Vercel reconhece o Next.js sozinha; não mude nada no build.
3. **Ligue o banco.** No projeto da Vercel: Storage → Create Database → **Upstash for Redis** (plano gratuito) → Connect to project. Isso cria `KV_REST_API_URL` e `KV_REST_API_TOKEN`.
4. **Configure o Mercado Pago.**
   - Em mercadopago.com.br/developers → Suas integrações → Criar aplicação (tipo "Pagamentos online", produto "Checkout Pro").
   - Copie o **Access Token** (comece com as credenciais de teste).
   - Em Webhooks, cadastre `https://SEU-DOMINIO/api/webhooks/mercadopago`, marque o evento **Pagamentos** e copie a **assinatura secreta**.
5. **Cadastre as variáveis** em Settings → Environment Variables (veja `.env.example`):
   - `MP_ACCESS_TOKEN`
   - `MP_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_SITE_URL` (o domínio final, ex.: `https://faisca.com.br`)
   - **dados da empresa:** `NEXT_PUBLIC_RAZAO_SOCIAL`, `NEXT_PUBLIC_CNPJ`, `NEXT_PUBLIC_EMAIL_CONTATO` e, se quiserem, `NEXT_PUBLIC_PRAZO_POSTAGEM` (dias úteis para postar). Razão social, CNPJ e e-mail são obrigatórios para vender pela internet.
   - `ADMIN_TOKEN`: senha longa para baixar a lista do avise-me (ver "Lista avise-me")
   - opcionais: `MP_MAX_INSTALLMENTS` (padrão 3) e `FRETE_FIXO` em reais (padrão 0 = frete grátis)
6. **Faça um novo deploy** (Deployments → Redeploy) para as variáveis valerem.
7. **Teste uma compra** com as credenciais e os cartões de teste do Mercado Pago. Depois troque `MP_ACCESS_TOKEN` pelo de produção.
8. **Domínio próprio:** Settings → Domains.

## Como o pagamento funciona

1. Na sacola, a pessoa preenche nome, e-mail, telefone e endereço.
2. `/api/checkout` busca os preços no catálogo (nunca confia no navegador), confere o estoque, salva o pedido como **pendente** e abre o Checkout Pro do Mercado Pago.
3. Quando o pagamento muda de status, o Mercado Pago chama o webhook. O webhook confere a assinatura, busca o pagamento na API e atualiza o pedido. Na **aprovação**, o estoque é descontado uma única vez, mesmo que o aviso chegue repetido.

## Ver os pedidos

Os pedidos ficam no Redis, nas chaves `pedido:FA-…`, e a lista ordenada em `pedidos`. Dá para consultar pelo painel do Upstash (Data Browser). Os e-mails da carta ficam em `newsletter`.

O Mercado Pago também manda um e-mail a cada venda aprovada, com os dados do pagamento.

## Lista "avise-me quando estiver disponível"

Na home, a seção **Em breve: Faísca & Gio Soifer** tem um campo de e-mail e o botão "Avise-me quando estiver disponível". Cada e-mail vai para a chave `avise:gio-soifer` no Redis (com a data em `avise:gio-soifer:datas`). E-mail repetido não duplica.

Para baixar a lista em planilha, cadastre a variável `ADMIN_TOKEN` (uma senha longa) e abra:

`https://SEU-DOMINIO/api/avise-me?lista=gio-soifer&token=SUA_SENHA`

O arquivo `avise-gio-soifer.csv` abre no Excel, Numbers ou Google Planilhas. Quando a colaboração sair, envie o aviso por um serviço de e-mail (Mailchimp, Brevo, Kit…) importando esse CSV, e depois apague a chave `avise:gio-soifer` no Data Browser do Upstash, como diz a Política de privacidade.

Para criar outra lista (outra colaboração ou peça), acrescente o nome em `LISTAS_AVISO`, em `lib/store.ts`, e use `<NotifyForm lista="novo-nome" />` na página.

## Repor estoque de uma fornada nova

Com o banco ligado, o estoque real fica no Redis (a primeira leitura copia o número de `lib/products.ts`). Para uma fornada nova, mude o valor da chave `estoque:SLUG` no Data Browser do Upstash (ex.: `estoque:nanica` = `15`).

## Rodar no computador

```bash
npm install
cp .env.example .env.local   # preencha o que tiver
npm run dev                  # http://localhost:3000
```

Sem banco, a loja funciona com o estoque fixo do catálogo e não guarda pedidos. Sem `MP_ACCESS_TOKEN`, tudo funciona menos o botão de pagamento.

## Próximos passos possíveis

- Frete por CEP (Melhor Envio ou Mercado Envios) no lugar do frete fixo.
- E-mail de confirmação próprio (Resend) disparado pelo webhook.
- Um painel simples de pedidos protegido por senha.
- Fotos reais dos produtos e uma galeria com mais de uma imagem por peça.
