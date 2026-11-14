# Missão Maranata

Portfólio do Cartão de Líder Jovem de Lucas de Souza Bastos · Igreja Petrópolis · Sociedade Jovem Atalaia. Base existente preservada: React 19, TypeScript, Vite, Three.js, React Three Fiber e Drei. Sem backend.

## Executar

```sh
npm install
npm run dev
npm run build
npm run preview
```

No PowerShell com scripts desabilitados, use `npm.cmd`. Se o sandbox impedir o empacotamento da configuração do Vite, use `npm.cmd run build -- --configLoader runner` e `npm.cmd run dev -- --configLoader runner`.

## Experiência implementada

- Cinco planetas 3D em uma galáxia espiral, com núcleo, órbitas, rotas curvas, rotação, realce e seleção por toque, mouse ou botões HTML.
- Viagem por curva com orientação da nave e câmera acompanhando a trajetória; retorno ao mapa a qualquer momento.
- Cinco ambientes usando uma mecânica compartilhada: deserto, floresta com lago, templos, montanhas e gelo. Apenas o ambiente ativo é montado.
- Caminhada em terceira pessoa por WASD/setas; Shift para correr; E ou botão para abrir uma estação próxima. Controles de toque no celular.
- Personagem e mentor originais em GLB, com esqueleto e animações idle, walking e running. Mentor acompanha à distância. Sem física ou combate.
- Lista acessível de requisitos como alternativa à exploração; painel modal com anterior/próximo, estados, resumo e visualizador de PDF, imagem e vídeo. Links de arquivos Google Drive são convertidos para preview; permissões do serviço continuam aplicáveis.
- Preferência de movimento reduzido, DPR limitado e adaptativo, cena carregada sob demanda, alternativa HTML quando WebGL falha.

## Conteúdo e preservação

`src/data.ts` contém os 31 IDs, em sua ordem e categorias fornecidas. `officialDescription` contém o texto da especificação recebida, sem alegar transcrição de um formulário não entregue.

`src/legacy-data.ts` preserva integralmente os dados anteriores, incluindo datas, observações e links. Registros relacionados foram associados aos requisitos 6, 10, 11, 23 e 27 como **a revisar**. Os demais estão pendentes. Não há conclusões presumidas.

As pastas originais `public/images` e `public/documents` estavam vazias. Assim, os links legados não são apresentados como evidências disponíveis. Nenhuma atividade, data de conclusão ou prova foi inventada. Para disponibilizar arquivos reais, coloque-os em `public` e cadastre `evidences` no requisito correspondente:

```ts
evidences: [{ type: 'pdf', title: 'Título do documento real', url: '/documents/arquivo.pdf' }]
```

Use `status: 'completed'` e `completionDate` apenas após confirmar a conclusão real. Progresso do cartão é separado de mundos explorados; visitar um planeta não conclui requisitos.

## Personagens e modelos

`public/models/characters/explorer.glb` e `mentor.glb` são modelos originais gerados com malhas otimizadas e esqueleto pelo script `scripts/create-characters.mjs`. Aproximadamente 108 e 123 KiB. Para regenerar: `node scripts/create-characters.mjs`.

Não são modelos oficiais de Jedi ou Yoda. O explorador usa túnica e o mentor é um pequeno alienígena original. O mentor simboliza orientação e sabedoria; não é uma representação doutrinária literal do Espírito Santo. Não há falas bíblicas atribuídas ao personagem.

Foi pesquisado o catálogo Sketchfab. Resultados de personagens da franquia não foram incorporados: a licença anunciada pelo uploader não confirma por si só a autorização sobre a franquia. Uma substituição futura deve verificar licença, autoria, tamanho, esqueleto e animações. Os modelos atuais não precisam de downloads externos para funcionar.

## Vercel e validação

`vercel.json` configura Vite, comando `npm run build` e saída `dist`. Importe esta pasta na Vercel. Não há variáveis de ambiente necessárias. Não foi feito deploy nesta sessão: não há projeto ou credenciais Vercel conectados.

Build de produção e verificações de dados/modelos são executáveis localmente. Verificação estrutural: `node scripts/verify.mjs`. A automação visual do navegador estava indisponível nesta sessão; controles, layout mobile e desempenho/FPS precisam de validação em dispositivos reais. A presença dos visualizadores não comprova o acesso a arquivos ainda não fornecidos.
