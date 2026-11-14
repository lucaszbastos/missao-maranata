export type Stop = { title: string; description: string; photo?: string; pdf?: string; video?: string };
export type PlanetData = { id: string; name: string; tagline: string; color: string; glow: string; guide: string; stops: Stop[] };

// Personalize cada requisito abaixo. Os nomes são uma organização editorial, não os títulos oficiais do cartão.
// Substitua as descrições ilustrativas por evidências e textos verificados antes da publicação.
export const planets: PlanetData[] = [
  { id:'identidade', name:'Origem', tagline:'Identidade e chamado', color:'#86b8e9', glow:'#326baa', guide:'Toda jornada começa quando reconhecemos nossa responsabilidade.', stops:[
    {title:'Apresentação',description:'Lucas de Souza Bastos • Igreja Adventista de Petrópolis • Sociedade Atalaia.'},
    {title:'Meu chamado',description:'Espaço para apresentar sua motivação para concluir o Cartão de Líder Jovem.'},
    {title:'Registro do requisito',description:'Anexe aqui o documento de identificação e apresentação deste requisito.',pdf:'/documents/identidade.pdf'}
  ]},
  { id:'devocao', name:'Lumina', tagline:'Devoção pessoal', color:'#74baff', glow:'#3882de', guide:'A luz que orienta os passos nasce do encontro diário com Deus.', stops:[
    {title:'Projeto #PrimeiroDeus',description:'Participação entre 19 e 28 de fevereiro de 2026.',photo:'/images/primeiro-deus.webp'},
    {title:'Diário de 40 dias',description:'Dez dias do #PrimeiroDeus e trinta dias de continuidade com Bible Plan, conforme diário produzido.',pdf:'/documents/diario-devocional.pdf'},
    {title:'Aprendizado',description:'Acrescente uma breve reflexão pessoal sobre sua rotina devocional.'}
  ]},
  { id:'servico', name:'Aurelia', tagline:'Serviço e evangelismo', color:'#f5a65c', glow:'#d57536', guide:'O propósito de uma missão se revela quando o próximo é servido.', stops:[
    {title:'Global Youth Day',description:'16 de março de 2025 • Igreja Adventista do bairro São Sebastião.',photo:'/images/global-youth-day.webp'},
    {title:'Impacto Esperança',description:'12 de abril de 2025 • Igreja Adventista do Vale do Amanhecer • SAEJ.',photo:'/images/impacto-esperanca.webp'},
    {title:'Semana de Oração Jovem',description:'Participação com pregação em 14 de setembro de 2026.',pdf:'/documents/projetos-missionarios.pdf'}
  ]},
  { id:'ensino', name:'Verdantis', tagline:'Ensino e discipulado', color:'#6ccda8', glow:'#2c997a', guide:'A sabedoria se multiplica quando é compartilhada.', stops:[
    {title:'Classes bíblicas',description:'Fevereiro a julho de 2025 • Clube Mensageiros do Altíssimo, Vale do Amanhecer.',photo:'/images/classes-biblicas.webp'},
    {title:'Estudo na academia',description:'Sessão de estudo bíblico na academia de jiu-jitsu em novembro de 2026.',video:'',photo:'/images/estudo-academia.webp'},
    {title:'Evidências',description:'Organize aqui as fotos e os registros da participação como instrutor.',pdf:'/documents/estudos-biblicos.pdf'}
  ]},
  { id:'lideranca', name:'Kyron', tagline:'Ideais e liderança', color:'#aa98ef', glow:'#7053c4', guide:'Liderar é transformar convicções em atitudes.', stops:[
    {title:'Ideais do Ministério Jovem',description:'Reflexão sobre os ideais do Ministério Jovem e sua aplicação prática.',pdf:'/documents/ideais-ministerio-jovem.pdf'},
    {title:'Apresentação',description:'Adicione fotos e slides do culto jovem ou reunião do Clube de Líderes.',photo:'/images/apresentacao-ideais.webp'},
    {title:'Lição de liderança',description:'Escreva o que a preparação e apresentação ensinaram a você.'}
  ]},
  { id:'conclusao', name:'Promessa', tagline:'Sexto requisito • personalizar', color:'#f3d38a', glow:'#d2a455', guide:'Uma etapa termina, mas o compromisso com a missão continua.', stops:[
    {title:'Sexto requisito',description:'SUBSTITUIR: insira aqui o título literal do sexto requisito do seu cartão.'},
    {title:'Atividade realizada',description:'SUBSTITUIR: acrescente datas, local, relato e fotografias do requisito.'},
    {title:'Comprovação',description:'SUBSTITUIR: coloque o PDF e as demais evidências correspondentes.'}
  ]}
];
