export interface Evidence { type: 'pdf' | 'image' | 'video' | 'external'; title: string; url: string }
export interface Requirement { id: number; planetId: string; title: string; officialDescription: string; completionDate?: string; summary?: string; status: 'completed' | 'pending' | 'review'; evidences: Evidence[] }
export interface PlanetData { id: string; name: string; tagline: string; color: string; glow: string; position: [number,number,number]; environment: 'desert'|'forest'|'temple'|'mountain'|'ice' }
export const planets: PlanetData[] = [
 {id:'missao',name:'Missão',tagline:'Servir. Compartilhar. Transformar.',color:'#d98a58',glow:'#764936',position:[-7,0,2],environment:'desert'},
 {id:'relacionamento',name:'Relacionamento',tagline:'A jornada se constrói em comunidade.',color:'#77b99b',glow:'#274c43',position:[-4,0,-6],environment:'forest'},
 {id:'comunhao',name:'Comunhão',tagline:'Tempo com Deus, fundamento da missão.',color:'#e3c58c',glow:'#777068',position:[4,0,-6],environment:'temple'},
 {id:'lideranca',name:'Liderança',tagline:'Desenvolver pessoas para servir.',color:'#aa91d0',glow:'#49445d',position:[7,0,1.5],environment:'mountain'},
 {id:'pre-requisitos',name:'Pré-requisitos',tagline:'Os fundamentos de um compromisso.',color:'#a1dce6',glow:'#587783',position:[1,0,7],environment:'ice'}
];
const entries: [string, [number,string][]][] = [
 ['missao',[[24,'Projeto Reencontro / Missão Resgate.'],[27,'Estudos bíblicos ou classe bíblica por seis meses.'],[25,'Desafio missionário criativo ou projeto social.'],[23,'Participação ativa em cinco projetos missionários ou OYiM/SVA.'],[26,'Evangelismo público, como Missão Calebe.']]],
 ['relacionamento',[[21,'Dois programas de sociabilização para jovens.'],[19,'Participação ou liderança em Pequeno Grupo por pelo menos um ano.'],[22,'Projeto de exercícios físicos e estilo de vida durante três meses.'],[20,'Três lições criativas compartilhadas em pequenos grupos.']]],
 ['comunhao',[[18,'Palestra sobre uma das 28 crenças adventistas.'],[16,'Filme Como Tudo Começou ou livro Nossa Herança.'],[11,'Projeto #PrimeiroDeus e diário de 40 dias.'],[13,'Livro Salvação e Serviço e exame.'],[15,'Livro Mensagens aos Jovens.'],[14,'Livro Caminho a Cristo.'],[17,'Seminário sobre crenças distintivas da IASD.'],[12,'Assinatura da Lição da Escola Sabatina.']]],
 ['lideranca',[[30,'Crescimento como líder e desenvolvimento de outros líderes.'],[28,'Duas palestras de liderança documentadas.'],[31,'Reflexão final sobre o desenvolvimento nas dez competências do PDL JÁ.'],[29,'Dois programas para culto jovem.']]],
 ['pre-requisitos',[[9,'Idade mínima para início e investidura.'],[8,'Prazo de conclusão da classe.'],[6,'Reflexão sobre os ideais do Ministério Jovem.'],[3,'Harmonia com os princípios da igreja e fidelidade nos dízimos.'],[10,'Apresentação do portfólio do líder.'],[4,'Participação em clube de líderes ou acompanhamento autorizado.'],[7,'Curso de Liderança do Ministério Jovem / PDL JÁ.'],[5,'Participação ativa no Ministério Jovem.'],[1,'Ser membro batizado da IASD.'],[2,'Recomendação da comissão da igreja local.']]]
];
// Dados fornecidos na especificação. Nenhuma conclusão ou evidência é presumida.
export const requirements: Requirement[] = entries.flatMap(([planetId,items])=>items.map(([id,title])=>({id,planetId,title,officialDescription:title,status:'pending' as const,evidences:[]})));
export const forPlanet = (id:string)=>requirements.filter(r=>r.planetId===id && ![22,23,26].includes(r.id)).sort((a,b)=>a.id-b.id);
import { planets as legacy } from './legacy-data';
const legacyMapping: Record<number,string[]> = {11:['devocao'],23:['servico'],27:['ensino'],6:['lideranca'],10:['identidade']};
for (const requirement of requirements) {
 const sources=legacyMapping[requirement.id];
 if(sources){
  requirement.status='review';
  requirement.summary=legacy.filter(p=>sources.includes(p.id)).flatMap(p=>p.stops.map(s=>`${s.title}: ${s.description}`)).join('\n\n');
 }
}
// Os links legados permanecem em legacy-data.ts. Seus arquivos não foram entregues;
// não são publicados como evidências disponíveis nem comprovam conclusão.

// Evidence links supplied by the portfolio owner; existing texts and status stay intact.
const evidenceUrls: Record<number,string> = {
24:'https://drive.google.com/file/d/162OAX2PgrRv6pXFzy4naYHNQaZhKhHrV/view?usp=drivesdk',
27:'https://drive.google.com/file/d/1ppRs8vXKqcOg_ZqbBUZSSxVTShh5fyxO/view?usp=drivesdk',
25:'https://drive.google.com/file/d/1VCsYS_POg7l3zcEn-gx8IZ6FpAgvxpnI/view?usp=sharing',
23:'https://drive.google.com/file/d/1oxxtkwiq65vPNUGlCmYU9YC-fYuIZE72/view?usp=sharing',
26:'https://drive.google.com/file/d/1e1SReq0seiKuXmi1DgFDI0VX2CVeEIKN/view?usp=drive_link',
21:'https://drive.google.com/file/d/1JaUMFHjAAgEicobIT__-LdXcVsKPTLwZ/view?usp=drive_link',
19:'https://drive.google.com/file/d/1IZbuLnotNps4dRqrR_j8XKSRhJcgqig2/view?usp=drive_link',
22:'https://drive.google.com/file/d/1oMF_cBL7jispD_xWDubPtuOzDrfe2jA1/view?usp=drive_link',
20:'https://drive.google.com/file/d/1M5xlGnqQoqD86lmtx8mTnigFBkSksDsK/view?usp=drive_link',
18:'https://drive.google.com/file/d/1xasDdiawcB8t4L7gpNLxnF3tchr2Mvip/view?usp=drive_link',
16:'https://drive.google.com/file/d/1eCaOrGFiof99y8kmn4a7DA2JMkQHkw1r/view?usp=drive_link',
11:'https://drive.google.com/file/d/1UYfVzNIAGh1rvqyIs19V_87VQa3PpJTi/view?usp=sharing',
13:'https://drive.google.com/file/d/140-VKLpJDt4ZIFHe1cYWMo3OHjlrPZBi/view?usp=sharing',
15:'https://drive.google.com/file/d/13Q4e4onQBgiLx13AyvRR1I9tG-14efCg/view?usp=sharing',
14:'https://drive.google.com/file/d/1cDDBAVW0pN-c0qVaDcwiKhM22zDdEWsG/view?usp=sharing',
17:'https://drive.google.com/file/d/1t4KcWbHzh2LGCd3BZg8Smi4-SWoEzrKo/view?usp=drive_link',
12:'https://drive.google.com/file/d/19JqO2gG_BNVLp-0j__FjLo3q2zBoULD2/view?usp=sharing',
30:'https://drive.google.com/file/d/1H86hsYEHTb9xKSj9Nwpv_DEOFuhoTpi_/view?usp=drivesdk',
28:'https://drive.google.com/file/d/1PxDTtoqLiqWdjWWjmobvKO4yJpC1tQQm/view?usp=sharing',
31:'https://drive.google.com/file/d/1PxDTtoqLiqWdjWWjmobvKO4yJpC1tQQm/view?usp=drive_link',
29:'https://drive.google.com/file/d/1KJ4UMTMuZfsX--WY4Fby_PZ9LVH9wNkb/view?usp=sharing',
6:'https://drive.google.com/file/d/1Hg20SxXhiT5ZlEpLm_gY6nH_r6VthnoJ/view?usp=drive_link',
3:'https://drive.google.com/file/d/1up8UytLIixXwIH33Q2a2CsZVkKANWvxr/view?usp=drive_link',
4:'https://drive.google.com/file/d/1pn_xgiUF3ejM1_Hz0fx_zK2dS53dGoX0/view?usp=sharing',
7:'https://drive.google.com/file/d/1up8UytLIixXwIH33Q2a2CsZVkKANWvxr/view?usp=drive_link',
5:'https://drive.google.com/file/d/1LlSMuxlA4M4q5dRTzClAOi13hwcb8h9X/view?usp=sharing',
1:'https://drive.google.com/file/d/1Oe2a2qJI0sXGvy13HnX_bVKXsRspKgqO/view?usp=drive_link',
2:'https://drive.google.com/file/d/1Oe2a2qJI0sXGvy13HnX_bVKXsRspKgqO/view?usp=drive_link'
};
for(const requirement of requirements){
 const url=evidenceUrls[requirement.id];
 if(url)requirement.evidences.push({type:'external',title:'Evid\u00eancia do requisito '+requirement.id,url});
}

// Numbering follows the owner's TXT, including the three hidden prerequisites.
const txtOrder=[24,27,25,23,26,21,19,22,20,18,16,11,13,15,14,17,12,30,28,31,29,9,8,6,3,10,4,7,5,1,2];
for(const requirement of requirements){
 requirement.id=txtOrder.indexOf(requirement.id)+1;
 requirement.status='completed';
 for(const evidence of requirement.evidences)evidence.title='Evid\u00eancia do requisito '+requirement.id;
}
requirements.sort((a,b)=>a.id-b.id);
