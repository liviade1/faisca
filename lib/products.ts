/**
 * Catálogo da Faísca.
 *
 * Tudo o que aparece na loja sai daqui: nome, preço, estoque inicial da fornada,
 * textos da página de produto e combinações. Para lançar uma fornada nova,
 * edite este arquivo e faça um novo deploy.
 *
 * PREÇOS: em centavos (R$ 180,00 = 18000). Enquanto o preço for 0, o produto
 * aparece como "Preço em breve" e não pode ser comprado.
 *
 * Dados da planilha de peças (Figma › Branding › Peças): nome, acabamento,
 * medidas, peso, quantidade e valor. O custo fica fora do site.
 */

export type Category = 'velas' | 'mergulho' | 'objetos';

export const CATEGORIES: Record<Category, string> = {
  velas: 'Velas em cerâmica',
  mergulho: 'Velas de mergulho',
  objetos: 'Objetos',
};

/** Cores da ilustração do pote, enquanto não houver fotos. */
export type VesselArt = {
  body: string;
  rim: string;
  paint: string;
  bg: string;
};

export type Product = {
  slug: string;
  name: string;
  category: Category;
  /** Preço em centavos. 0 = ainda sem preço (não vendável). */
  price: number;
  /** Peças na fornada atual. Com o banco ligado, o estoque real fica lá. */
  stock: number;
  /** Quem fez: "Faísca" nas peças próprias, o nome do artista nos convidados. */
  maker: string;
  edition: string;
  /** Uma linha logo abaixo do nome. */
  tagline: string;
  description: string;
  /** Ficha técnica, na ordem em que aparece. */
  details: { label: string; value: string }[];
  /** Como usar: o ritual sugerido para a peça. */
  ritual: string;
  /** Texto de cuidados ou "depois da chama". */
  care: { title: string; text: string };
  /** Slugs dos produtos sugeridos em "Combina com". */
  pairsWith: string[];
  /** Recorte sem fundo (PNG/WebP), usado na mesa da home, na sacola e quando não há foto. */
  image?: string;
  /** Fotos da página de produto, na ordem. A primeira também aparece na Loja. */
  photos?: { src: string; alt: string }[];
  /** Feito sob encomenda: sem preço fixo, o botão leva para a conversa no Instagram. */
  sobEncomenda?: boolean;
  art?: VesselArt;
  imageAlt: string;
  /**
   * Parte vazia embaixo da imagem (0 a 1), para o objeto "pousar" na linha da mesa
   * na galeria do celular. Com fotos recortadas em PNG rente à base, use 0.
   */
  ground?: number;
  /** Largura do objeto na mesa da home, em px numa fileira de 1340px. Mantém a escala real entre as peças. */
  mesa?: number;
  /** Aparece na home do celular. As demais ficam só na Loja ("Ver todos os objetos"). */
  destaque?: boolean;
};

const CERA = 'Blend de ceras naturais (abelha, palma e coco), aromatizado com perfume autoral';
const MERGULHO = ['nanica', 'ouro', 'da-terra'];
const DEPOIS_DA_CHAMA =
  'Quando a cera acabar, o pote fica. Vire-o de cabeça para baixo: a base tem um encaixe para velas de mergulho e vira castiçal. Para limpar o resto de cera, use água quente.';
const RITUAL_VELA =
  'Escolha um gesto do dia (o café, a mesa posta, a leitura antes de dormir) e acenda junto. Na primeira vez, deixe queimar até a cera derreter de borda a borda; antes de acender de novo, apare o pavio. Nunca deixe a chama sozinha.';

type VelaInput = {
  slug: string; name: string; acabamento: string; medidas: string; peso: string; price: number; stock: number;
  mesa: number; destaque?: boolean; pavios?: number; vira?: boolean; extra?: string[]; alt: string;
};

/** Vela em pote de cerâmica feito à mão. */
function vela(v: VelaInput): Product {
  const n = 1 + (v.extra?.length ?? 0);
  return {
    slug: v.slug,
    name: v.name,
    category: 'velas',
    price: v.price,
    stock: v.stock,
    maker: 'Faísca',
    edition: 'Fornada 01',
    tagline: v.acabamento,
    description:
      'Vela composta com um blend de ceras naturais (abelha, palma e coco), aromatizada com perfume autoral, num pote modelado à mão. Peça única: a sua é exatamente a da foto.',
    details: [
      { label: 'Acabamento', value: v.acabamento },
      { label: 'Medidas', value: v.medidas },
      { label: 'Peso', value: v.peso },
      { label: 'Cera', value: CERA },
      { label: 'Pavio', value: (v.pavios ?? 1) === 1 ? '1 pavio de algodão' : `${v.pavios} pavios de algodão` },
    ],
    ritual: RITUAL_VELA,
    care: v.vira
      ? { title: 'Depois da chama', text: DEPOIS_DA_CHAMA }
      : { title: 'Depois da chama', text: 'Quando a cera acabar, o pote fica: limpe o resto de cera com água quente e use para guardar fósforos, incenso ou uma flor.' },
    pairsWith: v.vira ? MERGULHO : ['cinzeiro', 'colher', 'vaso'],
    image: `/images/produtos/${v.slug}/recorte.webp`,
    imageAlt: v.alt,
    photos: Array.from({ length: n }, (_, i) => ({
      src: `/images/produtos/${v.slug}/${i + 1}.webp`,
      alt: i === 0 ? v.alt : v.extra![i - 1],
    })),
    ground: 0,
    mesa: v.mesa,
    destaque: v.destaque ?? false,
  };
}

/** Par de velas de mergulho em cera de abelha. */
function mergulho(m: { slug: string; name: string; tamanho: string; medida: string; peso: string; price: number; stock: number }): Product {
  return {
    slug: m.slug,
    name: m.name,
    category: 'mergulho',
    price: m.price,
    stock: m.stock,
    maker: 'Faísca',
    edition: 'Fornada 01',
    tagline: `2 velas de mergulho de cera de abelha natural · tamanho ${m.tamanho}`,
    description:
      'Um par de velas feitas por mergulho: o pavio desce na cera de abelha quente muitas vezes, camada por camada, até a vela ganhar corpo. Vêm unidas pelo pavio, para pendurar ou separar na hora de acender.',
    details: [
      { label: 'Conteúdo', value: '2 velas (um par)' },
      { label: 'Altura', value: m.medida },
      { label: 'Peso', value: m.peso },
      { label: 'Cera', value: 'Cera de abelha natural' },
    ],
    ritual:
      'Corte o pavio que une as duas e encaixe cada vela num castiçal firme. Os potes da Faísca, virados de cabeça para baixo, servem de castiçal. Acenda longe de correntes de ar e nunca deixe a chama sozinha.',
    care: { title: 'Cuidados', text: 'Guarde em lugar fresco, longe do sol. A cera de abelha pode ganhar um pó esbranquiçado com o tempo: é natural e sai com um pano macio.' },
    pairsWith: ['vulcao-azul', 'anciao-alcas', 'vulcao-prata'],
    image: `/images/produtos/${m.slug}/recorte.webp`,
    imageAlt: `${m.name}: par de velas de mergulho de cera de abelha unidas pelo pavio`,
    ground: 0,
  };
}

/** Objeto de metal da curadoria. */
function objeto(o: { slug: string; name: string; medidas: string; peso?: string; price: number; stock: number; description: string; ritual: string; alt: string; sobEncomenda?: boolean; fotos?: string[] }): Product {
  const fotos = o.fotos ?? [o.alt];
  return {
    slug: o.slug,
    name: o.name,
    category: 'objetos',
    price: o.price,
    stock: o.stock,
    maker: 'Curadoria Faísca',
    edition: o.sobEncomenda ? 'Sob encomenda' : 'Peça única',
    tagline: 'Metal',
    description: o.description,
    details: [
      { label: 'Material', value: 'Metal' },
      { label: 'Medidas', value: o.medidas },
      ...(o.peso ? [{ label: 'Peso', value: o.peso }] : []),
    ],
    ritual: o.ritual,
    care: { title: 'Cuidados', text: 'Limpe com pano macio e seco. O metal ganha pátina com o uso; para devolver o brilho, use um polidor próprio para metais.' },
    pairsWith: o.slug === 'castical' ? MERGULHO : ['anciao-colar', 'potinho', 'ambi'],
    image: o.slug === 'castical' ? '/images/produtos/castical/recorte.webp' : undefined,
    imageAlt: o.alt,
    photos: fotos.map((alt, i) => ({ src: `/images/produtos/${o.slug}/${i + 1}.webp`, alt })),
    sobEncomenda: o.sobEncomenda ?? false,
  };
}

/**
 * Na ordem da galeria da home: as 7 primeiras na primeira fileira da mesa, as 6
 * seguintes na segunda. Depois, as velas de mergulho e os objetos (só na Loja).
 * Preços em centavos.
 */
export const PRODUCTS: Product[] = [
  vela({ slug: 'ambi', name: 'Ambi', acabamento: 'Porcelana com esmalte de alta temperatura', medidas: '10 cm × 7,5 cm', peso: '187 g', price: 8000, stock: 1, mesa: 115, vira: true,
    alt: 'Vela Ambi num pote de porcelana esmaltada em tons de cobre e verde, em forma de chapéu', extra: ['O pote do Ambi virado, como castiçal'] }),
  vela({ slug: 'redondinho', name: 'Redondinho', acabamento: 'Terracota', medidas: '6,5 cm × 7 cm', peso: '161 g', price: 7000, stock: 1, mesa: 90, destaque: true, vira: true,
    alt: 'Vela Redondinho numa taça de terracota com pé', extra: ['O pote do Redondinho virado, como castiçal'] }),
  vela({ slug: 'vulcao-azul', name: 'Vulcão Azul', acabamento: 'Terracota com esmalte de alta temperatura', medidas: '8 cm × 5 cm', peso: '97 g', price: 7000, stock: 1, mesa: 163, vira: true,
    alt: 'Vela Vulcão Azul num pote de terracota com esmalte azul-escuro', extra: ['O pote do Vulcão Azul virado, como castiçal', 'O Vulcão Azul como castiçal, com uma vela de mergulho'] }),
  vela({ slug: 'potinho', name: 'Potinho', acabamento: 'Terracota com acabamento interno em esmalte de alta temperatura', medidas: '7,5 cm × 4 cm', peso: '186 g', price: 7000, stock: 1, mesa: 118,
    alt: 'Vela Potinho numa tigela de terracota com borda esmaltada' }),
  vela({ slug: 'anciao-rio', name: 'Ancião Rio', acabamento: 'Terracota com detalhes em esmalte de alta temperatura', medidas: '8,5 cm × 4 cm', peso: '123,5 g', price: 7500, stock: 1, mesa: 135, vira: true,
    alt: 'Vela Ancião Rio num pote de terracota com faixas azul e verde', extra: ['O pote do Ancião Rio virado, como castiçal'] }),
  vela({ slug: 'anciao-colar', name: 'Ancião Colar', acabamento: 'Terracota com adorno em murano e madrepérola', medidas: '8 cm × 6 cm × 8,5 cm', peso: '141 g', price: 8500, stock: 1, mesa: 160, destaque: true,
    alt: 'Vela Ancião Colar num pedestal de terracota com colar de contas de murano e madrepérola' }),
  vela({ slug: 'anciao-alcas', name: 'Ancião Alças', acabamento: 'Terracota', medidas: '11,5 cm × 13 cm', peso: '260 g', price: 8000, stock: 1, mesa: 140, destaque: true, vira: true,
    alt: 'Ancião Alças fechado: pote de terracota com alças e tampa com alça', extra: ['A tampa do Ancião Alças, sozinha', 'O pote do Ancião Alças com a vela', 'A tampa do Ancião Alças como castiçal, com uma vela de mergulho'] }),
  vela({ slug: 'vulcao-p', name: 'Vulcão P', acabamento: 'Terracota', medidas: '7,5 cm × 3 cm', peso: '68 g', price: 7000, stock: 1, mesa: 172, destaque: true, vira: true,
    alt: 'Vela Vulcão P num pote baixo de terracota com borda ondulada', extra: ['O pote do Vulcão P virado, como castiçal'] }),
  vela({ slug: 'vulcao-m', name: 'Vulcão M', acabamento: 'Terracota', medidas: '9,5 cm × 3,5 cm', peso: '130 g', price: 7000, stock: 1, mesa: 178, vira: true,
    alt: 'Vela Vulcão M num pote de terracota facetado', extra: ['O pote do Vulcão M virado, como castiçal'] }),
  vela({ slug: 'vulcao-gg', name: 'Vulcão GG', acabamento: 'Terracota', medidas: '9 cm × 5 cm', peso: '97,7 g', price: 7000, stock: 1, mesa: 157, vira: true,
    alt: 'Vela Vulcão GG num pote de terracota com pé alto', extra: ['O pote do Vulcão GG virado, como castiçal'] }),
  vela({ slug: 'vulcao-g', name: 'Vulcão G', acabamento: 'Terracota', medidas: '9 cm × 4,5 cm', peso: '122 g', price: 7000, stock: 1, mesa: 163, vira: true,
    alt: 'Vela Vulcão G num pote largo de terracota', extra: ['O pote do Vulcão G virado, como castiçal'] }),
  vela({ slug: 'vulcao-prata', name: 'Vulcão Prata', acabamento: 'Terracota com esmalte de alta temperatura', medidas: '10,5 cm × 5 cm', peso: '160 g', price: 9000, stock: 1, mesa: 177, pavios: 2, vira: true,
    alt: 'Vela Vulcão Prata, de dois pavios, num pote de terracota com esmalte preto e bronze', extra: ['O pote do Vulcão Prata virado, como castiçal', 'O Vulcão Prata como castiçal, com uma vela de mergulho'] }),
  vela({ slug: 'vulcao-verde', name: 'Vulcão Verde', acabamento: 'Terracota com esmalte de alta temperatura', medidas: '11 cm × 5 cm', peso: '169 g', price: 9000, stock: 1, mesa: 168, destaque: true, pavios: 2, vira: true,
    alt: 'Vela Vulcão Verde, de dois pavios, num pote de terracota com esmalte âmbar e verde', extra: ['O pote do Vulcão Verde virado, como castiçal'] }),

  mergulho({ slug: 'nanica', name: 'Nanica', tamanho: 'P', medida: '12,5 cm', peso: '24 g', price: 3000, stock: 15 }),
  mergulho({ slug: 'ouro', name: 'Ouro', tamanho: 'M', medida: '18 cm', peso: '55 g', price: 4000, stock: 7 }),
  mergulho({ slug: 'da-terra', name: 'Da Terra', tamanho: 'G', medida: '32 cm', peso: '86 g', price: 6000, stock: 13 }),

  objeto({ slug: 'cinzeiro', name: 'Cinzeiro', medidas: '5 cm × 5 cm', peso: '49,2 g', price: 12000, stock: 1,
    alt: 'Cinzeiro de metal dourado em forma de taça com pé',
    description: 'Cinzeiro de metal em forma de taça, com pé e apoio lateral. Peça única.',
    ritual: 'Para o incenso, o fósforo usado, a pausa no fim da tarde. Também serve de porta-anel ao lado da vela.' }),
  objeto({ slug: 'colher', name: 'Colher', medidas: '2 cm × 14 cm', peso: '15 g', price: 6000, stock: 1,
    alt: 'Colher de metal com cabo trabalhado',
    description: 'Colher de metal com cabo trabalhado em relevo. Peça única.',
    ritual: 'Para o açúcar do café, o mel do chá, o sal da mesa posta. Um utensílio de todo dia que pede um pouco mais de atenção.' }),
  objeto({ slug: 'vaso', name: 'Vaso', medidas: '5 cm × 5 cm × 17,5 cm', peso: '109,7 g', price: 8000, stock: 1,
    alt: 'Vaso fino de metal com uma flor amarela',
    description: 'Vaso fino de metal, para um galho ou uma flor só. Peça única.',
    ritual: 'Uma flor de cada vez. Troque a água a cada dois dias e deixe o vaso perto da janela ou ao lado da vela.' }),
  objeto({ slug: 'castical', name: 'Castiçal', medidas: '30 cm × 150 cm', price: 0, stock: 0, sobEncomenda: true,
    alt: 'Castiçal de chão de metal, com haste fina e base redonda, segurando uma vela de mergulho',
    fotos: ['Castiçal de chão de metal, com haste fina e base redonda, segurando uma vela de mergulho', 'O castiçal aceso contra uma parede de reboco terracota'],
    description: 'Castiçal de chão em metal, com 1,5 m de altura e base redonda. Feito sob encomenda para cada casa.',
    ritual: 'Um ponto de luz no chão da sala ou ao lado do altar. Encaixe uma vela de mergulho Da Terra e acenda quando o dia acabar.' }),
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function isPurchasable(p: Product): boolean {
  return p.price > 0 && !p.sobEncomenda;
}

export function productsByCategory(category?: Category): Product[] {
  return category ? PRODUCTS.filter((p) => p.category === category) : PRODUCTS;
}

export function isCategory(value: unknown): value is Category {
  return typeof value === 'string' && value in CATEGORIES;
}
